/* ────────────────────────────────────────────────────────────
   ASCII art title is embedded directly in index.html
   ──────────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────────
   Conference Templates
   ──────────────────────────────────────────────────────────── */
const CONFERENCE_TEMPLATES = {
  ICLR: {
    scores: [
      { key: 'rating', label: 'Rating', default: 'A' },
      { key: 'confidence', label: 'Confidence', default: 'B' },
    ],
    metrics: [
      { key: 'soundness', label: 'Soundness', default: 'C' },
      { key: 'presentation', label: 'Presentation', default: 'D' },
      { key: 'contribution', label: 'Contribution', default: 'E' },
    ],
    sections: [
      { key: 'summary', label: 'Summary', placeholder: 'This is the summary.' },
      { key: 'strength', label: 'Strength', placeholder: 'This is the strength.' },
      { key: 'weakness', label: 'Weakness', placeholder: 'This is the weakness.' },
      { key: 'questions', label: 'Questions', placeholder: 'This is the questions.' },
    ],
    // Group sections into blocks: [ [summary, strength], [weakness, questions] ]
    blocks: [[0, 1], [2, 3]],
  },
};

/* ────────────────────────────────────────────────────────────
   Stages
   ──────────────────────────────────────────────────────────── */
const STAGES = [
  { key: 'stage1', label: 'Breakdown', desc: 'Break down reviewer feedback into structured points' },
  { key: 'stage2', label: 'Reply', desc: 'Draft point-by-point replies to each concern' },
  { key: 'stage3', label: 'First Round', desc: 'Compile the first round rebuttal document' },
  { key: 'stage4', label: 'Multi Rounds', desc: 'Handle follow-up rounds of discussion' },
  { key: 'stage5', label: 'Conclusion', desc: 'Finalize and summarize the rebuttal outcome' },
];

/* ────────────────────────────────────────────────────────────
   State
   ──────────────────────────────────────────────────────────── */
const state = {
  appSettings: { defaultAutosaveIntervalSeconds: 60 },
  projects: [],
  currentFolderName: null,
  currentDoc: null,
  apiSettings: { activeApiProvider: 'openai', apiProfiles: {} },
  pendingCreate: false,
  selectedConference: 'ICLR',
  theme: 'dark',
  // Reviewer tabs
  reviewers: [{ id: 0, content: '' }],
  activeReviewerIdx: 0,
  drawerOpen: false,
  // Breakdown data per reviewer
  breakdownData: {},
};

/* ────────────────────────────────────────────────────────────
   DOM refs
   ──────────────────────────────────────────────────────────── */
const projectListEl = document.getElementById('projectList');
const drawerProjectListEl = document.getElementById('drawerProjectList');
const emptyStateEl = document.getElementById('emptyState');
const workspaceEl = document.getElementById('workspace');
const namingPanelEl = document.getElementById('namingPanel');
const projectNameInput = document.getElementById('projectNameInput');
const projectNameError = document.getElementById('projectNameError');
const conferenceSelect = document.getElementById('conferenceSelect');
const reviewerInput = document.getElementById('reviewerInput');
const autosaveInput = document.getElementById('autosaveInput');
const settingsError = document.getElementById('settingsError');
const projectSearchEl = document.getElementById('projectSearch');

const sidebarEl = document.getElementById('sidebar');
const sidebarProjectsEl = document.getElementById('sidebarProjects');
const sidebarStagesEl = document.getElementById('sidebarStages');
const sidebarStageListEl = document.getElementById('sidebarStageList');

const projectDrawerEl = document.getElementById('projectDrawer');
const drawerToggleEl = document.getElementById('drawerToggle');

const reviewerTabsEl = document.getElementById('reviewerTabs');
const addReviewerBtnEl = document.getElementById('addReviewerBtn');

const convertBtnEl = document.getElementById('convertBtn');

const breakdownContentEl = document.getElementById('breakdownContent');

const appEl = document.querySelector('.app');

const API_PROVIDER_KEYS = ['openai', 'anthropic', 'gemini', 'deepseek', 'azureOpenai'];

const apiProviderSelectEl = document.getElementById('apiProviderSelect');
const apiBaseUrlInputEl = document.getElementById('apiBaseUrlInput');
const apiModelInputEl = document.getElementById('apiModelInput');
const apiInputEl = document.getElementById('apiInput');
const apiSettingsErrorEl = document.getElementById('apiSettingsError');

// Stage advance modal
const stageAdvanceModalEl = document.getElementById('stageAdvanceModal');
const stageAdvanceMsgEl = document.getElementById('stageAdvanceMsg');
const confirmAdvanceBtnEl = document.getElementById('confirmAdvanceBtn');
const cancelAdvanceBtnEl = document.getElementById('cancelAdvanceBtn');
const nextStageBtnEl = document.getElementById('nextStageBtn');

/* ────────────────────────────────────────────────────────────
   Theme
   ──────────────────────────────────────────────────────────── */
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('rebuttal-studio-theme', theme);
  document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.themeValue === theme);
  });
}

function loadTheme() {
  const saved = localStorage.getItem('rebuttal-studio-theme');
  applyTheme(saved || 'dark');
}

document.getElementById('themeDarkBtn').addEventListener('click', () => applyTheme('dark'));
document.getElementById('themeLightBtn').addEventListener('click', () => applyTheme('light'));

/* ────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────── */
function fmtDate(value) {
  if (!value) return 'Unknown';
  return new Date(value).toLocaleString();
}

function stageIndexFromCurrent() {
  if (!state.currentDoc?.currentStage) return 0;
  const normalized = state.currentDoc.currentStage.toLowerCase().replace(/\s+/g, '');
  return Math.max(0, STAGES.findIndex((s) => s.label.toLowerCase().replace(/\s+/g, '') === normalized));
}

function isStageComplete(stageKey) {
  return (state.currentDoc?.[stageKey]?.content || '').trim().length > 0;
}

/* All stages are now accessible (no locking) */
function highestUnlockedStageIndex() {
  return STAGES.length - 1;
}

/* ────────────────────────────────────────────────────────────
   Sidebar Stage List
   ──────────────────────────────────────────────────────────── */
function renderSidebarStages() {
  const hasProject = Boolean(state.currentDoc);
  if (!hasProject) return;

  const cur = stageIndexFromCurrent();

  sidebarStageListEl.innerHTML = STAGES.map((stage, idx) => {
    const completed = isStageComplete(stage.key);
    const isCurrent = idx === cur;
    const cls = ['sidebar-stage-item'];
    if (completed) cls.push('completed');
    if (isCurrent) cls.push('current');

    const dotContent = completed ? '✓' : idx + 1;

    return `<button class="${cls.join(' ')}" data-stage="${stage.label}" data-stage-key="${stage.key}">
      <span class="sidebar-stage-dot">${dotContent}</span>
      <span class="sidebar-stage-info">
        <span class="sidebar-stage-title">${stage.label}</span>
        <span class="sidebar-stage-desc">${stage.desc}</span>
      </span>
    </button>`;
  }).join('');
}

/* ────────────────────────────────────────────────────────────
   Project List
   ──────────────────────────────────────────────────────────── */
function renderProjectList() {
  const search = projectSearchEl.value.trim().toLowerCase();
  const html = state.projects
    .filter((p) => (p.projectName || '').toLowerCase().includes(search))
    .map((p) => {
      if (p.unavailable) {
        return `<button class="project-item unavailable" disabled>Unavailable (${p.projectName})<span class="project-meta">${p.error}</span></button>`;
      }
      return `<button class="project-item" data-folder="${p.folderName}">${p.projectName}<span class="project-meta">${p.conference || 'ICLR'} · ${fmtDate(p.updatedAt)}</span></button>`;
    })
    .join('');

  projectListEl.innerHTML = html;
  drawerProjectListEl.innerHTML = html;
}

/* ────────────────────────────────────────────────────────────
   Reviewer Tabs
   ──────────────────────────────────────────────────────────── */
function renderReviewerTabs() {
  reviewerTabsEl.innerHTML = state.reviewers.map((r, idx) => {
    const active = idx === state.activeReviewerIdx ? ' active' : '';
    return `<button class="reviewer-tab${active}" data-reviewer="${idx}">Reviewer ${idx + 1}</button>`;
  }).join('');

  // Load active reviewer content
  const activeReviewer = state.reviewers[state.activeReviewerIdx];
  if (activeReviewer) {
    reviewerInput.innerHTML = activeReviewer.content || '';
  }
}

function switchReviewer(idx) {
  // Save current content
  if (state.reviewers[state.activeReviewerIdx]) {
    state.reviewers[state.activeReviewerIdx].content = reviewerInput.innerHTML;
  }
  state.activeReviewerIdx = idx;
  renderReviewerTabs();
  renderBreakdownPanel();
}

function addReviewer() {
  // Save current content first
  if (state.reviewers[state.activeReviewerIdx]) {
    state.reviewers[state.activeReviewerIdx].content = reviewerInput.innerHTML;
  }
  const newIdx = state.reviewers.length;
  state.reviewers.push({ id: newIdx, content: '' });
  state.activeReviewerIdx = newIdx;
  renderReviewerTabs();
  renderBreakdownPanel();
  reviewerInput.focus();
}

/* ────────────────────────────────────────────────────────────
   Structured Breakdown Panel (ICLR template)
   ──────────────────────────────────────────────────────────── */
function getConferenceTemplate() {
  const conf = state.currentDoc?.conference || state.selectedConference || 'ICLR';
  return CONFERENCE_TEMPLATES[conf] || CONFERENCE_TEMPLATES.ICLR;
}

function getBreakdownDataForReviewer(reviewerIdx) {
  if (!state.breakdownData[reviewerIdx]) {
    const tpl = getConferenceTemplate();
    state.breakdownData[reviewerIdx] = {
      scores: {},
      sections: {},
    };
    // Init scores
    tpl.scores.forEach(s => {
      state.breakdownData[reviewerIdx].scores[s.key] = s.default;
    });
    tpl.metrics.forEach(s => {
      state.breakdownData[reviewerIdx].scores[s.key] = s.default;
    });
    // Init sections
    tpl.sections.forEach(s => {
      state.breakdownData[reviewerIdx].sections[s.key] = '';
    });
  }
  return state.breakdownData[reviewerIdx];
}

function renderBreakdownPanel() {
  const tpl = getConferenceTemplate();
  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);

  // Build scores header
  let scoresHTML = '<div class="scores-header">';

  // Row 1: Rating | Confidence
  scoresHTML += '<div class="scores-row">';
  tpl.scores.forEach((s, i) => {
    if (i > 0) scoresHTML += '<span class="score-divider">|</span>';
    const val = data.scores[s.key] || s.default;
    scoresHTML += `<div class="score-item">
      <span class="score-label">${s.label}</span>
      <span class="score-value">${val}</span>
    </div>`;
  });
  scoresHTML += '</div>';

  // Row 2: Soundness | Presentation | Contribution
  scoresHTML += '<div class="scores-row">';
  tpl.metrics.forEach((s, i) => {
    if (i > 0) scoresHTML += '<span class="score-divider">|</span>';
    const val = data.scores[s.key] || s.default;
    scoresHTML += `<div class="score-item">
      <span class="score-label">${s.label}</span>
      <span class="score-value">${val}</span>
    </div>`;
  });
  scoresHTML += '</div>';
  scoresHTML += '</div>';

  // Build section blocks
  let blocksHTML = '';
  tpl.blocks.forEach(blockIdxs => {
    blocksHTML += '<div class="breakdown-block">';
    blockIdxs.forEach(sIdx => {
      const sec = tpl.sections[sIdx];
      const content = data.sections[sec.key];
      const body = content
        ? `<p style="margin:0;white-space:pre-wrap;">${escapeHTML(content)}</p>`
        : `<p class="breakdown-placeholder">${sec.placeholder}</p>`;
      blocksHTML += `<div class="breakdown-section">
        <h4 class="breakdown-section-title">${sec.label}</h4>
        <div class="breakdown-section-body" id="section_${sec.key}">${body}</div>
      </div>`;
    });
    blocksHTML += '</div>';
  });

  breakdownContentEl.innerHTML = scoresHTML + blocksHTML;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ────────────────────────────────────────────────────────────
   Convert Button — parse reviewer input to breakdown
   ──────────────────────────────────────────────────────────── */
function performBreakdown() {
  const rawText = reviewerInput.innerText.trim();
  if (!rawText) return;

  const tpl = getConferenceTemplate();
  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);

  // Simple parser: try to extract sections from the reviewer text
  // Look for known section headers
  const sectionPatterns = {
    summary: /(?:^|\n)\s*(?:\*\*\s*)?summary(?:\s*(?:of|:))?(?:\s*\*\*\s*)?[:\s]*\n?([\s\S]*?)(?=\n\s*(?:\*\*\s*)?(?:strength|weakness|question|rating|confidence|soundness|presentation|contribution)(?:\s*(?:of|:|\*\*))|\n*$)/i,
    strength: /(?:^|\n)\s*(?:\*\*\s*)?strengths?(?:\s*(?:of|:))?(?:\s*\*\*\s*)?[:\s]*\n?([\s\S]*?)(?=\n\s*(?:\*\*\s*)?(?:summary|weakness|question|rating|confidence|soundness|presentation|contribution)(?:\s*(?:of|:|\*\*))|\n*$)/i,
    weakness: /(?:^|\n)\s*(?:\*\*\s*)?weaknesses?(?:\s*(?:of|:))?(?:\s*\*\*\s*)?[:\s]*\n?([\s\S]*?)(?=\n\s*(?:\*\*\s*)?(?:summary|strength|question|rating|confidence|soundness|presentation|contribution)(?:\s*(?:of|:|\*\*))|\n*$)/i,
    questions: /(?:^|\n)\s*(?:\*\*\s*)?questions?(?:\s*(?:for|to|:))?(?:\s*(?:the\s+)?authors?)?(?:\s*\*\*\s*)?[:\s]*\n?([\s\S]*?)(?=\n\s*(?:\*\*\s*)?(?:summary|strength|weakness|rating|confidence|soundness|presentation|contribution)(?:\s*(?:of|:|\*\*))|\n*$)/i,
  };

  const scorePatterns = {
    rating: /rating[:\s]*(\d+(?:\.\d+)?)/i,
    confidence: /confidence[:\s]*(\d+(?:\.\d+)?)/i,
    soundness: /soundness[:\s]*(\d+(?:\.\d+)?)/i,
    presentation: /presentation[:\s]*(\d+(?:\.\d+)?)/i,
    contribution: /contribution[:\s]*(\d+(?:\.\d+)?)/i,
  };

  // Extract scores
  for (const [key, pattern] of Object.entries(scorePatterns)) {
    const match = rawText.match(pattern);
    if (match) {
      data.scores[key] = match[1];
    }
  }

  // Extract sections
  for (const [key, pattern] of Object.entries(sectionPatterns)) {
    const match = rawText.match(pattern);
    if (match && match[1]) {
      data.sections[key] = match[1].trim();
    }
  }

  // If no sections matched, put everything into summary
  const anySectionFound = Object.values(data.sections).some(v => v.length > 0);
  if (!anySectionFound) {
    data.sections.summary = rawText;
  }

  // Update state
  state.breakdownData[state.activeReviewerIdx] = data;

  // Also mark stage1 as having content
  if (state.currentDoc) {
    state.currentDoc.stage1.content = rawText;
    state.currentDoc.stage1.lastEditedAt = new Date().toISOString();
    queueStateSync();
  }

  renderBreakdownPanel();
  renderSidebarStages();
}

/* ────────────────────────────────────────────────────────────
   Stage Advance Modal
   ──────────────────────────────────────────────────────────── */
let pendingAdvanceTarget = null;

function showStageAdvanceModal() {
  if (!state.currentDoc) return;
  const curIdx = stageIndexFromCurrent();
  if (curIdx >= STAGES.length - 1) return; // already at last stage

  const nextStage = STAGES[curIdx + 1];
  pendingAdvanceTarget = nextStage.label;
  stageAdvanceMsgEl.textContent = `You are currently at "${STAGES[curIdx].label}". Are you ready to advance to "${nextStage.label}"?`;
  stageAdvanceModalEl.classList.remove('hidden');
}

function confirmAdvance() {
  if (!state.currentDoc || !pendingAdvanceTarget) return;
  state.currentDoc.currentStage = pendingAdvanceTarget;
  pendingAdvanceTarget = null;
  stageAdvanceModalEl.classList.add('hidden');
  queueStateSync();
  renderSidebarStages();
}

function cancelAdvance() {
  pendingAdvanceTarget = null;
  stageAdvanceModalEl.classList.add('hidden');
}

/* ────────────────────────────────────────────────────────────
   Sidebar Mode Switching
   ──────────────────────────────────────────────────────────── */
function enterProjectMode() {
  sidebarProjectsEl.classList.add('hidden');
  sidebarStagesEl.classList.remove('hidden');
  appEl.classList.add('project-mode');
  projectDrawerEl.classList.remove('hidden');
  renderSidebarStages();
}

function exitProjectMode() {
  sidebarStagesEl.classList.add('hidden');
  sidebarProjectsEl.classList.remove('hidden');
  appEl.classList.remove('project-mode');
  projectDrawerEl.classList.add('hidden');
  projectDrawerEl.classList.remove('open');
  state.drawerOpen = false;
}

/* ────────────────────────────────────────────────────────────
   Project Drawer Toggle
   ──────────────────────────────────────────────────────────── */
function toggleDrawer() {
  state.drawerOpen = !state.drawerOpen;
  projectDrawerEl.classList.toggle('open', state.drawerOpen);
}

/* ────────────────────────────────────────────────────────────
   Workspace
   ──────────────────────────────────────────────────────────── */
function renderWorkspace() {
  const hasProject = Boolean(state.currentDoc);
  workspaceEl.classList.toggle('hidden', !hasProject);
  emptyStateEl.classList.toggle('hidden', hasProject || state.pendingCreate);
  namingPanelEl.classList.toggle('hidden', !state.pendingCreate);

  if (hasProject) {
    // Load reviewer data from project
    if (state.currentDoc.reviewers && state.currentDoc.reviewers.length > 0) {
      state.reviewers = state.currentDoc.reviewers;
    } else {
      state.reviewers = [{ id: 0, content: state.currentDoc.stage1?.content || '' }];
    }
    state.activeReviewerIdx = 0;

    // Load breakdown data from project
    if (state.currentDoc.breakdownData) {
      state.breakdownData = state.currentDoc.breakdownData;
    } else {
      state.breakdownData = {};
    }

    renderReviewerTabs();
    renderBreakdownPanel();

    enterProjectMode();
  } else {
    exitProjectMode();
  }
}

/* ────────────────────────────────────────────────────────────
   Data operations
   ──────────────────────────────────────────────────────────── */
async function loadProjects() {
  state.projects = await window.studioApi.listProjects();
  renderProjectList();
}

function queueStateSync() {
  if (!state.currentDoc || !state.currentFolderName) return;
  state.currentDoc.reviewers = state.reviewers;
  state.currentDoc.breakdownData = state.breakdownData;
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
      conference: conferenceSelect.value,
      autosaveIntervalSeconds: state.appSettings.defaultAutosaveIntervalSeconds,
    });
    state.currentFolderName = created.folderName;
    state.currentDoc = created.doc;
    state.pendingCreate = false;
    state.breakdownData = {};
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

    projectDrawerEl.classList.remove('open');
    state.drawerOpen = false;

    renderWorkspace();
  } catch (error) {
    alert(error.message);
  }
}

/* ────────────────────────────────────────────────────────────
   Settings
   ──────────────────────────────────────────────────────────── */
async function applySettings() {
  settingsError.textContent = '';
  const next = Number(autosaveInput.value);
  if (!Number.isFinite(next) || next < 10 || next > 1800) {
    settingsError.textContent = 'Please enter 10–1800 seconds.';
    return;
  }
  state.appSettings = await window.studioApi.updateDefaultInterval(next);
  if (state.currentDoc) {
    const result = await window.studioApi.setAutosaveInterval(next);
    state.currentDoc = result.doc;
  }
  closeModal('settingsModal');
  await loadProjects();
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function getActiveApiProfile(providerKey = state.apiSettings.activeApiProvider) {
  if (!providerKey || !state.apiSettings.apiProfiles[providerKey]) return null;
  return state.apiSettings.apiProfiles[providerKey];
}

function renderApiForm(providerKey = state.apiSettings.activeApiProvider) {
  const profile = getActiveApiProfile(providerKey);
  if (!profile) return;
  apiProviderSelectEl.value = providerKey;
  apiBaseUrlInputEl.value = profile.baseUrl || '';
  apiModelInputEl.value = profile.model || '';
  apiInputEl.value = profile.apiKey || '';
}

function validateApiSettingsInput(providerKey, profile) {
  if (!API_PROVIDER_KEYS.includes(providerKey)) {
    return 'Please choose a supported API provider.';
  }
  if (!profile.apiKey || !profile.apiKey.trim()) {
    return 'API key is required.';
  }
  if (!profile.baseUrl || !profile.baseUrl.trim()) {
    return 'Base URL is required.';
  }
  if (!profile.model || !profile.model.trim()) {
    return 'Model / deployment is required.';
  }
  return '';
}

async function openApiSettingsModal() {
  apiSettingsErrorEl.textContent = '';
  const latest = await window.studioApi.getApiSettings();
  state.apiSettings = latest;
  renderApiForm();
  openModal('apiModal');
}

async function saveApiSettings() {
  apiSettingsErrorEl.textContent = '';
  const providerKey = apiProviderSelectEl.value;
  const currentProfile = getActiveApiProfile(providerKey) || {};
  const nextProfile = {
    ...currentProfile,
    baseUrl: apiBaseUrlInputEl.value.trim(),
    model: apiModelInputEl.value.trim(),
    apiKey: apiInputEl.value.trim(),
  };

  const validationError = validateApiSettingsInput(providerKey, nextProfile);
  if (validationError) {
    apiSettingsErrorEl.textContent = validationError;
    return;
  }

  const nextApiProfiles = {
    ...state.apiSettings.apiProfiles,
    [providerKey]: nextProfile,
  };

  const saved = await window.studioApi.updateApiSettings({
    activeApiProvider: providerKey,
    apiProfiles: nextApiProfiles,
  });
  state.apiSettings = saved;
  closeModal('apiModal');
}


function beginProjectCreation() {
  state.pendingCreate = true;
  state.currentDoc = null;
  state.selectedConference = 'ICLR';
  conferenceSelect.value = 'ICLR';
  exitProjectMode();
  renderWorkspace();
  projectNameInput.focus();
}

function selectStage(label) {
  if (!state.currentDoc) return;
  state.currentDoc.currentStage = label;
  queueStateSync();
  renderSidebarStages();
}

/* ────────────────────────────────────────────────────────────
   Init
   ──────────────────────────────────────────────────────────── */
async function init() {
  loadTheme();
  state.appSettings = await window.studioApi.getAppSettings();
  state.apiSettings = await window.studioApi.getApiSettings();
  autosaveInput.value = state.appSettings.defaultAutosaveIntervalSeconds;
  await loadProjects();
  renderWorkspace();
}

/* ────────────────────────────────────────────────────────────
   Event listeners
   ──────────────────────────────────────────────────────────── */
document.getElementById('newBtn').addEventListener('click', beginProjectCreation);
document.getElementById('brandBtn').addEventListener('click', () => {
  state.pendingCreate = false;
  state.currentDoc = null;
  state.currentFolderName = null;
  state.reviewers = [{ id: 0, content: '' }];
  state.activeReviewerIdx = 0;
  state.breakdownData = {};
  renderWorkspace();
});
document.getElementById('cancelProjectBtn').addEventListener('click', () => {
  state.pendingCreate = false;
  renderWorkspace();
});

document.getElementById('confirmProjectBtn').addEventListener('click', createProjectFromPrompt);
projectNameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') createProjectFromPrompt(); });

projectSearchEl.addEventListener('input', renderProjectList);

// Project list click (main sidebar)
projectListEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-folder]');
  if (btn) openProject(btn.dataset.folder);
});

// Project list click (drawer)
drawerProjectListEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-folder]');
  if (btn) openProject(btn.dataset.folder);
});

// Stage selection from sidebar
sidebarStageListEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-stage]');
  if (!btn || btn.disabled) return;
  selectStage(btn.dataset.stage);
});

// Drawer toggle
drawerToggleEl.addEventListener('click', toggleDrawer);

// Reviewer tabs
reviewerTabsEl.addEventListener('click', (e) => {
  const tab = e.target.closest('[data-reviewer]');
  if (!tab) return;
  switchReviewer(Number(tab.dataset.reviewer));
});

addReviewerBtnEl.addEventListener('click', addReviewer);

// Convert button
convertBtnEl.addEventListener('click', performBreakdown);

// Next Stage button
nextStageBtnEl.addEventListener('click', showStageAdvanceModal);

// Stage advance modal
confirmAdvanceBtnEl.addEventListener('click', confirmAdvance);
cancelAdvanceBtnEl.addEventListener('click', cancelAdvance);

// Reviewer input
reviewerInput.addEventListener('input', (e) => {
  if (!state.currentDoc) return;
  const content = reviewerInput.innerHTML;
  state.reviewers[state.activeReviewerIdx].content = content;
  state.currentDoc.stage1.content = state.reviewers[0]?.content || '';
  state.currentDoc.stage1.lastEditedAt = new Date().toISOString();
  state.currentDoc.stage1.history.push({ timestamp: state.currentDoc.stage1.lastEditedAt, content: content });
  queueStateSync();
  renderSidebarStages();
});

document.getElementById('apiOpenBtn').addEventListener('click', openApiSettingsModal);
document.getElementById('cancelApiBtn').addEventListener('click', () => closeModal('apiModal'));
document.getElementById('saveApiBtn').addEventListener('click', saveApiSettings);
apiProviderSelectEl.addEventListener('change', (e) => {
  renderApiForm(e.target.value);
});

// Settings button — both modes
document.getElementById('settingsBtn').addEventListener('click', () => {
  autosaveInput.value = state.currentDoc?.autosaveIntervalSeconds || state.appSettings.defaultAutosaveIntervalSeconds;
  document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.themeValue === state.theme);
  });
  openModal('settingsModal');
});
document.getElementById('settingsBtnStage').addEventListener('click', () => {
  autosaveInput.value = state.currentDoc?.autosaveIntervalSeconds || state.appSettings.defaultAutosaveIntervalSeconds;
  document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.themeValue === state.theme);
  });
  openModal('settingsModal');
});

document.getElementById('closeSettingsBtn').addEventListener('click', applySettings);
document.getElementById('saveNowBtn').addEventListener('click', async () => {
  if (!state.currentDoc) return;
  const result = await window.studioApi.saveNow();
  if (result.doc) state.currentDoc = result.doc;
  await loadProjects();
});

document.addEventListener('keydown', async (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    const result = await window.studioApi.saveNow();
    if (result.doc) state.currentDoc = result.doc;
    await loadProjects();
  }
});

init();
