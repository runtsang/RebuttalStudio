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
  return saveAppSettings({ defaultAutosaveIntervalSeconds: normalized });
});

ipcMain.handle('projects:create', async (_event, { projectName, autosaveIntervalSeconds }) => {
  const interval = normalizeInterval(autosaveIntervalSeconds);
  const result = await createProject(projectName, interval);
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
