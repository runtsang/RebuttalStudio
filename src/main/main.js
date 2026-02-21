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
    persistNow().catch(() => {});
  }, autosaveState.intervalSeconds * 1000);
}

function queueDebouncedSave() {
  if (autosaveState.debounceId) {
    clearTimeout(autosaveState.debounceId);
  }

  autosaveState.debounceId = setTimeout(() => {
    persistNow().catch(() => {});
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

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
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
