const path = require('path');
const fs = require('fs/promises');
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const HTMLtoDOCX = require('html-to-docx');
const {
  createProject,
  listProjects,
  loadProject,
  renameProject,
  copyProject,
  createProjectSnapshot,
  listProjectSnapshots,
  restoreProjectSnapshot,
  deleteProject,
  saveProject,
  loadAppSettings,
  saveAppSettings,
  loadTokenUsage,
  saveTokenUsage,
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

const OPENAI_COMPATIBLE_PROVIDER_LABELS = {
  openai: 'OpenAI',
  deepseek: 'DeepSeek',
  azureOpenai: 'Azure OpenAI',
  qwen: 'Qwen',
  custom: 'OpenAI-compatible provider',
  openrouter: 'OpenRouter',
  groq: 'Groq',
  grok: 'xAI Grok',
  together: 'Together AI',
  kimi: 'Kimi',
  minimax: 'MiniMax',
  huggingface: 'Hugging Face',
  portkey: 'Portkey',
  bedrock: 'AWS Bedrock',
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

function tryParseJson(text = '') {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function getOpenAICompatibleProviderLabel(providerKey = '', baseUrl = '') {
  if (OPENAI_COMPATIBLE_PROVIDER_LABELS[providerKey]) {
    return OPENAI_COMPATIBLE_PROVIDER_LABELS[providerKey];
  }

  const url = `${baseUrl || ''}`.toLowerCase();
  if (url.includes('deepseek.com')) return 'DeepSeek';
  if (url.includes('openrouter.ai')) return 'OpenRouter';
  if (url.includes('groq.com')) return 'Groq';
  if (url.includes('x.ai')) return 'xAI Grok';
  if (url.includes('together.ai')) return 'Together AI';
  if (url.includes('moonshot.cn')) return 'Kimi';
  if (url.includes('minimax')) return 'MiniMax';
  if (url.includes('huggingface.co')) return 'Hugging Face';
  if (url.includes('portkey.ai')) return 'Portkey';
  if (url.includes('amazonaws.com')) return 'AWS Bedrock';
  if (url.includes('openai.com')) return 'OpenAI';

  return 'OpenAI-compatible provider';
}

function formatOpenAICompatibleError({ providerKey = '', baseUrl = '', status = 0, detail = '', action = 'request' }) {
  const providerLabel = getOpenAICompatibleProviderLabel(providerKey, baseUrl);
  const parsed = tryParseJson(detail);
  const message = `${parsed?.error?.message || parsed?.message || ''}`.trim();
  const type = `${parsed?.error?.type || parsed?.type || ''}`.trim();
  const code = `${parsed?.error?.code || parsed?.code || ''}`.trim();
  const combined = [message, type, code].join(' ').toLowerCase();
  const shortDetail = `${message || detail}`.replace(/\s+/g, ' ').trim().slice(0, 240);

  if (status === 402 || combined.includes('insufficient balance')) {
    const ownerLabel = providerLabel === 'OpenAI-compatible provider' ? 'provider' : providerLabel;
    return `${providerLabel} API returned 402 Insufficient Balance. Your ${ownerLabel} account has no available credit or billing is not enabled. Please top up the account, enable billing, or switch to another API key/provider in API Settings.`;
  }

  if (status === 401 || combined.includes('unauthorized') || combined.includes('invalid api key')) {
    return `${providerLabel} API returned 401 Unauthorized. Check that the API key is correct, active, and belongs to the selected provider.`;
  }

  if (status === 429 || combined.includes('rate limit') || combined.includes('quota')) {
    return `${providerLabel} API returned 429 Too Many Requests. You hit a rate or quota limit. Wait and retry, reduce request frequency, or upgrade your quota.`;
  }

  if (status === 404 || combined.includes('model not found') || combined.includes('no such model')) {
    return `${providerLabel} API returned 404 Not Found. Check that the Base URL and model name are correct for the selected provider.`;
  }

  if (status === 400 && combined.includes('response_format')) {
    return `${providerLabel} API rejected the JSON response format requested by Rebuttal Studio. Try a model that supports JSON output, or switch to a provider/model known to support OpenAI-compatible JSON mode.`;
  }

  return `${providerLabel} ${action} failed (${status}): ${shortDetail || 'Unknown error.'}`;
}

function getJsonParseErrorPosition(error) {
  const match = `${error?.message || ''}`.match(/position (\d+)/i);
  return match ? Number(match[1]) : -1;
}

function previousNonWhitespaceIndex(text = '', index = 0) {
  for (let i = index; i >= 0; i--) {
    if (!/\s/.test(text[i])) return i;
  }
  return -1;
}

function nextNonWhitespaceIndex(text = '', index = 0) {
  for (let i = index; i < text.length; i++) {
    if (!/\s/.test(text[i])) return i;
  }
  return -1;
}

function isJsonValueTerminator(text = '', index = -1) {
  if (index < 0 || index >= text.length) return false;
  const ch = text[index];
  if (ch === '}' || ch === ']' || ch === '"' || /\d/.test(ch)) return true;
  const tail = text.slice(Math.max(0, index - 4), index + 1);
  return /(true|false|null)$/.test(tail);
}

function isJsonValueStarter(text = '', index = -1) {
  if (index < 0 || index >= text.length) return false;
  const ch = text[index];
  if (ch === '{' || ch === '[' || ch === '"' || ch === '-' || /\d/.test(ch)) return true;
  return text.startsWith('true', index) || text.startsWith('false', index) || text.startsWith('null', index);
}

function repairJsonMissingCommaAtError(text = '', error) {
  const pos = getJsonParseErrorPosition(error);
  if (!Number.isFinite(pos) || pos <= 0 || pos >= text.length) {
    return text;
  }

  const left = previousNonWhitespaceIndex(text, pos - 1);
  const right = nextNonWhitespaceIndex(text, pos);
  if (left < 0 || right < 0) {
    return text;
  }

  if (!isJsonValueTerminator(text, left) || !isJsonValueStarter(text, right)) {
    return text;
  }

  if (text.slice(left + 1, right).includes(',')) {
    return text;
  }

  return `${text.slice(0, pos)},${text.slice(pos)}`;
}

function buildJsonErrorSnippet(text = '', error) {
  const pos = getJsonParseErrorPosition(error);
  if (!Number.isFinite(pos) || pos < 0) {
    return text.slice(0, 160).replace(/\s+/g, ' ').trim();
  }

  const start = Math.max(0, pos - 80);
  const end = Math.min(text.length, pos + 80);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

function escapeRegExp(text = '') {
  return `${text || ''}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripJsonFences(text = '') {
  return `${text || ''}`
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/, '')
    .trim();
}

function repairUnexpectedBarewordAtError(text = '', error) {
  const pos = getJsonParseErrorPosition(error);
  if (!Number.isFinite(pos) || pos < 0 || pos >= text.length) {
    return text;
  }

  const left = previousNonWhitespaceIndex(text, pos - 1);
  const right = nextNonWhitespaceIndex(text, pos);
  if (left < 0 || right < 0) {
    return text;
  }

  if (!isJsonValueTerminator(text, left) || !/[A-Za-z_]/.test(text[right])) {
    return text;
  }

  let end = right;
  while (end < text.length && /[A-Za-z0-9_$-]/.test(text[end])) {
    end += 1;
  }

  const next = nextNonWhitespaceIndex(text, end);
  if (next < 0) {
    return text;
  }

  const nextChar = text[next];
  if (!['{', '[', ']', '}', '"'].includes(nextChar)) {
    return text;
  }

  return `${text.slice(0, right)}${text.slice(next)}`;
}

function repairLooseJsonCandidate(candidate = '') {
  let out = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < candidate.length; i++) {
    const c = candidate[i];
    if (c === '"' && !escaped) {
      inString = !inString;
    }
    if (inString && (c === '\n' || c === '\r')) {
      out += c === '\n' ? '\\n' : '\\r';
    } else {
      out += c;
    }
    escaped = (c === '\\' && !escaped);
  }

  const lines = out.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    const next = lines[i + 1] ? lines[i + 1].trim() : '';
    const lineEndsWithValue = /(?:"|\d|true|false|null|}|\])$/.test(line);
    const nextStartsWithValue = /^(?:"|\{|\[|-?\d|true\b|false\b|null\b)/.test(next);
    const nextStartsWithCloser = /^[}\]]/.test(next);
    if (lineEndsWithValue && !line.endsWith(',') && nextStartsWithValue && !nextStartsWithCloser) {
      lines[i] = lines[i] + ',';
    }
  }

  return lines.join('\n').replace(/,\s*([\]}])/g, '$1');
}

function parseLooseJsonBlock(candidate = '') {
  const cleaned = stripJsonFences(candidate);
  try {
    return JSON.parse(cleaned);
  } catch {
    let current = repairLooseJsonCandidate(cleaned);
    let lastError = null;

    for (let attempt = 0; attempt < 16; attempt++) {
      try {
        return JSON.parse(current);
      } catch (error) {
        lastError = error;
        const withComma = repairJsonMissingCommaAtError(current, error);
        if (withComma !== current) {
          current = withComma;
          continue;
        }
        const withoutBareword = repairUnexpectedBarewordAtError(current, error);
        if (withoutBareword !== current) {
          current = withoutBareword;
          continue;
        }
        break;
      }
    }

    throw lastError || new Error('Unknown JSON parse failure.');
  }
}

function extractBalancedJsonBlock(text = '', startIndex = -1) {
  if (startIndex < 0 || startIndex >= text.length) {
    return null;
  }

  const openChar = text[startIndex];
  const closeChar = openChar === '{' ? '}' : (openChar === '[' ? ']' : '');
  if (!closeChar) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === openChar) {
      depth += 1;
      continue;
    }

    if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return {
          text: text.slice(startIndex, i + 1),
          endIndex: i,
        };
      }
    }
  }

  return null;
}

function extractFirstBalancedJsonObject(text = '') {
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== '{') continue;
    const block = extractBalancedJsonBlock(text, i);
    if (block?.text) {
      return block.text;
    }
  }
  return null;
}

function extractJsonBlockForKey(text = '', key = '', openingChar = '{') {
  const pattern = new RegExp(`(?:"${escapeRegExp(key)}"|\\b${escapeRegExp(key)}\\b)\\s*:`, 'i');
  const match = pattern.exec(text);
  if (!match) {
    return null;
  }

  const startIndex = nextNonWhitespaceIndex(text, match.index + match[0].length);
  if (startIndex < 0 || text[startIndex] !== openingChar) {
    return null;
  }

  return extractBalancedJsonBlock(text, startIndex)?.text || null;
}

function extractJsonObjectsFromLooseArrayBlock(arrayBlock = '') {
  const source = stripJsonFences(arrayBlock);
  const objects = [];

  for (let i = 0; i < source.length; i++) {
    if (source[i] !== '{') continue;
    const block = extractBalancedJsonBlock(source, i);
    if (!block?.text) continue;
    objects.push(block.text);
    i = block.endIndex;
  }

  return objects;
}

function decodeLooseJsonStringValue(raw = '') {
  try {
    return JSON.parse(`"${raw}"`);
  } catch {
    return `${raw || ''}`
      .replace(/\\r/g, '\r')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
}

function extractLooseFieldValue(text = '', key = '') {
  const quotedPattern = new RegExp(`(?:"${escapeRegExp(key)}"|\\b${escapeRegExp(key)}\\b)\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, 'is');
  const quoted = quotedPattern.exec(text);
  if (quoted?.[1] != null) {
    return decodeLooseJsonStringValue(quoted[1]).trim();
  }

  const scalarPattern = new RegExp(`(?:"${escapeRegExp(key)}"|\\b${escapeRegExp(key)}\\b)\\s*:\\s*(true|false|null|-?\\d+(?:\\.\\d+)?)`, 'i');
  const scalar = scalarPattern.exec(text);
  if (scalar?.[1] != null) {
    return `${scalar[1]}`.trim();
  }

  const plainPattern = new RegExp(`(?:"${escapeRegExp(key)}"|\\b${escapeRegExp(key)}\\b)\\s*:\\s*([^,\\n\\r}\\]]+)`, 'i');
  const plain = plainPattern.exec(text);
  if (plain?.[1] != null) {
    return `${plain[1]}`.trim().replace(/^"+|"+$/g, '');
  }

  return '';
}

function getStage1ScoreKeys(conference = 'ICLR') {
  const conf = (conference || 'ICLR').toUpperCase();
  if (conf === 'ICML') {
    return ['rating', 'confidence', 'soundness', 'presentation', 'significance', 'originality'];
  }
  if (conf === 'NEURIPS') {
    return ['rating', 'confidence', 'quality', 'clarity', 'significance', 'originality'];
  }
  if (conf === 'ARR') {
    return ['confidence', 'soundness', 'excitement', 'assessment', 'reproducibility'];
  }
  return ['rating', 'confidence', 'soundness', 'presentation', 'contribution'];
}

function salvageLooseObjectFields(text = '', keys = []) {
  const out = {};
  let found = false;

  for (const key of keys) {
    const value = extractLooseFieldValue(text, key);
    if (value) {
      out[key] = value;
      found = true;
    }
  }

  return found ? out : null;
}

function salvageStage1BreakdownPayloadFromText(text = '', conference = 'ICLR') {
  const cleaned = stripJsonFences(text);
  const payload = {
    scores: {},
    sections: {},
    atomicIssues: [],
    responses: [],
  };
  let foundAny = false;

  const scoresBlock = extractJsonBlockForKey(cleaned, 'scores', '{');
  if (scoresBlock) {
    try {
      const parsedScores = parseLooseJsonBlock(scoresBlock);
      if (parsedScores && typeof parsedScores === 'object' && !Array.isArray(parsedScores)) {
        payload.scores = parsedScores;
        foundAny = true;
      }
    } catch { }
  }
  if (!Object.keys(payload.scores).length) {
    const scoresFallback = salvageLooseObjectFields(scoresBlock || cleaned, getStage1ScoreKeys(conference));
    if (scoresFallback) {
      payload.scores = scoresFallback;
      foundAny = true;
    }
  }

  const sectionsBlock = extractJsonBlockForKey(cleaned, 'sections', '{');
  if (sectionsBlock) {
    try {
      const parsedSections = parseLooseJsonBlock(sectionsBlock);
      if (parsedSections && typeof parsedSections === 'object' && !Array.isArray(parsedSections)) {
        payload.sections = parsedSections;
        foundAny = true;
      }
    } catch { }
  }
  if (!Object.keys(payload.sections).length) {
    const sectionFallback = salvageLooseObjectFields(sectionsBlock || cleaned, ['summary', 'strength', 'weakness', 'questions', 'question', 'suggestion', 'comments']);
    if (sectionFallback) {
      payload.sections = sectionFallback;
      foundAny = true;
    }
  }

  const atomicIssuesBlock = extractJsonBlockForKey(cleaned, 'atomicIssues', '[');
  if (atomicIssuesBlock) {
    const issues = extractJsonObjectsFromLooseArrayBlock(atomicIssuesBlock)
      .map((itemText) => {
        try {
          return parseLooseJsonBlock(itemText);
        } catch {
          return salvageLooseObjectFields(itemText, ['id', 'source', 'text', 'quoted_issue']);
        }
      })
      .filter((item) => item && (item.text || item.quoted_issue));
    if (issues.length) {
      payload.atomicIssues = issues;
      foundAny = true;
    }
  }

  const responsesBlock = extractJsonBlockForKey(cleaned, 'responses', '[');
  if (responsesBlock) {
    const responses = extractJsonObjectsFromLooseArrayBlock(responsesBlock)
      .map((itemText) => {
        try {
          return parseLooseJsonBlock(itemText);
        } catch {
          return salvageLooseObjectFields(itemText, ['id', 'title', 'source', 'source_id', 'quoted_issue']);
        }
      })
      .filter((item) => item && (item.quoted_issue || item.source_id || item.title));
    if (responses.length) {
      payload.responses = responses;
      foundAny = true;
    }
  }

  return foundAny ? payload : null;
}

function salvageSingleFieldObjectFromText(text = '', fieldNames = []) {
  const cleaned = stripJsonFences(text);
  for (const fieldName of fieldNames) {
    const value = extractLooseFieldValue(cleaned, fieldName);
    if (`${value || ''}`.trim()) {
      return { [fieldName]: value };
    }
  }
  return null;
}

function buildJsonRepairRetryPrompt(prompt = '') {
  return `${prompt}

IMPORTANT:
- Return one valid JSON object only.
- Do NOT include markdown fences.
- Do NOT include headings like "Metadata".
- Do NOT include commentary, notes, or any text before or after the root JSON object.
- If some requested fields are unavailable, keep the schema and use empty strings or empty arrays instead of omitting structure.`;
}

async function requestOpenAICompatibleJson(profile = {}, prompt = '', providerKey = '', fallbackParser = null) {
  const attemptedTexts = [];
  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const actualPrompt = attempt === 0 ? prompt : buildJsonRepairRetryPrompt(prompt);
    const text = await runOpenAICompatibleRequest(profile, actualPrompt, 'application/json', providerKey);
    attemptedTexts.push(text);
    try {
      return extractJsonFromText(text);
    } catch (error) {
      lastError = error;
    }
  }

  if (fallbackParser) {
    for (let i = attemptedTexts.length - 1; i >= 0; i--) {
      const recovered = fallbackParser(attemptedTexts[i], lastError);
      if (recovered) {
        return recovered;
      }
    }
  }

  throw lastError || new Error('Failed to parse JSON response.');
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

    const openaiCompatible = ['openai', 'deepseek', 'azureOpenai', 'qwen', 'custom', 'openrouter', 'groq', 'grok', 'together', 'kimi', 'minimax', 'huggingface', 'portkey', 'bedrock'];
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
        throw new Error(formatOpenAICompatibleError({
          providerKey,
          baseUrl,
          status: res.status,
          detail,
          action: 'model listing',
        }));
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

function buildStage1Prompt(content, conference = 'ICLR') {
  const conf = (conference || 'ICLR').toUpperCase();
  const skillPath = `stage1/${conf.toLowerCase()}/skill.md`;

  let scoreKeys, sectionsSchema, atomicSources;
  if (conf === 'ICML') {
    scoreKeys = ['rating', 'confidence', 'soundness', 'presentation', 'significance', 'originality'];
    sectionsSchema = {"summary":"","strength":"","weakness":"","questions":""};
    atomicSources = 'weakness and question/questions';
  } else if (conf === 'NEURIPS') {
    scoreKeys = ['rating', 'confidence', 'quality', 'clarity', 'significance', 'originality'];
    sectionsSchema = {"summary":"","strength":"","weakness":"","questions":""};
    atomicSources = 'weakness/questions and limitations';
  } else if (conf === 'ARR') {
    scoreKeys = ['confidence', 'soundness', 'excitement', 'assessment', 'reproducibility'];
    sectionsSchema = {"summary":"","strength":"","weakness":"","suggestion":""};
    atomicSources = 'weakness and suggestion/comments';
  } else {
    scoreKeys = ['rating', 'confidence', 'soundness', 'presentation', 'contribution'];
    sectionsSchema = {"summary":"","strength":"","weakness":"","questions":""};
    atomicSources = 'weakness and question/questions';
  }

  const scoresSchema = {};
  scoreKeys.forEach(k => scoresSchema[k] = "");

  return `You are executing the skills -> ${skillPath} workflow.

Follow these requirements exactly:
1) Extract scores: ${scoreKeys.join(', ')} (numbers only where found; empty string if missing).
2) Preserve summary and strength text as verbatim as possible.
3) Split ${atomicSources} into atomic issues.
4) Build responses Response1..N with fields title, source, source_id, quoted_issue.
5) quoted_issue must be verbatim.
6) Do NOT output labels like "Metadata", "Notes", or any text outside the root JSON object.

Return JSON ONLY (no markdown fences) with this schema:
{
  "scores": ${JSON.stringify(scoresSchema)},
  "sections": ${JSON.stringify(sectionsSchema)},
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

async function runGeminiStage1Breakdown(profile = {}, content = '', conference = 'ICLR') {
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
        parts: [{ text: buildStage1Prompt(content, conference) }],
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
  await addTokenUsage(data?.usageMetadata?.promptTokenCount, data?.usageMetadata?.candidatesTokenCount);
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('')?.trim();
  if (!text) {
    throw new Error('Gemini returned empty content for stage1 breakdown.');
  }

  let parsed;
  try {
    parsed = extractJsonFromText(text);
  } catch (error) {
    parsed = salvageStage1BreakdownPayloadFromText(text, conference);
    if (!parsed) throw error;
  }

  return normalizeStage1Breakdown(parsed, conference);
}

function normalizeStage1Breakdown(payload = {}, conference = 'ICLR') {
  const scoresIn = payload.scores || {};
  const sectionsIn = payload.sections || {};
  const atomicIssuesIn = Array.isArray(payload.atomicIssues) ? payload.atomicIssues : [];
  const responsesIn = Array.isArray(payload.responses) ? payload.responses : [];

  const scoreKeys = getStage1ScoreKeys(conference);
  const scores = {};
  for (const key of scoreKeys) {
    scores[key] = `${scoresIn[key] ?? ''}`.trim();
  }

  const sections = {
    summary: `${sectionsIn.summary ?? ''}`.trim(),
    strength: `${sectionsIn.strength ?? ''}`.trim(),
    weakness: `${sectionsIn.weakness ?? ''}`.trim(),
    questions: `${sectionsIn.questions ?? sectionsIn.question ?? ''}`.trim(),
    suggestion: `${sectionsIn.suggestion ?? sectionsIn.comments ?? ''}`.trim(),
  };

  let atomicIssues = atomicIssuesIn
    .map((item, idx) => ({
      id: `${item?.id ?? ''}`.trim() || `issue${idx + 1}`,
      source: `${item?.source ?? ''}`.trim() || 'weakness',
      text: `${item?.text ?? item?.quoted_issue ?? ''}`.trim(),
    }))
    .filter((item) => item.text);

  let responses = responsesIn
    .map((item, idx) => ({
      id: `${item?.id ?? ''}`.trim() || `Response${idx + 1}`,
      title: `${item?.title ?? ''}`.trim() || `Regarding issue ${idx + 1}`,
      source: `${item?.source ?? ''}`.trim() || 'weakness',
      source_id: `${item?.source_id ?? ''}`.trim(),
      quoted_issue: `${item?.quoted_issue ?? ''}`.trim(),
    }))
    .filter((item) => item.quoted_issue || item.source_id);

  if (!atomicIssues.length && responses.length) {
    atomicIssues = responses.map((item, idx) => ({
      id: item.source_id || `${item.source || 'issue'}${idx + 1}`,
      source: item.source || 'weakness',
      text: item.quoted_issue || '',
    })).filter((item) => item.text);
  }

  if (!responses.length && atomicIssues.length) {
    responses = atomicIssues.map((item, idx) => ({
      id: `Response${idx + 1}`,
      title: `Regarding issue ${idx + 1}`,
      source: item.source || 'weakness',
      source_id: item.id,
      quoted_issue: item.text,
    }));
  }

  responses = responses
    .map((item, idx) => {
      const linkedIssue = atomicIssues.find((issue) => issue.id === item.source_id) || atomicIssues[idx] || null;
      return {
        ...item,
        source: item.source || linkedIssue?.source || 'weakness',
        source_id: item.source_id || linkedIssue?.id || '',
        quoted_issue: item.quoted_issue || linkedIssue?.text || '',
      };
    })
    .filter((item) => item.quoted_issue || item.source_id);

  atomicIssues = atomicIssues
    .map((item, idx) => {
      const linkedResponse = responses.find((resp) => resp.source_id === item.id) || responses[idx] || null;
      return {
        ...item,
        source: item.source || linkedResponse?.source || 'weakness',
        text: item.text || linkedResponse?.quoted_issue || '',
      };
    })
    .filter((item) => item.text);

  return {
    scores,
    sections,
    atomicIssues,
    responses,
    raw: payload,
  };
}



function buildStage2Prompt(payload = {}, conference = 'ICLR') {
  const conf = (conference || 'ICLR').toUpperCase();
  const skillPath = `stage2/${conf.toLowerCase()}/SKILL.md`;

  return `You are executing the skills -> ${skillPath} workflow.

Task:
- Expand a user outline into a concise, academic rebuttal draft.
- Keep it faithful to the quoted issue.
- Preserve factual claims from the outline; do not invent numbers or experiments.
- Return JSON only.

JSON schema:
{
  "draft": "> **Reviewer's Comment**: [quoted_issue]\\n\\n**Response**: [polished rebuttal prose]"
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

async function runGeminiStage2Refine(profile = {}, payload = {}, conference = 'ICLR') {
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
        parts: [{ text: buildStage2Prompt(payload, conference) }],
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
  await addTokenUsage(data?.usageMetadata?.promptTokenCount, data?.usageMetadata?.candidatesTokenCount);
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
  return `You are executing the skills -> stage4/condense/SKILL.md workflow.

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
  await addTokenUsage(data?.usageMetadata?.promptTokenCount, data?.usageMetadata?.candidatesTokenCount);
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
  return `You are executing the skills -> stage4/refine/SKILL.md workflow.

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
  await addTokenUsage(data?.usageMetadata?.promptTokenCount, data?.usageMetadata?.candidatesTokenCount);
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
  return `You are executing the skills -> stage5/final-remarks/SKILL.md workflow.

Task:
- Fill a Stage5 final remarks template using all reviewers' condensed discussion markdown.
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
  await addTokenUsage(data?.usageMetadata?.promptTokenCount, data?.usageMetadata?.candidatesTokenCount);
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


function buildWritingAntiAIPrompt(content) {
  return `You are executing the skills -> utility/stage/writing-anti-ai/SKILL.md workflow.

Remove AI-generated writing patterns from the following rebuttal text to make it sound natural, direct, and authentically human-authored.

Rules (follow strictly):
1. Cut filler phrases: remove openers like "It is worth noting that", "It is important to highlight that", "In order to address this", "Due to the fact that", "We would like to clarify that", "It goes without saying that".
2. Remove overused AI vocabulary: replace "leverage" → "use", "utilize" → "use", "demonstrate" → "show", "facilitate" → "help/enable", "comprehensive" → specific description, "novel" → describe what is actually new.
3. Cut "additionally" and "furthermore" when used as sentence openers — restructure the sentence instead.
4. Break formulaic structures: avoid negative parallelisms ("It's not just X, it's Y"), unnecessary rule-of-three lists, em-dash reveals ("X — which shows Y").
5. Trust the reader: state conclusions first, remove over-explanation and hand-holding.
6. Vary rhythm: mix short and long sentences; avoid ending every paragraph with a punchy one-liner summary.
7. Preserve ALL technical claims, experimental numbers, citation references, and placeholder tokens verbatim.
8. Do NOT alter the rebuttal format structure (e.g. "> **Reviewer's Comment**:" and "**Response**:" labels must stay intact if present).
9. Keep the same number of paragraphs and the same core meaning.
10. Do NOT rewrite from scratch — make targeted edits only.

Return JSON only (no markdown fences) with schema: {"text":"...cleaned text..."}.

Text:
${content}`;
}

async function runGeminiWritingAntiAI(profile = {}, content = '') {
  const apiKey = (profile.apiKey || '').trim();
  const baseUrl = (profile.baseUrl || '').trim().replace(/\/$/, '') || 'https://generativelanguage.googleapis.com/v1beta';
  const model = (profile.model || '').trim() || 'gemini-3-flash-preview';
  if (!apiKey) throw new Error('Gemini API key is required.');
  if (!`${content}`.trim()) throw new Error('Text content is empty.');

  const endpoint = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
    contents: [{ role: 'user', parts: [{ text: buildWritingAntiAIPrompt(content) }] }],
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Writing Anti-AI failed (${res.status}): ${detail.slice(0, 240)}`);
  }

  const data = await res.json();
  await addTokenUsage(data?.usageMetadata?.promptTokenCount, data?.usageMetadata?.candidatesTokenCount);
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('')?.trim();
  if (!text) throw new Error('Gemini returned empty content for Writing Anti-AI.');

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
    parsed = JSON.parse(cleaned);
  }

  const out = `${parsed?.text ?? parsed?.draft ?? ''}`.trim();
  if (!out) throw new Error('Writing Anti-AI did not return text.');
  return { text: out };
}

async function runOpenAIWritingAntiAI(profile = {}, content = '', providerKey = '') {
  const prompt = buildWritingAntiAIPrompt(content);
  const parsed = await requestOpenAICompatibleJson(profile, prompt, providerKey, (text) => (
    salvageSingleFieldObjectFromText(text, ['text', 'draft'])
  ));
  const out = `${parsed?.text ?? parsed?.draft ?? ''}`.trim();
  if (!out) throw new Error('Writing Anti-AI did not return text.');
  return { text: out };
}

function buildTemplateRephrasePrompt(content) {
  return `You are executing the skills -> polish/SKILL.md workflow.

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
  await addTokenUsage(data?.usageMetadata?.promptTokenCount, data?.usageMetadata?.candidatesTokenCount);
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

async function runOpenAICompatibleRequest(profile = {}, prompt = '', responseMimeType = 'text/plain', providerKey = '') {
  const apiKey = (profile.apiKey || '').trim();
  const baseUrl = (profile.baseUrl || '').trim().replace(/\/$/, '') || 'https://api.openai.com/v1';
  const model = (profile.model || '').trim() || 'gpt-3.5-turbo';
  const messages = [];
  if (responseMimeType === 'application/json') {
    messages.push({
      role: 'system',
      content: 'Return one valid JSON object only. Do not include markdown fences, headings like "Metadata", explanations, or any text before or after the JSON root object. Preserve the requested schema and use empty strings or empty arrays for missing fields.',
    });
  }
  messages.push({ role: 'user', content: prompt });

  const endpoint = `${baseUrl}/chat/completions`;
  const body = {
    model,
    messages,
    temperature: 0.1,
  };

  if (responseMimeType === 'application/json') {
    body.response_format = { type: 'json_object' };
  }

  const isOpenRouter = baseUrl.includes('openrouter.ai');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...(isOpenRouter && {
        'HTTP-Referer': 'https://github.com/runtsang/RebuttalStudio',
        'X-Title': 'Rebuttal Studio',
      }),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(formatOpenAICompatibleError({
      providerKey,
      baseUrl,
      status: res.status,
      detail,
    }));
  }

  const data = await res.json();
  await addTokenUsage(data?.usage?.prompt_tokens, data?.usage?.completion_tokens);
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('OpenAI-compatible provider returned empty content.');
  }

  return text;
}

function extractJsonFromText(text = '') {
  const trimmed = stripJsonFences(text);
  if (!trimmed) return null;
  const candidate = extractFirstBalancedJsonObject(trimmed);
  if (!candidate) {
    throw new Error(`No JSON object found in response. Body head: ${trimmed.slice(0, 100).replace(/\n/g, ' ')}...`);
  }

  try {
    return parseLooseJsonBlock(candidate);
  } catch (error) {
    throw new Error(`JSON parse error: ${error.message}. Around error: ${buildJsonErrorSnippet(candidate, error)}`);
  }
}

async function runOpenAIStage1Breakdown(profile = {}, content = '', conference = 'ICLR', providerKey = '') {
  const prompt = buildStage1Prompt(content, conference);
  const parsed = await requestOpenAICompatibleJson(profile, prompt, providerKey, (text) => (
    salvageStage1BreakdownPayloadFromText(text, conference)
  ));
  return normalizeStage1Breakdown(parsed, conference);
}

async function runOpenAIStage2Refine(profile = {}, payload = {}, conference = 'ICLR', providerKey = '') {
  const prompt = buildStage2Prompt(payload, conference);
  const parsed = await requestOpenAICompatibleJson(profile, prompt, providerKey, (text) => (
    salvageSingleFieldObjectFromText(text, ['draft', 'response'])
  ));

  const draft = `${parsed?.draft ?? parsed?.response ?? ''}`.trim();
  if (!draft) {
    throw new Error('Stage2 refine did not return a valid draft field.');
  }

  return { draft, raw: parsed };
}

async function runOpenAIStage4Condense(profile = {}, allSource = '', providerKey = '') {
  const prompt = buildStage4CondensePrompt(allSource);
  const parsed = await requestOpenAICompatibleJson(profile, prompt, providerKey, (text) => (
    salvageSingleFieldObjectFromText(text, ['condensedMarkdown', 'summary'])
  ));

  const condensedMarkdown = `${parsed?.condensedMarkdown ?? parsed?.summary ?? ''}`.trim();
  if (!condensedMarkdown) {
    throw new Error('Stage4 condense did not return condensedMarkdown.');
  }

  return { condensedMarkdown, raw: parsed };
}

async function runOpenAIStage4Refine(profile = {}, payload = {}, providerKey = '') {
  const prompt = buildStage4RefinePrompt(payload);
  const parsed = await requestOpenAICompatibleJson(profile, prompt, providerKey, (text) => (
    salvageSingleFieldObjectFromText(text, ['refinedText', 'draft', 'response'])
  ));

  const refinedText = `${parsed?.refinedText ?? parsed?.draft ?? parsed?.response ?? ''}`.trim();
  if (!refinedText) {
    throw new Error('Stage4 refine did not return refinedText.');
  }

  return { refinedText, raw: parsed };
}

async function runOpenAIStage5FinalRemarks(profile = {}, payload = {}, providerKey = '') {
  const prompt = buildStage5FinalRemarksPrompt(payload);
  const parsed = await requestOpenAICompatibleJson(profile, prompt, providerKey, (text) => (
    salvageSingleFieldObjectFromText(text, ['filledMarkdown', 'finalRemarks', 'text'])
  ));

  const filledMarkdown = `${parsed?.filledMarkdown ?? parsed?.finalRemarks ?? parsed?.text ?? ''}`.trim();
  if (!filledMarkdown) {
    throw new Error('Stage5 final remarks did not return filledMarkdown.');
  }

  return { filledMarkdown, raw: parsed };
}

async function runOpenAITemplateRephrase(profile = {}, content = '', providerKey = '') {
  const prompt = buildTemplateRephrasePrompt(content);
  const parsed = await requestOpenAICompatibleJson(profile, prompt, providerKey, (text) => (
    salvageSingleFieldObjectFromText(text, ['text', 'draft'])
  ));

  const out = `${parsed?.text ?? parsed?.draft ?? ''}`.trim();
  if (!out) throw new Error('Template rephrase did not return text.');
  return { text: out, raw: parsed };
}

// ── Session token usage accumulator ──────────────────────────
let sessionTokens = { input: 0, output: 0 };

async function initTokenUsage() {
  sessionTokens = await loadTokenUsage();
}

async function addTokenUsage(inputDelta, outputDelta) {
  sessionTokens.input += inputDelta || 0;
  sessionTokens.output += outputDelta || 0;
  await saveTokenUsage(sessionTokens);
}

function createWindow() {
  const isMac = process.platform === 'darwin';
  const win = new BrowserWindow({
    width: 1800,
    height: 1280,
    transparent: isMac,
    ...(isMac && { vibrancy: 'under-window' }),
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 20 },
    backgroundColor: isMac ? '#00000000' : '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(async () => {
  await initTokenUsage();
  createWindow();
});
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
  const conference = payload?.conference || 'ICLR';

  if (providerKey === 'gemini') {
    return runGeminiStage1Breakdown(profile, content, conference);
  } else if (['openai', 'deepseek', 'azureOpenai', 'qwen', 'custom', 'openrouter', 'groq', 'grok', 'together', 'kimi', 'minimax', 'huggingface', 'portkey', 'bedrock'].includes(providerKey)) {
    return runOpenAIStage1Breakdown(profile, content, conference, providerKey);
  } else {
    throw new Error(`Stage1 breakdown does not support provider: ${providerKey}`);
  }
});

ipcMain.handle('app:stage2:refine', async (_event, payload) => {
  const providerKey = payload?.providerKey;
  const profile = payload?.profile || {};
  const conference = payload?.conference || 'ICLR';

  const body = {
    responseId: `${payload?.responseId || ''}`,
    title: `${payload?.title || ''}`,
    source: `${payload?.source || ''}`,
    sourceId: `${payload?.source_id || payload?.sourceId || ''}`,
    quotedIssue: `${payload?.quotedIssue || ''}`,
    outline: `${payload?.outline || ''}`,
  };

  if (providerKey === 'gemini') {
    return runGeminiStage2Refine(profile, body, conference);
  } else if (['openai', 'deepseek', 'azureOpenai', 'qwen', 'custom', 'openrouter', 'groq', 'grok', 'together', 'kimi', 'minimax', 'huggingface', 'portkey', 'bedrock'].includes(providerKey)) {
    return runOpenAIStage2Refine(profile, body, conference, providerKey);
  } else {
    throw new Error(`Stage2 refine does not support provider: ${providerKey}`);
  }
});

ipcMain.handle('app:stage4:condense', async (_event, payload) => {
  const providerKey = payload?.providerKey;
  const profile = payload?.profile || {};
  const allSource = `${payload?.allSource || ''}`;

  if (providerKey === 'gemini') {
    return runGeminiStage4Condense(profile, allSource);
  } else if (['openai', 'deepseek', 'azureOpenai', 'qwen', 'custom', 'openrouter', 'groq', 'grok', 'together', 'kimi', 'minimax', 'huggingface', 'portkey', 'bedrock'].includes(providerKey)) {
    return runOpenAIStage4Condense(profile, allSource, providerKey);
  } else {
    throw new Error(`Stage4 condense does not support provider: ${providerKey}`);
  }
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

  const body = {
    condensedMarkdown: `${payload?.condensedMarkdown || ''}`,
    followupQuestion: `${payload?.followupQuestion || ''}`,
    draft: `${payload?.draft || ''}`,
  };

  if (providerKey === 'gemini') {
    return runGeminiStage4Refine(profile, body);
  } else if (['openai', 'deepseek', 'azureOpenai', 'qwen', 'custom', 'openrouter', 'groq', 'grok', 'together', 'kimi', 'minimax', 'huggingface', 'portkey', 'bedrock'].includes(providerKey)) {
    return runOpenAIStage4Refine(profile, body, providerKey);
  } else {
    throw new Error(`Stage4 refine does not support provider: ${providerKey}`);
  }
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

  if (providerKey === 'gemini') {
    return runGeminiStage5FinalRemarks(profile, {
      templateSource,
      reviewerSummaries,
    });
  } else if (['openai', 'deepseek', 'azureOpenai', 'qwen', 'custom', 'openrouter', 'groq', 'grok', 'together', 'kimi', 'minimax', 'huggingface', 'portkey', 'bedrock'].includes(providerKey)) {
    return runOpenAIStage5FinalRemarks(profile, {
      templateSource,
      reviewerSummaries,
    }, providerKey);
  } else {
    throw new Error(`Stage5 final remarks does not support provider: ${providerKey}`);
  }
});


ipcMain.handle('app:template:rephrase', async (_event, payload) => {
  const providerKey = payload?.providerKey;
  const profile = payload?.profile || {};
  const content = `${payload?.content || ''}`;

  if (providerKey === 'gemini') {
    return runGeminiTemplateRephrase(profile, content);
  } else if (['openai', 'deepseek', 'azureOpenai', 'qwen', 'custom', 'openrouter', 'groq', 'grok', 'together', 'kimi', 'minimax', 'huggingface', 'portkey', 'bedrock'].includes(providerKey)) {
    return runOpenAITemplateRephrase(profile, content, providerKey);
  } else {
    throw new Error(`Template AI polish does not support provider: ${providerKey}`);
  }
});

ipcMain.handle('app:text:antiAI', async (_event, payload) => {
  const providerKey = payload?.providerKey;
  const profile = payload?.profile || {};
  const content = `${payload?.content || ''}`;

  if (providerKey === 'gemini') {
    return runGeminiWritingAntiAI(profile, content);
  } else if (['openai', 'deepseek', 'azureOpenai', 'qwen', 'custom', 'openrouter', 'groq', 'grok', 'together', 'kimi', 'minimax', 'huggingface', 'portkey', 'bedrock'].includes(providerKey)) {
    return runOpenAIWritingAntiAI(profile, content, providerKey);
  } else {
    throw new Error(`Writing Anti-AI does not support provider: ${providerKey}`);
  }
});

ipcMain.handle('app:tokenUsage:get', () => ({ ...sessionTokens }));
ipcMain.handle('app:tokenUsage:reset', async () => {
  sessionTokens = { input: 0, output: 0 };
  await saveTokenUsage(sessionTokens);
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

ipcMain.handle('projects:rename', async (_event, { folderName, nextProjectName }) => {
  const result = await renameProject(folderName, nextProjectName);
  if (autosaveState.currentFolder === folderName) {
    autosaveState.currentFolder = result.folderName;
    autosaveState.currentDoc = result.doc;
  }
  return result;
});

ipcMain.handle('projects:delete', async (_event, folderName) => {
  await deleteProject(folderName);
  if (autosaveState.currentFolder === folderName) {
    clearAutosaveTimers();
    autosaveState.currentFolder = null;
    autosaveState.currentDoc = null;
  }
  return { ok: true };
});

ipcMain.handle('projects:copy', async (_event, folderName) => {
  if (autosaveState.currentFolder === folderName && autosaveState.currentDoc) {
    await persistNow();
  }
  return copyProject(folderName);
});

ipcMain.handle('projects:snapshot:create', async (_event, folderName) => {
  const liveDoc = autosaveState.currentFolder === folderName ? autosaveState.currentDoc : null;
  const result = await createProjectSnapshot(folderName, liveDoc);
  if (autosaveState.currentFolder === folderName) {
    autosaveState.currentDoc = result.doc;
  }
  return result;
});

ipcMain.handle('projects:snapshot:list', async (_event, folderName) => {
  const liveDoc = autosaveState.currentFolder === folderName ? autosaveState.currentDoc : null;
  return listProjectSnapshots(folderName, liveDoc);
});

ipcMain.handle('projects:snapshot:restore', async (_event, { folderName, snapshotId }) => {
  const liveDoc = autosaveState.currentFolder === folderName ? autosaveState.currentDoc : null;
  const result = await restoreProjectSnapshot(folderName, snapshotId, liveDoc);
  if (autosaveState.currentFolder === folderName) {
    autosaveState.currentDoc = result.doc;
  }
  return result;
});

ipcMain.handle('projects:exportFirstRound', async (event, { folderName, format, markdown, htmlStr }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  try {
    if (format === 'md') {
      const { filePath } = await dialog.showSaveDialog(win, {
        title: 'Export First Round (Markdown)',
        defaultPath: `FirstRound_${folderName}.md`,
        filters: [{ name: 'Markdown', extensions: ['md'] }]
      });
      if (filePath) {
        await fs.writeFile(filePath, markdown, 'utf8');
        return { success: true };
      }
    } else if (format === 'docx') {
      const { filePath } = await dialog.showSaveDialog(win, {
        title: 'Export First Round (Word)',
        defaultPath: `FirstRound_${folderName}.docx`,
        filters: [{ name: 'Word Document', extensions: ['docx'] }]
      });
      if (filePath) {
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Rebuttal</title></head>
<body>${htmlStr}</body>
</html>`;
        const docxBuffer = await HTMLtoDOCX(fullHtml, null, {
          margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        });
        await fs.writeFile(filePath, docxBuffer);
        return { success: true };
      }
    }
  } catch (err) {
    console.error('Export error:', err);
    throw err;
  }
  return { success: false, reason: 'canceled' };
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

ipcMain.handle('shell:openExternal', async (_event, url) => {
  if (typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://'))) {
    await shell.openExternal(url);
  }
});

ipcMain.handle('shell:openPath', async (_event, filePath) => {
  if (typeof filePath === 'string') {
    await shell.openPath(filePath);
  }
});
