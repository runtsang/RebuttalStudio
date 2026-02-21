const STAGES = [
  { key: 'stage1', label: 'Stage 1' },
  { key: 'stage2', label: 'Stage 2' },
  { key: 'stage3', label: 'Stage 3' },
  { key: 'stage4', label: 'Stage 4' },
  { key: 'stage5', label: 'Stage 5' },
];

const state = {
  appSettings: { defaultAutosaveIntervalSeconds: 60 },
  projects: [],
  currentFolderName: null,
  currentDoc: null,
  apiKeyMemoryOnly: '',
  pendingCreate: false,
  selectedConference: 'ICLR',
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
const projectSearchEl = document.getElementById('projectSearch');
const stageDockEl = document.getElementById('stageDock');
const stageRowEl = document.getElementById('stageRow');

function fmtDate(value) {
  if (!value) return 'Unknown update time';
  return new Date(value).toLocaleString();
}

function stageIndexFromCurrent() {
  if (!state.currentDoc?.currentStage) return 0;
  const normalized = state.currentDoc.currentStage.toLowerCase();
  return Math.max(0, STAGES.findIndex((stage) => stage.label.toLowerCase().replace(' ', '') === normalized));
}

function isStageComplete(stageKey) {
  const content = state.currentDoc?.[stageKey]?.content || '';
  return content.trim().length > 0;
}

function highestUnlockedStageIndex() {
  if (!state.currentDoc) return 0;
  let unlocked = 0;
  for (let i = 1; i < STAGES.length; i += 1) {
    const previousStageKey = STAGES[i - 1].key;
    if (isStageComplete(previousStageKey)) {
      unlocked = i;
    } else {
      break;
    }
  }
  return unlocked;
}

function renderStageDock() {
  const hasProject = Boolean(state.currentDoc);
  stageDockEl.classList.toggle('hidden', !hasProject);
  if (!hasProject) {
    stageDockEl.classList.remove('visible');
    stageRowEl.innerHTML = '';
    return;
  }

  requestAnimationFrame(() => stageDockEl.classList.add('visible'));

  const currentStageIndex = stageIndexFromCurrent();
  const unlockedStageIndex = highestUnlockedStageIndex();

  stageRowEl.innerHTML = STAGES.map((stage, idx) => {
    const completed = isStageComplete(stage.key);
    const locked = idx > unlockedStageIndex;
    const isCurrent = idx === currentStageIndex;
    const classes = ['stage-node'];
    if (completed) classes.push('completed');
    if (locked) classes.push('locked');
    if (isCurrent) classes.push('current');

    return `<button class="${classes.join(' ')}" data-stage="${stage.label}" ${locked ? 'disabled' : ''}>
      <span class="stage-dot">${completed ? '✓' : idx + 1}</span>
      <span class="stage-label">${stage.label}</span>
    </button>`;
  }).join('<span class="stage-connector" aria-hidden="true"></span>');
}

function renderProjectList() {
  const search = projectSearchEl.value.trim().toLowerCase();
  projectListEl.innerHTML = state.projects
    .filter((project) => (project.projectName || '').toLowerCase().includes(search))
    .map((project) => {
      if (project.unavailable) {
        return `<button class="project-item unavailable" disabled>Unavailable (${project.projectName})<span class="project-meta">${project.error}</span></button>`;
      }
      return `<button class="project-item" data-folder="${project.folderName}">${project.projectName}<span class="project-meta">${project.conference || 'ICLR'} · Updated: ${fmtDate(project.updatedAt)}</span></button>`;
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

  renderStageDock();
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
      conference: state.selectedConference,
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

function beginProjectCreation() {
  state.pendingCreate = true;
  state.currentDoc = null;
  state.selectedConference = 'ICLR';
  document.querySelectorAll('.conference-chip').forEach((chip) => {
    chip.classList.toggle('selected', chip.dataset.conference === 'ICLR');
  });
  renderWorkspace();
  projectNameInput.focus();
}

function selectStage(stageLabel) {
  if (!state.currentDoc) return;
  state.currentDoc.currentStage = stageLabel;
  queueStateSync();
  renderStageDock();
}

async function init() {
  state.appSettings = await window.studioApi.getAppSettings();
  autosaveInput.value = state.appSettings.defaultAutosaveIntervalSeconds;
  await loadProjects();
  renderWorkspace();
}

document.getElementById('newBtn').addEventListener('click', beginProjectCreation);
document.getElementById('brandBtn').addEventListener('click', () => {
  state.pendingCreate = false;
  state.currentDoc = null;
  renderWorkspace();
});
document.getElementById('cancelProjectBtn').addEventListener('click', () => {
  state.pendingCreate = false;
  renderWorkspace();
});

document.getElementById('confirmProjectBtn').addEventListener('click', createProjectFromPrompt);
projectNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') createProjectFromPrompt();
});

projectSearchEl.addEventListener('input', renderProjectList);
projectListEl.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-folder]');
  if (btn) {
    openProject(btn.dataset.folder);
  }
});

document.querySelectorAll('.conference-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    if (chip.disabled) return;
    state.selectedConference = chip.dataset.conference;
    document.querySelectorAll('.conference-chip').forEach((item) => {
      item.classList.toggle('selected', item.dataset.conference === state.selectedConference);
    });
  });
});

stageRowEl.addEventListener('click', (event) => {
  const stageButton = event.target.closest('[data-stage]');
  if (!stageButton || stageButton.disabled) return;
  selectStage(stageButton.dataset.stage);
});

reviewerInput.addEventListener('input', (event) => {
  if (!state.currentDoc) return;
  state.currentDoc.stage1.content = event.target.value;
  state.currentDoc.stage1.lastEditedAt = new Date().toISOString();
  state.currentDoc.stage1.history.push({ timestamp: state.currentDoc.stage1.lastEditedAt, content: event.target.value });
  queueStateSync();
  renderStageDock();
});

breakdownOutput.addEventListener('input', (event) => {
  if (!state.currentDoc) return;
  state.currentDoc.stage2.content = event.target.value;
  state.currentDoc.stage2.lastEditedAt = new Date().toISOString();
  state.currentDoc.stage2.history.push({ timestamp: state.currentDoc.stage2.lastEditedAt, content: event.target.value });
  queueStateSync();
  renderStageDock();
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
