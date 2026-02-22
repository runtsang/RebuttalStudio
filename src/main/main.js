const path = require('path');
const fs = require('fs/promises');
const { app, BrowserWindow, ipcMain } = require('electron');
const {
  createProject,
  listProjects,
  loadProject,
  saveProject,
  loadAppSettings,
  saveAppSettings,
  PROJECTS_ROOT,
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

function normalizeReviewerIdForFile(reviewerId = '') {
  const text = `${reviewerId || ''}`.trim() || 'reviewer';
  const safe = text.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64);
  return safe || 'reviewer';
}

async function saveCondensedMarkdown(reviewerId, condensedMarkdown, folderName = autosaveState.currentFolder) {
  if (!folderName) {
    throw new Error('No project is currently open.');
  }
  const safeReviewer = normalizeReviewerIdForFile(reviewerId);
  const stage4Dir = path.join(PROJECTS_ROOT, folderName, 'stage4', 'condensed');
  const filePath = path.join(stage4Dir, `${safeReviewer}.md`);
  await fs.mkdir(stage4Dir, { recursive: true });
  await fs.writeFile(filePath, `${condensedMarkdown || ''}`.trim(), 'utf8');
  return filePath;
}

async function saveStage5CondensedMarkdown(reviewerId, condensedMarkdown, folderName = autosaveState.currentFolder) {
  if (!folderName) {
    throw new Error('No project is currently open.');
  }
  const safeReviewer = normalizeReviewerIdForFile(reviewerId);
  const stage5Dir = path.join(PROJECTS_ROOT, folderName, 'stage5', 'condensed');
  const filePath = path.join(stage5Dir, `${safeReviewer}.md`);
  await fs.mkdir(stage5Dir, { recursive: true });
  await fs.writeFile(filePath, `${condensedMarkdown || ''}`.trim(), 'utf8');
  return filePath;
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

function buildStage4CondensePrompt(allSource) {
  return `You are executing the rebuttalstudio_skill -> stage4/condense/SKILL.md workflow.

Task:
- Condense the prior Stage 3 "All" discussion into a compact markdown context file.
- Preserve only high-value facts and claims.
- Keep structure short and scannable.
- Return JSON only.

JSON schema:
{
  "condensedMarkdown": "..."
}

Formatting requirements for condensedMarkdown:
- Use markdown headings and bullet points.
- Include sections: "Key Question(s)" and "Main Answer(s)".
- Keep content concise and avoid duplicated wording.
- Do not fabricate experiments, numbers, or citations.

Stage 3 All source:
${allSource}`;
}

async function runGeminiStage4Condense(profile = {}, allSource = '') {
  const apiKey = (profile.apiKey || '').trim();
  const baseUrl = (profile.baseUrl || '').trim().replace(/\/$/, '') || 'https://generativelanguage.googleapis.com/v1beta';
  const model = (profile.model || '').trim() || 'gemini-3-flash-preview';
  if (!apiKey) {
    throw new Error('Gemini API key is required.');
  }
  if (!`${allSource}`.trim()) {
    throw new Error('Stage3 All source is empty.');
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
        parts: [{ text: buildStage4CondensePrompt(allSource) }],
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
    throw new Error(`Gemini stage4 condense failed (${res.status}): ${detail.slice(0, 240)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('')?.trim();
  if (!text) {
    throw new Error('Gemini returned empty content for stage4 condense.');
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
    parsed = JSON.parse(cleaned);
  }

  const condensedMarkdown = `${parsed?.condensedMarkdown ?? parsed?.summary ?? ''}`.trim();
  if (!condensedMarkdown) {
    throw new Error('Stage4 condense did not return condensedMarkdown.');
  }

  return { condensedMarkdown, raw: parsed };
}

function buildStage4RefinePrompt(payload = {}) {
  return `You are executing the rebuttalstudio_skill -> stage4/refine/SKILL.md workflow.

Task:
- Generate a polished follow-up response for a multi-round reviewer discussion.
- Use the condensed prior discussion context + current follow-up question + user draft.
- Keep claims grounded in provided inputs.
- Return JSON only.

JSON schema:
{
  "refinedText": "..."
}

Inputs:
Condensed context markdown:
${payload.condensedMarkdown || ''}

Follow-up question text:
${payload.followupQuestion || ''}

User draft:
${payload.draft || ''}`;
}

async function runGeminiStage4Refine(profile = {}, payload = {}) {
  const apiKey = (profile.apiKey || '').trim();
  const baseUrl = (profile.baseUrl || '').trim().replace(/\/$/, '') || 'https://generativelanguage.googleapis.com/v1beta';
  const model = (profile.model || '').trim() || 'gemini-3-flash-preview';
  if (!apiKey) {
    throw new Error('Gemini API key is required.');
  }
  if (!`${payload?.condensedMarkdown || ''}`.trim()) {
    throw new Error('Condensed markdown context is empty.');
  }
  if (!`${payload?.followupQuestion || ''}`.trim() && !`${payload?.draft || ''}`.trim()) {
    throw new Error('Follow-up question and draft are both empty.');
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
        parts: [{ text: buildStage4RefinePrompt(payload) }],
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
    throw new Error(`Gemini stage4 refine failed (${res.status}): ${detail.slice(0, 240)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('')?.trim();
  if (!text) {
    throw new Error('Gemini returned empty content for stage4 refine.');
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
    parsed = JSON.parse(cleaned);
  }

  const refinedText = `${parsed?.refinedText ?? parsed?.draft ?? parsed?.response ?? ''}`.trim();
  if (!refinedText) {
    throw new Error('Stage4 refine did not return refinedText.');
  }

  return { refinedText, raw: parsed };
}

function buildStage5FinalRemarksPrompt(payload = {}) {
  const reviewerSummaries = Array.isArray(payload.reviewerSummaries) ? payload.reviewerSummaries : [];
  return `You are executing the rebuttalstudio_skill -> stage5/final-remarks/SKILL.md workflow.

Task:
- Fill a Stage5 conclusion template using all reviewers' condensed discussion markdown.
- Preserve the template section order and markdown structure.
- Replace placeholders with grounded content only.
- For {{key_strengths_points_markdown}}, output 4-5 markdown bullet points summarized from reviewers' strengths.
- Return JSON only.

JSON schema:
{
  "filledMarkdown": "..."
}

Template markdown:
${payload.templateSource || ''}

Reviewer summaries JSON:
${JSON.stringify(reviewerSummaries, null, 2)}`;
}

async function runGeminiStage5FinalRemarks(profile = {}, payload = {}) {
  const apiKey = (profile.apiKey || '').trim();
  const baseUrl = (profile.baseUrl || '').trim().replace(/\/$/, '') || 'https://generativelanguage.googleapis.com/v1beta';
  const model = (profile.model || '').trim() || 'gemini-3-flash-preview';
  if (!apiKey) {
    throw new Error('Gemini API key is required.');
  }
  if (!`${payload?.templateSource || ''}`.trim()) {
    throw new Error('Stage5 template source is empty.');
  }
  if (!Array.isArray(payload?.reviewerSummaries) || !payload.reviewerSummaries.length) {
    throw new Error('Stage5 reviewer summaries are empty.');
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
        parts: [{ text: buildStage5FinalRemarksPrompt(payload) }],
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
    throw new Error(`Gemini stage5 final remarks failed (${res.status}): ${detail.slice(0, 240)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('')?.trim();
  if (!text) {
    throw new Error('Gemini returned empty content for stage5 final remarks.');
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
    parsed = JSON.parse(cleaned);
  }

  const filledMarkdown = `${parsed?.filledMarkdown ?? parsed?.finalRemarks ?? parsed?.text ?? ''}`.trim();
  if (!filledMarkdown) {
    throw new Error('Stage5 final remarks did not return filledMarkdown.');
  }

  return { filledMarkdown, raw: parsed };
}


function buildTemplateRephrasePrompt(content) {
  return `You are executing the rebuttalstudio_skill -> polish/SKILL.md workflow.

Rephrase the following rebuttal-related message for clarity and naturalness.

Rules (follow strictly):
1. Preserve the EXACT same structure: paragraph order, greeting, sign-off, and line breaks.
2. Preserve the SAME tone — semi-formal academic. Do NOT make it overly stiff or corporate-sounding.
3. Preserve ALL placeholders verbatim (e.g. {{reviewerId}}, {{submissionId}}, X).
4. Keep meaning unchanged — do not add, remove, or alter substantive content.
5. Light touch only: fix grammar, reduce redundancy, improve word choice. Do NOT rewrite from scratch.
6. Do NOT make it sound "written by AI" or overly formal.

Return JSON only (no markdown fences) with schema: {"text":"...polished text..."}.

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

ipcMain.handle('app:stage4:condense', async (_event, payload) => {
  const providerKey = payload?.providerKey;
  const profile = payload?.profile || {};
  const allSource = `${payload?.allSource || ''}`;

  if (providerKey !== 'gemini') {
    throw new Error('Stage4 condense currently requires Gemini provider.');
  }

  return runGeminiStage4Condense(profile, allSource);
});

ipcMain.handle('app:stage4:saveCondensed', async (_event, payload) => {
  const reviewerId = `${payload?.reviewerId || ''}`.trim();
  const condensedMarkdown = `${payload?.condensedMarkdown || ''}`;
  const folderName = `${payload?.folderName || autosaveState.currentFolder || ''}`.trim();
  const pathSaved = await saveCondensedMarkdown(reviewerId, condensedMarkdown, folderName);
  return { path: pathSaved };
});

ipcMain.handle('app:stage4:refine', async (_event, payload) => {
  const providerKey = payload?.providerKey;
  const profile = payload?.profile || {};

  if (providerKey !== 'gemini') {
    throw new Error('Stage4 refine currently requires Gemini provider.');
  }

  return runGeminiStage4Refine(profile, {
    condensedMarkdown: `${payload?.condensedMarkdown || ''}`,
    followupQuestion: `${payload?.followupQuestion || ''}`,
    draft: `${payload?.draft || ''}`,
  });
});

ipcMain.handle('app:stage5:saveCondensed', async (_event, payload) => {
  const reviewerId = `${payload?.reviewerId || ''}`.trim();
  const condensedMarkdown = `${payload?.condensedMarkdown || ''}`;
  const folderName = `${payload?.folderName || autosaveState.currentFolder || ''}`.trim();
  const pathSaved = await saveStage5CondensedMarkdown(reviewerId, condensedMarkdown, folderName);
  return { path: pathSaved };
});

ipcMain.handle('app:stage5:finalize', async (_event, payload) => {
  const providerKey = payload?.providerKey;
  const profile = payload?.profile || {};
  const templateSource = `${payload?.templateSource || ''}`;
  const reviewerSummaries = Array.isArray(payload?.reviewerSummaries) ? payload.reviewerSummaries : [];

  if (providerKey !== 'gemini') {
    throw new Error('Stage5 final remarks currently requires Gemini provider.');
  }

  return runGeminiStage5FinalRemarks(profile, {
    templateSource,
    reviewerSummaries,
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
