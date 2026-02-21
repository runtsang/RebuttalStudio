const state = {
  appSettings: { defaultAutosaveIntervalSeconds: 60 },
  projects: [],
  currentFolderName: null,
  currentDoc: null,
  apiKeyMemoryOnly: '',
  pendingCreate: false,
};

const projectListEl = document.getElementById('projectList');
const emptyStateEl = document.getElementById('emptyState');
const workspaceEl = document.getElementById('workspace');
const namingPanelEl = document.getElementById('namingPanel');
const projectNameInput = document.getElementById('projectNameInput');
const projectNameError = document.getElementById('projectNameError');
const reviewerInput = document.getElementById('reviewerInput');
const breakdownOutput = document.getElementById('breakdownOutput');
const autosaveInput = document.getElementById('autosaveInput');
const settingsError = document.getElementById('settingsError');

function fmtDate(value) {
  if (!value) return 'Unknown update time';
  return new Date(value).toLocaleString();
}

function renderProjectList() {
  projectListEl.innerHTML = state.projects
    .map((project) => {
      if (project.unavailable) {
        return `<button class="project-item unavailable" disabled>Unavailable (${project.projectName})<span class="project-meta">${project.error}</span></button>`;
      }
      return `<button class="project-item" data-folder="${project.folderName}">${project.projectName}<span class="project-meta">Updated: ${fmtDate(project.updatedAt)}</span></button>`;
    })
    .join('');
}

function renderWorkspace() {
  const hasProject = Boolean(state.currentDoc);
  workspaceEl.classList.toggle('hidden', !hasProject);
  emptyStateEl.classList.toggle('hidden', hasProject || state.pendingCreate);
  namingPanelEl.classList.toggle('hidden', !state.pendingCreate);

  if (hasProject) {
    reviewerInput.value = state.currentDoc.stage1.content || '';
    breakdownOutput.value = state.currentDoc.stage2.content || '';
  }
}

async function loadProjects() {
  state.projects = await window.studioApi.listProjects();
  renderProjectList();
}

function queueStateSync() {
  if (!state.currentDoc || !state.currentFolderName) return;
  window.studioApi.updateProjectState({
    folderName: state.currentFolderName,
    doc: state.currentDoc,
  });
}

async function createProjectFromPrompt() {
  const rawName = projectNameInput.value;
  if (!rawName.trim()) {
    projectNameError.textContent = 'Project name is required.';
    return;
  }

  try {
    const created = await window.studioApi.createProject({
      projectName: rawName,
      autosaveIntervalSeconds: state.appSettings.defaultAutosaveIntervalSeconds,
    });
    state.currentFolderName = created.folderName;
    state.currentDoc = created.doc;
    state.pendingCreate = false;
    projectNameInput.value = '';
    projectNameError.textContent = '';
    renderWorkspace();
    await loadProjects();
  } catch (error) {
    projectNameError.textContent = error.message;
  }
}

async function openProject(folderName) {
  try {
    const opened = await window.studioApi.openProject(folderName);
    state.currentFolderName = opened.folderName;
    state.currentDoc = opened.doc;
    state.pendingCreate = false;
    renderWorkspace();
  } catch (error) {
    alert(error.message);
  }
}

async function applySettings() {
  settingsError.textContent = '';
  const nextSeconds = Number(autosaveInput.value);

  if (!Number.isFinite(nextSeconds) || nextSeconds < 10 || nextSeconds > 1800) {
    settingsError.textContent = 'Please enter 10-1800 seconds.';
    return;
  }

  state.appSettings = await window.studioApi.updateDefaultInterval(nextSeconds);

  if (state.currentDoc) {
    const result = await window.studioApi.setAutosaveInterval(nextSeconds);
    state.currentDoc = result.doc;
  }

  closeModal('settingsModal');
  await loadProjects();
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

async function init() {
  state.appSettings = await window.studioApi.getAppSettings();
  autosaveInput.value = state.appSettings.defaultAutosaveIntervalSeconds;
  await loadProjects();
  renderWorkspace();
}

document.getElementById('newBtn').addEventListener('click', () => {
  state.pendingCreate = true;
  state.currentDoc = null;
  renderWorkspace();
  projectNameInput.focus();
});

document.getElementById('confirmProjectBtn').addEventListener('click', createProjectFromPrompt);
projectNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') createProjectFromPrompt();
});

projectListEl.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-folder]');
  if (btn) {
    openProject(btn.dataset.folder);
  }
});

reviewerInput.addEventListener('input', (event) => {
  if (!state.currentDoc) return;
  state.currentDoc.stage1.content = event.target.value;
  state.currentDoc.stage1.lastEditedAt = new Date().toISOString();
  state.currentDoc.stage1.history.push({ timestamp: state.currentDoc.stage1.lastEditedAt, content: event.target.value });
  queueStateSync();
});

breakdownOutput.addEventListener('input', (event) => {
  if (!state.currentDoc) return;
  state.currentDoc.stage2.content = event.target.value;
  state.currentDoc.stage2.lastEditedAt = new Date().toISOString();
  state.currentDoc.stage2.history.push({ timestamp: state.currentDoc.stage2.lastEditedAt, content: event.target.value });
  queueStateSync();
});

document.getElementById('apiOpenBtn').addEventListener('click', () => openModal('apiModal'));
document.getElementById('cancelApiBtn').addEventListener('click', () => closeModal('apiModal'));
document.getElementById('saveApiBtn').addEventListener('click', () => {
  state.apiKeyMemoryOnly = document.getElementById('apiInput').value;
  closeModal('apiModal');
});

document.getElementById('settingsBtn').addEventListener('click', () => {
  autosaveInput.value = state.currentDoc?.autosaveIntervalSeconds || state.appSettings.defaultAutosaveIntervalSeconds;
  openModal('settingsModal');
});
document.getElementById('closeSettingsBtn').addEventListener('click', applySettings);
document.getElementById('saveNowBtn').addEventListener('click', async () => {
  if (!state.currentDoc) return;
  const result = await window.studioApi.saveNow();
  if (result.doc) state.currentDoc = result.doc;
  await loadProjects();
});

document.addEventListener('keydown', async (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    const result = await window.studioApi.saveNow();
    if (result.doc) state.currentDoc = result.doc;
    await loadProjects();
  }
});

init();
