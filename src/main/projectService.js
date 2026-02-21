const fs = require('fs/promises');
const path = require('path');

const PROJECTS_ROOT = path.resolve(process.cwd(), 'projects');
const APP_SETTINGS_FILE = path.join(PROJECTS_ROOT, '_appsettings.json');

const STAGE_KEYS = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5'];

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

function createProjectDoc(projectName, conference, autosaveIntervalSeconds) {
  const now = new Date().toISOString();
  const doc = {
    projectName,
    conference,
    createdAt: now,
    updatedAt: now,
    autosaveIntervalSeconds,
    currentStage: 'Stage1',
  };

  STAGE_KEYS.forEach((stageKey) => {
    doc[stageKey] = createEmptyStage();
  });

  return doc;
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
  return parsed;
}

async function saveProject(folderName, projectDoc) {
  const now = new Date().toISOString();
  const nextDoc = {
    ...projectDoc,
    conference: projectDoc.conference || 'ICLR',
    updatedAt: now,
  };
  await saveProjectDoc(folderName, nextDoc);
  return nextDoc;
}

async function loadAppSettings() {
  await ensureProjectsRoot();
  const parsed = await readJsonSafe(APP_SETTINGS_FILE);
  if (parsed.__error) {
    return { defaultAutosaveIntervalSeconds: 60 };
  }

  return {
    defaultAutosaveIntervalSeconds: Number(parsed.defaultAutosaveIntervalSeconds) || 60,
  };
}

async function saveAppSettings(settings) {
  await ensureProjectsRoot();
  await fs.writeFile(APP_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
  return settings;
}

module.exports = {
  APP_SETTINGS_FILE,
  PROJECTS_ROOT,
  STAGE_KEYS,
  sanitizeProjectName,
  createProject,
  listProjects,
  loadProject,
  saveProject,
  loadAppSettings,
  saveAppSettings,
};
