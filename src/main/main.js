const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const {
  createProject,
  listProjects,
  loadProject,
  saveProject,
  loadAppSettings,
  saveAppSettings,
} = require('./projectService');

const MIN_AUTOSAVE_SECONDS = 10;
const MAX_AUTOSAVE_SECONDS = 1800;
const DEBOUNCE_MS = 1200;

const autosaveState = {
  currentFolder: null,
  currentDoc: null,
  intervalSeconds: 60,
  intervalId: null,
  debounceId: null,
};

function clearAutosaveTimers() {
  if (autosaveState.intervalId) {
    clearInterval(autosaveState.intervalId);
    autosaveState.intervalId = null;
  }
  if (autosaveState.debounceId) {
    clearTimeout(autosaveState.debounceId);
    autosaveState.debounceId = null;
  }
}

async function persistNow() {
  if (!autosaveState.currentFolder || !autosaveState.currentDoc) {
    return null;
  }
  autosaveState.currentDoc = await saveProject(autosaveState.currentFolder, autosaveState.currentDoc);
  return autosaveState.currentDoc;
}

function startAutosaveScheduler() {
  if (!autosaveState.currentFolder || !autosaveState.currentDoc) {
    return;
  }
  if (autosaveState.intervalId) {
    clearInterval(autosaveState.intervalId);
  }

  autosaveState.intervalId = setInterval(() => {
    persistNow().catch(() => { });
  }, autosaveState.intervalSeconds * 1000);
}

function queueDebouncedSave() {
  if (autosaveState.debounceId) {
    clearTimeout(autosaveState.debounceId);
  }

  autosaveState.debounceId = setTimeout(() => {
    persistNow().catch(() => { });
    autosaveState.debounceId = null;
  }, DEBOUNCE_MS);
}

function normalizeInterval(seconds) {
  const n = Number(seconds);
  if (!Number.isFinite(n)) {
    throw new Error('Autosave interval must be a number.');
  }
  if (n < MIN_AUTOSAVE_SECONDS || n > MAX_AUTOSAVE_SECONDS) {
    throw new Error(`Autosave interval must be between ${MIN_AUTOSAVE_SECONDS} and ${MAX_AUTOSAVE_SECONDS} seconds.`);
  }
  return Math.floor(n);
}



async function listProviderModels(providerKey, profile = {}) {
  const apiKey = (profile.apiKey || '').trim();
  const baseUrl = (profile.baseUrl || '').trim();
  if (!apiKey) {
    throw new Error('API key is required before fetching models.');
  }
  if (!baseUrl) {
    throw new Error('Base URL is required before fetching models.');
  }

  const timeoutMs = 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    if (providerKey === 'gemini') {
      const url = `${baseUrl.replace(/\/$/, '')}/models?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Failed to list Gemini models (${res.status}): ${detail.slice(0, 180)}`);
      }
      const data = await res.json();
      const names = (data.models || [])
        .map((m) => (m.name || '').replace(/^models\//, ''))
        .filter(Boolean)
        .sort();
      return { models: names, hint: 'Gemini models are loaded from Google AI Studio ListModels API.' };
    }

    const openaiCompatible = ['openai', 'deepseek', 'azureOpenai'];
    if (openaiCompatible.includes(providerKey)) {
      if (providerKey === 'azureOpenai') {
        return {
          models: [],
          hint: 'Azure OpenAI uses deployment names. Enter your deployment name in the model field.',
        };
      }
      const url = `${baseUrl.replace(/\/$/, '')}/models`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
      });
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Failed to list models (${res.status}): ${detail.slice(0, 180)}`);
      }
      const data = await res.json();
      const names = (data.data || []).map((m) => m.id).filter(Boolean).sort();
      return { models: names, hint: 'Models are listed from the provider models endpoint.' };
    }

    if (providerKey === 'anthropic') {
      return {
        models: [
          'claude-3-5-haiku-latest',
          'claude-3-5-sonnet-latest',
          'claude-3-7-sonnet-latest',
        ],
        hint: 'Anthropic does not provide a public list endpoint in this app yet. Showing common model IDs.',
      };
    }

    return { models: [], hint: 'Model listing is not supported for this provider yet.' };
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Request timed out while fetching models. Please check your network and Base URL.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildStage1IclrPrompt(content) {
  return `You are executing the rebuttalstudio_skill -> stage1/iclr/SKILL.md workflow.

Follow these requirements exactly:
1) Extract scores: rating, confidence, soundness, presentation, contribution (numbers only where found; empty string if missing).
2) Preserve summary and strength text as verbatim as possible.
3) Split weakness and question/questions into atomic issues.
4) Build responses Response1..N with fields title, source, source_id, quoted_issue.
5) quoted_issue must be verbatim.

Return JSON ONLY (no markdown fences) with this schema:
{
  "scores": {"rating":"","confidence":"","soundness":"","presentation":"","contribution":""},
  "sections": {"summary":"","strength":"","weakness":"","questions":""},
  "atomicIssues": [
    {"id":"weakness1","source":"weakness","text":"..."},
    {"id":"question1","source":"question","text":"..."}
  ],
  "responses": [
    {"id":"Response1","title":"...","source":"weakness","source_id":"weakness1","quoted_issue":"..."}
  ]
}

Reviewer content:
${content}`;
}

async function runGeminiStage1Breakdown(profile = {}, content = '') {
  const apiKey = (profile.apiKey || '').trim();
  const baseUrl = (profile.baseUrl || '').trim().replace(/\/$/, '') || 'https://generativelanguage.googleapis.com/v1beta';
  const model = (profile.model || '').trim() || 'gemini-3-flash-preview';
  if (!apiKey) {
    throw new Error('Gemini API key is required.');
  }
  if (!content.trim()) {
    throw new Error('Reviewer content is empty.');
  }

  const endpoint = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: buildStage1IclrPrompt(content) }],
      },
    ],
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gemini stage1 breakdown failed (${res.status}): ${detail.slice(0, 240)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('')?.trim();
  if (!text) {
    throw new Error('Gemini returned empty content for stage1 breakdown.');
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
    parsed = JSON.parse(cleaned);
  }

  return normalizeStage1Breakdown(parsed);
}

function normalizeStage1Breakdown(payload = {}) {
  const scoresIn = payload.scores || {};
  const sectionsIn = payload.sections || {};
  const atomicIssuesIn = Array.isArray(payload.atomicIssues) ? payload.atomicIssues : [];
  const responsesIn = Array.isArray(payload.responses) ? payload.responses : [];

  const scoreKeys = ['rating', 'confidence', 'soundness', 'presentation', 'contribution'];
  const scores = {};
  for (const key of scoreKeys) {
    scores[key] = `${scoresIn[key] ?? ''}`.trim();
  }

  const sections = {
    summary: `${sectionsIn.summary ?? ''}`.trim(),
    strength: `${sectionsIn.strength ?? ''}`.trim(),
    weakness: `${sectionsIn.weakness ?? ''}`.trim(),
    questions: `${sectionsIn.questions ?? sectionsIn.question ?? ''}`.trim(),
  };

  const atomicIssues = atomicIssuesIn
    .map((item, idx) => ({
      id: `${item?.id ?? ''}`.trim() || `issue${idx + 1}`,
      source: `${item?.source ?? ''}`.trim() || 'weakness',
      text: `${item?.text ?? item?.quoted_issue ?? ''}`.trim(),
    }))
    .filter((item) => item.text);

  const responses = responsesIn
    .map((item, idx) => ({
      id: `${item?.id ?? ''}`.trim() || `Response${idx + 1}`,
      title: `${item?.title ?? ''}`.trim() || `Regarding issue ${idx + 1}`,
      source: `${item?.source ?? ''}`.trim() || 'weakness',
      source_id: `${item?.source_id ?? ''}`.trim(),
      quoted_issue: `${item?.quoted_issue ?? ''}`.trim(),
    }))
    .filter((item) => item.quoted_issue || item.source_id);

  return {
    scores,
    sections,
    atomicIssues,
    responses,
    raw: payload,
  };
}



function buildStage2IclrPrompt(payload = {}) {
  return `You are executing the rebuttalstudio_skill -> stage2/iclr/SKILL.md workflow.

Task:
- Expand a user outline into a concise, academic rebuttal draft.
- Keep it faithful to the quoted issue.
- Preserve factual claims from the outline; do not invent numbers or experiments.
- Return JSON only.

JSON schema:
{
  "draft": "..."
}

Context:
Response ID: ${payload.responseId || ''}
Title: ${payload.title || ''}
Source: ${payload.source || ''}
Source ID: ${payload.sourceId || ''}
Quoted Issue:
${payload.quotedIssue || ''}

User Outline:
${payload.outline || ''}`;
}

async function runGeminiStage2Refine(profile = {}, payload = {}) {
  const apiKey = (profile.apiKey || '').trim();
  const baseUrl = (profile.baseUrl || '').trim().replace(/\/$/, '') || 'https://generativelanguage.googleapis.com/v1beta';
  const model = (profile.model || '').trim() || 'gemini-3-flash-preview';
  if (!apiKey) {
    throw new Error('Gemini API key is required.');
  }
  if (!`${payload?.outline || ''}`.trim()) {
    throw new Error('Response outline is empty.');
  }

  const endpoint = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: buildStage2IclrPrompt(payload) }],
      },
    ],
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gemini stage2 refine failed (${res.status}): ${detail.slice(0, 240)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('')?.trim();
  if (!text) {
    throw new Error('Gemini returned empty content for stage2 refine.');
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
    parsed = JSON.parse(cleaned);
  }

  const draft = `${parsed?.draft ?? parsed?.response ?? ''}`.trim();
  if (!draft) {
    throw new Error('Stage2 refine did not return a valid draft field.');
  }

  return { draft, raw: parsed };
}


function buildTemplateRephrasePrompt(content) {
  return `Please rephrase the following rebuttal message.
Requirements:
- Keep meaning unchanged.
- Keep it polite, concise, and professional.
- Keep placeholders such as X unchanged if present.
Return JSON only with schema: {"text":"..."}.

Text:
${content}`;
}

async function runGeminiTemplateRephrase(profile = {}, content = '') {
  const apiKey = (profile.apiKey || '').trim();
  const baseUrl = (profile.baseUrl || '').trim().replace(/\/$/, '') || 'https://generativelanguage.googleapis.com/v1beta';
  const model = (profile.model || '').trim() || 'gemini-3-flash-preview';
  if (!apiKey) throw new Error('Gemini API key is required.');
  if (!`${content}`.trim()) throw new Error('Template content is empty.');

  const endpoint = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    generationConfig: { temperature: 0.5, responseMimeType: 'application/json' },
    contents: [{ role: 'user', parts: [{ text: buildTemplateRephrasePrompt(content) }] }],
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Template rephrase failed (${res.status}): ${detail.slice(0, 240)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('')?.trim();
  if (!text) throw new Error('Gemini returned empty content for template rephrase.');

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
    parsed = JSON.parse(cleaned);
  }

  const out = `${parsed?.text ?? parsed?.draft ?? ''}`.trim();
  if (!out) throw new Error('Template rephrase did not return text.');
  return { text: out, raw: parsed };
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1800,
    height: 1280,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  clearAutosaveTimers();
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('projects:list', async () => listProjects());
ipcMain.handle('app:settings:get', async () => loadAppSettings());
ipcMain.handle('app:settings:updateDefaultInterval', async (_event, seconds) => {
  const normalized = normalizeInterval(seconds);
  const current = await loadAppSettings();
  return saveAppSettings({ ...current, defaultAutosaveIntervalSeconds: normalized });
});

ipcMain.handle('app:api:getSettings', async () => {
  const settings = await loadAppSettings();
  return {
    activeApiProvider: settings.activeApiProvider,
    apiProfiles: settings.apiProfiles,
  };
});

ipcMain.handle('app:api:updateSettings', async (_event, payload) => {
  const current = await loadAppSettings();
  const next = {
    ...current,
    activeApiProvider: payload?.activeApiProvider || current.activeApiProvider,
    apiProfiles: payload?.apiProfiles || current.apiProfiles,
  };
  const saved = await saveAppSettings(next);
  return {
    activeApiProvider: saved.activeApiProvider,
    apiProfiles: saved.apiProfiles,
  };
});



ipcMain.handle('app:stage1:breakdown', async (_event, payload) => {
  const providerKey = payload?.providerKey;
  const profile = payload?.profile || {};
  const content = `${payload?.content || ''}`;

  if (providerKey !== 'gemini') {
    throw new Error('Stage1 breakdown currently requires Gemini provider.');
  }

  return runGeminiStage1Breakdown(profile, content);
});

ipcMain.handle('app:stage2:refine', async (_event, payload) => {
  const providerKey = payload?.providerKey;
  const profile = payload?.profile || {};

  if (providerKey !== 'gemini') {
    throw new Error('Stage2 refine currently requires Gemini provider.');
  }

  return runGeminiStage2Refine(profile, {
    responseId: `${payload?.responseId || ''}`,
    title: `${payload?.title || ''}`,
    source: `${payload?.source || ''}`,
    sourceId: `${payload?.sourceId || ''}`,
    quotedIssue: `${payload?.quotedIssue || ''}`,
    outline: `${payload?.outline || ''}`,
  });
});


ipcMain.handle('app:template:rephrase', async (_event, payload) => {
  const providerKey = payload?.providerKey;
  const profile = payload?.profile || {};
  const content = `${payload?.content || ''}`;

  if (providerKey !== 'gemini') {
    throw new Error('Template AI polish currently requires Gemini provider.');
  }

  return runGeminiTemplateRephrase(profile, content);
});

ipcMain.handle('app:api:listModels', async (_event, payload) => {
  const providerKey = payload?.providerKey;
  const profile = payload?.profile || {};
  return listProviderModels(providerKey, profile);
});

ipcMain.handle('projects:create', async (_event, { projectName, conference, autosaveIntervalSeconds }) => {
  const interval = normalizeInterval(autosaveIntervalSeconds);
  const result = await createProject(projectName, conference, interval);
  autosaveState.currentFolder = result.folderName;
  autosaveState.currentDoc = result.doc;
  autosaveState.intervalSeconds = interval;
  clearAutosaveTimers();
  startAutosaveScheduler();
  return result;
});

ipcMain.handle('projects:open', async (_event, folderName) => {
  const doc = await loadProject(folderName);
  const interval = normalizeInterval(doc.autosaveIntervalSeconds || 60);
  autosaveState.currentFolder = folderName;
  autosaveState.currentDoc = doc;
  autosaveState.intervalSeconds = interval;
  clearAutosaveTimers();
  startAutosaveScheduler();
  return { folderName, doc };
});

ipcMain.handle('projects:updateState', async (_event, { folderName, doc }) => {
  if (folderName !== autosaveState.currentFolder) {
    autosaveState.currentFolder = folderName;
  }
  autosaveState.currentDoc = doc;
  queueDebouncedSave();
  return { ok: true };
});

ipcMain.handle('projects:saveNow', async () => {
  const doc = await persistNow();
  return { doc };
});

ipcMain.handle('projects:setAutosaveInterval', async (_event, seconds) => {
  const interval = normalizeInterval(seconds);
  if (!autosaveState.currentDoc) {
    throw new Error('No project is currently open.');
  }
  autosaveState.intervalSeconds = interval;
  autosaveState.currentDoc.autosaveIntervalSeconds = interval;
  await persistNow();
  startAutosaveScheduler();
  return { intervalSeconds: interval, doc: autosaveState.currentDoc };
});
