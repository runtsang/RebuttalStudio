const fs = require('fs/promises');
const path = require('path');

const PROJECTS_ROOT = path.resolve(process.cwd(), 'projects');
const APP_SETTINGS_FILE = path.join(PROJECTS_ROOT, '_appsettings.json');
const TOKEN_USAGE_FILE = path.join(PROJECTS_ROOT, '_tokenusage.json');

const STAGE_KEYS = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5'];

const DEFAULT_API_PROFILES = {
  openai: {
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    apiKey: '',
  },
  anthropic: {
    label: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-3-5-sonnet-latest',
    apiKey: '',
  },
  gemini: {
    label: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-1.5-pro',
    apiKey: '',
  },
  deepseek: {
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    apiKey: '',
  },
  azureOpenai: {
    label: 'Azure OpenAI',
    baseUrl: '',
    model: 'gpt-4o',
    apiKey: '',
  },
};

function createDefaultAppSettings() {
  return {
    defaultAutosaveIntervalSeconds: 60,
    activeApiProvider: 'openai',
    apiProfiles: { ...DEFAULT_API_PROFILES },
  };
}

function normalizeAppSettings(raw = {}) {
  const defaults = createDefaultAppSettings();
  const apiProfiles = { ...defaults.apiProfiles };
  const rawProfiles = raw.apiProfiles || {};

  Object.keys(apiProfiles).forEach((providerKey) => {
    if (!rawProfiles[providerKey]) return;
    apiProfiles[providerKey] = {
      ...apiProfiles[providerKey],
      ...rawProfiles[providerKey],
      apiKey: typeof rawProfiles[providerKey].apiKey === 'string' ? rawProfiles[providerKey].apiKey : '',
    };
  });

  // Preserve non-default providers (e.g. openrouter, groq, grok, etc.)
  Object.keys(rawProfiles).forEach((providerKey) => {
    if (apiProfiles[providerKey]) return;
    const p = rawProfiles[providerKey];
    apiProfiles[providerKey] = {
      ...p,
      apiKey: typeof p.apiKey === 'string' ? p.apiKey : '',
    };
  });

  const activeApiProvider = apiProfiles[raw.activeApiProvider] ? raw.activeApiProvider : defaults.activeApiProvider;

  return {
    defaultAutosaveIntervalSeconds: Number(raw.defaultAutosaveIntervalSeconds) || defaults.defaultAutosaveIntervalSeconds,
    activeApiProvider,
    apiProfiles,
  };
}

function sanitizeProjectName(name) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim();
}

function createEmptyStage() {
  return {
    content: '',
    history: [],
    lastEditedAt: null,
  };
}

function createEmptyDocumentMemory() {
  return {
    status: 'empty',
    sourceName: '',
    sourceType: '',
    sourcePath: '',
    extractedText: '',
    extractedTextPath: '',
    markdown: '',
    markdownPath: '',
    summaryMode: 'manual',
    error: '',
    uploadedAt: null,
    updatedAt: null,
  };
}

function normalizeDocumentMemory(raw = {}) {
  const base = createEmptyDocumentMemory();
  if (!raw || typeof raw !== 'object') return base;
  const next = {
    ...base,
    ...raw,
  };
  if (!['empty', 'processing', 'ready', 'error'].includes(next.status)) next.status = base.status;
  if (!['auto', 'manual'].includes(next.summaryMode)) next.summaryMode = base.summaryMode;
  return next;
}

function createProjectDoc(projectName, conference, autosaveIntervalSeconds) {
  const now = new Date().toISOString();
  const doc = {
    projectName,
    conference,
    createdAt: now,
    updatedAt: now,
    autosaveIntervalSeconds,
    currentStage: 'Stage1',
    stage2Replies: {},
    stage4Data: {},
    stage5Data: {},
    stage5Settings: { style: 'run' },
    documentMemory: createEmptyDocumentMemory(),
    snapshots: [],
  };

  STAGE_KEYS.forEach((stageKey) => {
    doc[stageKey] = createEmptyStage();
  });

  return doc;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildSnapshotLabel(isoString) {
  const stamp = `${isoString || ''}`.replace('T', ' ').slice(0, 19);
  return `Snapshot ${stamp || 'Untitled'}`;
}

function buildProjectSnapshotDoc(projectDoc = {}) {
  const snapshotDoc = cloneJson(projectDoc);
  delete snapshotDoc.snapshots;
  return snapshotDoc;
}

function normalizeSnapshots(rawSnapshots = []) {
  if (!Array.isArray(rawSnapshots)) return [];
  return rawSnapshots
    .filter((snapshot) => snapshot && typeof snapshot === 'object' && snapshot.id && snapshot.doc)
    .map((snapshot) => ({
      id: `${snapshot.id}`,
      label: `${snapshot.label || buildSnapshotLabel(snapshot.createdAt || '')}`,
      createdAt: `${snapshot.createdAt || new Date().toISOString()}`,
      currentStage: `${snapshot.currentStage || snapshot.doc?.currentStage || ''}`,
      doc: cloneJson(snapshot.doc),
    }));
}

async function ensureProjectsRoot() {
  await fs.mkdir(PROJECTS_ROOT, { recursive: true });
}

async function readJsonSafe(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return { __error: error.message };
  }
}

async function saveProjectDoc(projectName, projectDoc) {
  if (projectDoc.isExample === true) return null;
  const safeName = sanitizeProjectName(projectName);
  const projectDir = path.join(PROJECTS_ROOT, safeName);
  const projectFile = path.join(projectDir, 'project.json');
  await fs.mkdir(projectDir, { recursive: true });
  await fs.writeFile(projectFile, JSON.stringify(projectDoc, null, 2), 'utf8');
  return projectFile;
}

async function listProjects() {
  await ensureProjectsRoot();
  const entries = await fs.readdir(PROJECTS_ROOT, { withFileTypes: true });
  const projectDirs = entries.filter((entry) => entry.isDirectory());

  const projects = await Promise.all(
    projectDirs.map(async (dir) => {
      const projectFile = path.join(PROJECTS_ROOT, dir.name, 'project.json');
      const parsed = await readJsonSafe(projectFile);
      if (parsed.__error) {
        return {
          projectName: dir.name,
          folderName: dir.name,
          unavailable: true,
          error: parsed.__error,
          updatedAt: null,
        };
      }
      return {
        projectName: parsed.projectName || dir.name,
        conference: parsed.conference || 'ICLR',
        folderName: dir.name,
        unavailable: false,
        error: null,
        updatedAt: parsed.updatedAt || parsed.createdAt || null,
      };
    }),
  );

  return projects.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
}

async function createProject(projectName, conference, autosaveIntervalSeconds) {
  await ensureProjectsRoot();
  const safeName = sanitizeProjectName(projectName);
  if (!safeName) {
    throw new Error('Project name cannot be empty after sanitization.');
  }

  const projectDir = path.join(PROJECTS_ROOT, safeName);
  try {
    await fs.access(projectDir);
    throw new Error('A project with that name already exists.');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  const doc = createProjectDoc(projectName, conference || 'ICLR', autosaveIntervalSeconds);
  await saveProjectDoc(safeName, doc);

  return {
    folderName: safeName,
    doc,
  };
}

async function loadProject(folderName) {
  const projectFile = path.join(PROJECTS_ROOT, folderName, 'project.json');
  const parsed = await readJsonSafe(projectFile);
  if (parsed.__error) {
    throw new Error(`Could not load project.json: ${parsed.__error}`);
  }
  if (!parsed.conference) parsed.conference = 'ICLR';
  parsed.documentMemory = normalizeDocumentMemory(parsed.documentMemory);
  return parsed;
}

async function renameProject(folderName, nextProjectName) {
  await ensureProjectsRoot();
  const currentFolder = sanitizeProjectName(folderName || '');
  if (!currentFolder) {
    throw new Error('Current project folder is invalid.');
  }
  const targetFolder = sanitizeProjectName(nextProjectName || '');
  if (!targetFolder) {
    throw new Error('Project name cannot be empty after sanitization.');
  }

  const currentDir = path.join(PROJECTS_ROOT, currentFolder);
  const targetDir = path.join(PROJECTS_ROOT, targetFolder);

  await fs.access(currentDir);
  if (currentFolder !== targetFolder) {
    try {
      await fs.access(targetDir);
      throw new Error('A project with that name already exists.');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    await fs.rename(currentDir, targetDir);
  }

  const doc = await loadProject(targetFolder);
  doc.projectName = (nextProjectName || '').trim() || targetFolder;
  const savedDoc = await saveProject(targetFolder, doc);
  return { folderName: targetFolder, doc: savedDoc };
}

async function copyProject(folderName) {
  await ensureProjectsRoot();
  const sourceFolder = sanitizeProjectName(folderName || '');
  if (!sourceFolder) {
    throw new Error('Project folder is invalid.');
  }

  const sourceDir = path.join(PROJECTS_ROOT, sourceFolder);
  await fs.access(sourceDir);

  const sourceDoc = await loadProject(sourceFolder);
  const copiedProjectName = `${(sourceDoc.projectName || sourceFolder).trim() || sourceFolder}_Copy`;
  const targetFolder = sanitizeProjectName(copiedProjectName);
  if (!targetFolder) {
    throw new Error('Copied project name is invalid after sanitization.');
  }

  const targetDir = path.join(PROJECTS_ROOT, targetFolder);
  try {
    await fs.access(targetDir);
    throw new Error(`A project named "${copiedProjectName}" already exists.`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  await fs.cp(sourceDir, targetDir, { recursive: true, errorOnExist: true, force: false });

  const now = new Date().toISOString();
  const copiedDoc = await loadProject(targetFolder);
  copiedDoc.projectName = copiedProjectName;
  copiedDoc.createdAt = now;
  const savedDoc = await saveProject(targetFolder, copiedDoc);
  return { folderName: targetFolder, doc: savedDoc };
}

async function createProjectSnapshot(folderName, projectDoc = null) {
  const workingDoc = projectDoc ? cloneJson(projectDoc) : await loadProject(folderName);
  const snapshots = normalizeSnapshots(workingDoc.snapshots);
  const createdAt = new Date().toISOString();
  const snapshot = {
    id: `snapshot_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    label: buildSnapshotLabel(createdAt),
    createdAt,
    currentStage: workingDoc.currentStage || '',
    doc: buildProjectSnapshotDoc(workingDoc),
  };
  workingDoc.snapshots = [snapshot, ...snapshots];
  const savedDoc = await saveProject(folderName, workingDoc);
  return {
    folderName,
    doc: savedDoc,
    snapshot: {
      id: snapshot.id,
      label: snapshot.label,
      createdAt: snapshot.createdAt,
      currentStage: snapshot.currentStage,
    },
  };
}

async function listProjectSnapshots(folderName, projectDoc = null) {
  const workingDoc = projectDoc ? cloneJson(projectDoc) : await loadProject(folderName);
  return normalizeSnapshots(workingDoc.snapshots).map((snapshot) => ({
    id: snapshot.id,
    label: snapshot.label,
    createdAt: snapshot.createdAt,
    currentStage: snapshot.currentStage,
  }));
}

async function restoreProjectSnapshot(folderName, snapshotId, projectDoc = null) {
  const workingDoc = projectDoc ? cloneJson(projectDoc) : await loadProject(folderName);
  const snapshots = normalizeSnapshots(workingDoc.snapshots);
  const target = snapshots.find((snapshot) => snapshot.id === `${snapshotId || ''}`);
  if (!target) {
    throw new Error('Snapshot not found.');
  }

  const restoredDoc = {
    ...cloneJson(target.doc),
    snapshots,
  };
  const savedDoc = await saveProject(folderName, restoredDoc);
  return {
    folderName,
    doc: savedDoc,
    snapshot: {
      id: target.id,
      label: target.label,
      createdAt: target.createdAt,
      currentStage: target.currentStage,
    },
  };
}

async function deleteProject(folderName) {
  await ensureProjectsRoot();
  const safeFolder = sanitizeProjectName(folderName || '');
  if (!safeFolder) {
    throw new Error('Project folder is invalid.');
  }
  const projectDir = path.join(PROJECTS_ROOT, safeFolder);
  await fs.rm(projectDir, { recursive: true, force: false });
  return { ok: true };
}

async function saveProject(folderName, projectDoc) {
  if (projectDoc.isExample === true) return projectDoc;
  const now = new Date().toISOString();
  const nextDoc = {
    ...projectDoc,
    conference: projectDoc.conference || 'ICLR',
    documentMemory: normalizeDocumentMemory(projectDoc.documentMemory),
    updatedAt: now,
  };
  await saveProjectDoc(folderName, nextDoc);
  return nextDoc;
}

async function loadAppSettings() {
  await ensureProjectsRoot();
  const parsed = await readJsonSafe(APP_SETTINGS_FILE);
  if (parsed.__error) {
    return createDefaultAppSettings();
  }

  return normalizeAppSettings(parsed);
}

async function saveAppSettings(settings) {
  await ensureProjectsRoot();
  const normalized = normalizeAppSettings(settings);
  await fs.writeFile(APP_SETTINGS_FILE, JSON.stringify(normalized, null, 2), 'utf8');
  return normalized;
}

async function loadTokenUsage() {
  await ensureProjectsRoot();
  const parsed = await readJsonSafe(TOKEN_USAGE_FILE);
  if (parsed.__error) {
    return { input: 0, output: 0 };
  }
  return { input: parsed.input || 0, output: parsed.output || 0 };
}

async function saveTokenUsage(tokens) {
  await ensureProjectsRoot();
  const data = { input: tokens.input || 0, output: tokens.output || 0 };
  await fs.writeFile(TOKEN_USAGE_FILE, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

module.exports = {
  APP_SETTINGS_FILE,
  PROJECTS_ROOT,
  STAGE_KEYS,
  createEmptyDocumentMemory,
  normalizeDocumentMemory,
  sanitizeProjectName,
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
};
