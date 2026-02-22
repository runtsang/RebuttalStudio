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


/* TEMPLATE_LIBRARY is loaded asynchronously from templates/templates.json */
let TEMPLATE_LIBRARY = {};
let STAGE3_STYLE_LIBRARY = {};

async function loadTemplateLibrary() {
  try {
    const resp = await fetch('../../templates/templates.json');
    if (resp.ok) {
      TEMPLATE_LIBRARY = await resp.json();
    } else {
      console.error('Failed to load templates.json:', resp.status);
    }
  } catch (err) {
    console.error('Error loading templates.json:', err);
  }
}


async function loadStage3StyleLibrary() {
  try {
    const resp = await fetch('../../templates/stage3_styles.json');
    if (resp.ok) {
      STAGE3_STYLE_LIBRARY = await resp.json();
    } else {
      console.error('Failed to load stage3_styles.json:', resp.status);
    }
  } catch (err) {
    console.error('Error loading stage3_styles.json:', err);
  }
}

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
  reviewers: [{ id: 0, name: '', content: '' }],
  activeReviewerIdx: 0,
  drawerOpen: false,
  // Breakdown data per reviewer
  breakdownData: {},
  stage2Replies: {},
  stage3Settings: { style: 'standard', color: '#f26921' },
  stage3Drafts: {},
  stage3Selection: {},
  templateUi: {
    audienceKey: 'reviewer',
    typeKey: 'nudge_reply',
    values: { reviewerId: 'X', submissionId: 'X' },
  },
};

let stage2RefineProgress = null;
let stage2OutlineContext = { responseId: null, x: 0, y: 0 };
let stage2ModalTargetResponseId = null;
let stage2TableRows = 3;
let stage2TableCols = 3;
const STAGE3_PRESET_COLORS = ['#ff0000', '#ff7f00', '#ffff00', '#00aa00', '#0077ff', '#4b0082', '#8b00ff'];

function normalizePositiveInt(value, fallback, min = 1, max = 20) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

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
const stage3AdjustStyleBtn = document.getElementById('stage3AdjustStyleBtn');
const breakdownContentEl = document.getElementById('breakdownContent');

const appEl = document.querySelector('.app');
const templateModalEl = document.getElementById('templateModal');
const templateAudienceTabsEl = document.getElementById('templateAudienceTabs');
const templateTypeListEl = document.getElementById('templateTypeList');
const templatePreviewTitleEl = document.getElementById('templatePreviewTitle');
const templateFieldsEl = document.getElementById('templateFields');
const templateRenderedOutputEl = document.getElementById('templateRenderedOutput');
const templateErrorEl = document.getElementById('templateError');


const API_PROVIDER_KEYS = ['openai', 'anthropic', 'gemini', 'deepseek', 'azureOpenai'];


const API_PROVIDER_GUIDE = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    baseUrlHelp: 'Use the official OpenAI endpoint unless you are using a proxy.',
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-3-5-sonnet-latest',
    baseUrlHelp: 'Use the official Anthropic endpoint. Model list is prefilled with common IDs.',
  },
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-3-flash-preview',
    baseUrlHelp: 'Google AI Studio key usually works with this default URL. You can keep this value as-is.',
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    baseUrlHelp: 'Use the official DeepSeek endpoint unless your provider gave a custom URL.',
  },
  azureOpenai: {
    baseUrl: '',
    model: 'your-deployment-name',
    baseUrlHelp: 'Fill your Azure resource endpoint, e.g. https://YOUR-RESOURCE.openai.azure.com/openai',
  },
};

const apiProviderSelectEl = document.getElementById('apiProviderSelect');
const apiBaseUrlInputEl = document.getElementById('apiBaseUrlInput');
const apiModelInputEl = document.getElementById('apiModelInput');
const apiInputEl = document.getElementById('apiInput');
const apiSettingsErrorEl = document.getElementById('apiSettingsError');
const apiBaseUrlHelpEl = document.getElementById('apiBaseUrlHelp');
const apiModelHintEl = document.getElementById('apiModelHint');
const apiModelSelectEl = document.getElementById('apiModelSelect');
const detectModelsBtnEl = document.getElementById('detectModelsBtn');

// Stage advance modal
const stageAdvanceModalEl = document.getElementById('stageAdvanceModal');
const stageAdvanceMsgEl = document.getElementById('stageAdvanceMsg');
const confirmAdvanceBtnEl = document.getElementById('confirmAdvanceBtn');
const cancelAdvanceBtnEl = document.getElementById('cancelAdvanceBtn');
const nextStageBtnEl = document.getElementById('nextStageBtn');
const stage2TableModalEl = document.getElementById('stage2TableModal');
const stage2TableRowsInputEl = document.getElementById('stage2TableRowsInput');
const stage2TableColsInputEl = document.getElementById('stage2TableColsInput');
const stage2TableBuildBtnEl = document.getElementById('stage2TableBuildBtn');
const stage2TableGridEl = document.getElementById('stage2TableGrid');
const stage2TableErrorEl = document.getElementById('stage2TableError');
const stage2TableCancelBtnEl = document.getElementById('stage2TableCancelBtn');
const stage2TableConfirmBtnEl = document.getElementById('stage2TableConfirmBtn');

const stage2CodeModalEl = document.getElementById('stage2CodeModal');
const stage2CodeLanguageInputEl = document.getElementById('stage2CodeLanguageInput');
const stage2CodeContentInputEl = document.getElementById('stage2CodeContentInput');
const stage2CodeErrorEl = document.getElementById('stage2CodeError');
const stage2CodeCancelBtnEl = document.getElementById('stage2CodeCancelBtn');
const stage2CodeConfirmBtnEl = document.getElementById('stage2CodeConfirmBtn');
const stage3StyleModalEl = document.getElementById('stage3StyleModal');
const stage3StyleSelectEl = document.getElementById('stage3StyleSelect');
const stage3ColorSectionEl = document.getElementById('stage3ColorSection');
const stage3PresetColorsEl = document.getElementById('stage3PresetColors');
const stage3CustomHexInputEl = document.getElementById('stage3CustomHexInput');
const stage3StyleErrorEl = document.getElementById('stage3StyleError');
const stage3StyleConfirmBtnEl = document.getElementById('stage3StyleConfirmBtn');


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

  sidebarStageListEl.insertAdjacentHTML('beforeend', `
    <button class="sidebar-template-trigger" type="button" data-template-open="1" aria-label="Open template center">
      <span class="sidebar-template-icon">✦</span>
      <span class="sidebar-template-text">template</span>
    </button>
  `);
}

function getTemplateAudienceEntries() {
  return Object.entries(TEMPLATE_LIBRARY);
}

function getTemplateSelection() {
  const audience = TEMPLATE_LIBRARY[state.templateUi.audienceKey] || TEMPLATE_LIBRARY.reviewer;
  const types = audience.types || [];
  let selected = types.find((t) => t.key === state.templateUi.typeKey);
  if (!selected && types.length) {
    selected = types[0];
    state.templateUi.typeKey = selected.key;
  }
  return { audience, selected };
}

function extractTemplateVars(body = '') {
  const vars = new Set();
  const matches = body.matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g);
  for (const m of matches) vars.add(m[1]);
  return Array.from(vars);
}

function renderTemplateModal() {
  const entries = getTemplateAudienceEntries();
  templateAudienceTabsEl.innerHTML = entries.map(([key, item]) => {
    const active = key === state.templateUi.audienceKey ? ' active' : '';
    return `<button class="template-audience-tab${active}" data-template-audience="${key}">${escapeHTML(item.label)}</button>`;
  }).join('');

  const { audience, selected } = getTemplateSelection();
  templateTypeListEl.innerHTML = (audience.types || []).map((t) => {
    const active = t.key === state.templateUi.typeKey ? ' active' : '';
    return `<button class="template-type-item${active}" data-template-type="${t.key}">${escapeHTML(t.label)}</button>`;
  }).join('');

  if (!selected) {
    templatePreviewTitleEl.textContent = 'Template';
    templateFieldsEl.innerHTML = '<p class="muted">No template found.</p>';
    return;
  }

  templatePreviewTitleEl.textContent = selected.title || selected.label;
  const vars = extractTemplateVars(selected.body || '');
  templateFieldsEl.innerHTML = vars.map((v) => {
    const val = state.templateUi.values[v] ?? '';
    return `<label class="template-field">${escapeHTML(v)}<input class="text-input" data-template-var="${v}" value="${escapeHTML(val)}" /></label>`;
  }).join('');
}

function renderTemplateText({ useAi = false } = {}) {
  const { selected } = getTemplateSelection();
  if (!selected) return '';
  let text = `${selected.body || ''}`;
  const vars = extractTemplateVars(text);
  for (const v of vars) {
    const raw = `${state.templateUi.values[v] ?? ''}`.trim();
    const val = raw || 'X';
    text = text.replaceAll(new RegExp(`{{\\s*${v}\\s*}}`, 'g'), val);
  }
  if (useAi) return text;
  return text.trim();
}

async function copyText(text) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch (_e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

async function runTemplatePolish() {
  templateErrorEl.textContent = '';
  const providerKey = state.apiSettings.activeApiProvider;
  const profile = getActiveApiProfile(providerKey);
  if (!profile || !profile.apiKey) {
    templateErrorEl.textContent = 'Please configure API Settings first.';
    return;
  }
  const raw = renderTemplateText();
  if (!raw) return;

  const polishBtn = document.getElementById('templateAiPolishBtn');
  polishBtn.disabled = true;
  polishBtn.classList.add('loading');

  try {
    const result = await window.studioApi.runTemplateRephrase({ providerKey, profile, content: raw });
    const polished = `${result?.text || ''}`.trim();
    templateRenderedOutputEl.value = polished || raw;
    await copyText(templateRenderedOutputEl.value);
  } catch (error) {
    templateErrorEl.textContent = error.message || 'AI polish failed.';
  } finally {
    polishBtn.disabled = false;
    polishBtn.classList.remove('loading');
  }
}

function openTemplateModal() {
  templateErrorEl.textContent = '';
  renderTemplateModal();
  templateRenderedOutputEl.value = renderTemplateText();
  openModal('templateModal');
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
    const label = r.name ? `Reviewer ${r.name}` : `Reviewer ${idx + 1}`;
    return `<button class="reviewer-tab${active}" data-reviewer="${idx}">${escapeHTML(label)}</button>`;
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

/* ── Reviewer Name Modal ── */
const reviewerNameModalEl = document.getElementById('reviewerNameModal');
const reviewerNameInputEl = document.getElementById('reviewerNameInput');
const reviewerNameErrorEl = document.getElementById('reviewerNameError');
const confirmReviewerNameBtnEl = document.getElementById('confirmReviewerNameBtn');
const cancelReviewerNameBtnEl = document.getElementById('cancelReviewerNameBtn');

let pendingReviewerCallback = null;

function promptReviewerName(onConfirm, onCancel, prefill = '') {
  reviewerNameInputEl.value = prefill;
  reviewerNameErrorEl.textContent = '';
  pendingReviewerCallback = { onConfirm, onCancel };
  reviewerNameModalEl.classList.remove('hidden');
  setTimeout(() => {
    reviewerNameInputEl.focus();
    reviewerNameInputEl.select();
  }, 60);
}

function confirmReviewerName() {
  const suffix = reviewerNameInputEl.value.trim();
  if (!suffix) {
    reviewerNameErrorEl.textContent = 'Reviewer identifier is required.';
    return;
  }
  if (suffix.length !== 4) {
    reviewerNameErrorEl.textContent = 'Please enter exactly 4 characters.';
    return;
  }
  reviewerNameModalEl.classList.add('hidden');
  if (pendingReviewerCallback?.onConfirm) {
    pendingReviewerCallback.onConfirm(suffix);
  }
  pendingReviewerCallback = null;
}

function cancelReviewerName() {
  reviewerNameModalEl.classList.add('hidden');
  if (pendingReviewerCallback?.onCancel) {
    pendingReviewerCallback.onCancel();
  }
  pendingReviewerCallback = null;
}

confirmReviewerNameBtnEl.addEventListener('click', confirmReviewerName);
cancelReviewerNameBtnEl.addEventListener('click', cancelReviewerName);
reviewerNameInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmReviewerName();
  if (e.key === 'Escape') cancelReviewerName();
});

/* ── Reviewer Right-click Context Menu ── */
const reviewerContextMenuEl = document.getElementById('reviewerContextMenu');
let contextMenuReviewerIdx = null;

function showReviewerContextMenu(e, idx) {
  e.preventDefault();
  contextMenuReviewerIdx = idx;
  reviewerContextMenuEl.style.left = `${e.clientX}px`;
  reviewerContextMenuEl.style.top = `${e.clientY}px`;
  reviewerContextMenuEl.classList.remove('hidden');
}

function hideReviewerContextMenu() {
  reviewerContextMenuEl.classList.add('hidden');
  contextMenuReviewerIdx = null;
}

// Dismiss context menu on any click outside
document.addEventListener('click', () => hideReviewerContextMenu());
document.addEventListener('contextmenu', (e) => {
  // Only keep open if right-clicking on a reviewer tab (handled separately)
  if (!e.target.closest('.reviewer-tab')) {
    hideReviewerContextMenu();
  }
});

// Handle context menu actions
reviewerContextMenuEl.addEventListener('click', (e) => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  const idx = contextMenuReviewerIdx;
  hideReviewerContextMenu();

  if (action === 'rename' && idx !== null && state.reviewers[idx]) {
    const currentSuffix = state.reviewers[idx].name || '';
    promptReviewerName((newSuffix) => {
      state.reviewers[idx].name = newSuffix;
      renderReviewerTabs();
      queueStateSync();
    }, null, currentSuffix);
  }
});

// Right-click on reviewer tabs
reviewerTabsEl.addEventListener('contextmenu', (e) => {
  const tab = e.target.closest('[data-reviewer]');
  if (!tab) return;
  showReviewerContextMenu(e, Number(tab.dataset.reviewer));
});

function addReviewer() {
  // Save current content first
  if (state.reviewers[state.activeReviewerIdx]) {
    state.reviewers[state.activeReviewerIdx].content = reviewerInput.innerHTML;
  }
  promptReviewerName((suffix) => {
    const newIdx = state.reviewers.length;
    state.reviewers.push({ id: newIdx, name: suffix, content: '' });
    state.activeReviewerIdx = newIdx;
    renderReviewerTabs();
    renderBreakdownPanel();
    reviewerInput.focus();
    queueStateSync();
  });
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

function getStage2ResponsesForReviewer(reviewerIdx) {
  const breakdown = getBreakdownDataForReviewer(reviewerIdx);
  if (!state.stage2Replies[reviewerIdx]) {
    state.stage2Replies[reviewerIdx] = {};
  }
  const container = state.stage2Replies[reviewerIdx];
  const responses = Array.isArray(breakdown.responses) ? breakdown.responses : [];

  responses.forEach((resp) => {
    if (!container[resp.id]) {
      container[resp.id] = {
        outline: '',
        draft: '',
        assets: [],
      };
    }
  });

  return container;
}

function currentStageKey() {
  const idx = stageIndexFromCurrent();
  return STAGES[idx]?.key || 'stage1';
}

function renderBreakdownPanel() {
  const stageKey = currentStageKey();
  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);

  if (stageKey === 'stage2') {
    renderStage2Panels(data);
    return;
  }

  if (stageKey === 'stage3') {
    renderStage3Panels();
    return;
  }

  const tpl = getConferenceTemplate();
  let scoresHTML = '<div class="scores-header">';

  scoresHTML += '<div class="scores-row">';
  tpl.scores.forEach((s, i) => {
    if (i > 0) scoresHTML += '<span class="score-divider">|</span>';
    const val = data.scores[s.key] || s.default;
    scoresHTML += `<div class="score-item" data-score-key="${s.key}">
      <span class="score-label">${s.label}</span>
      <span class="score-value" contenteditable="true" data-score-edit="${s.key}">${escapeHTML(val)}</span>
    </div>`;
  });
  scoresHTML += '</div>';

  scoresHTML += '<div class="scores-row">';
  tpl.metrics.forEach((s, i) => {
    if (i > 0) scoresHTML += '<span class="score-divider">|</span>';
    const val = data.scores[s.key] || s.default;
    scoresHTML += `<div class="score-item" data-score-key="${s.key}">
      <span class="score-label blue-label">${s.label}</span>
      <span class="score-value" contenteditable="true" data-score-edit="${s.key}">${escapeHTML(val)}</span>
    </div>`;
  });
  scoresHTML += '</div>';
  scoresHTML += '</div>';

  // Block color classes: first block (summary+strength) = red, second (weakness+questions) = blue
  const blockColors = ['block-red', 'block-blue'];
  let blocksHTML = '';
  tpl.blocks.forEach((blockIdxs, blockIdx) => {
    const colorClass = blockColors[blockIdx] || '';
    blocksHTML += `<div class="breakdown-block ${colorClass}">`;
    blockIdxs.forEach(sIdx => {
      const sec = tpl.sections[sIdx];
      const content = data.sections[sec.key];
      const body = content
        ? `<div class="section-editable" contenteditable="true" data-section-edit="${sec.key}">${escapeHTML(content)}</div>`
        : `<div class="section-editable breakdown-placeholder" contenteditable="true" data-section-edit="${sec.key}" data-placeholder="${escapeHTML(sec.placeholder)}"></div>`;
      blocksHTML += `<div class="breakdown-section">
        <h4 class="breakdown-section-title">${sec.label}</h4>
        <div class="breakdown-section-body" id="section_${sec.key}">${body}</div>
      </div>`;
    });
    blocksHTML += '</div>';
  });

  const issues = Array.isArray(data.atomicIssues) ? data.atomicIssues : [];
  const responses = Array.isArray(data.responses) ? data.responses : [];
  if (issues.length || responses.length) {
    blocksHTML += renderAtomicIssuesAndResponses(issues, responses);
  }

  breakdownContentEl.innerHTML = scoresHTML + blocksHTML;

  // Auto-resize textareas to fit content
  setTimeout(() => {
    document.querySelectorAll('.response-quoted-issue').forEach(el => {
      el.style.height = 'auto';
      if (el.scrollHeight > 0) el.style.height = el.scrollHeight + 'px';
    });
  }, 10);
}

/* ── Stage 2: Split into left (Outline) and right (Refined Draft) panels ── */
function renderStage2Panels(data) {
  const responses = Array.isArray(data.responses) ? data.responses : [];
  const stage2Map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
  const stage2LeftEl = document.getElementById('stage2LeftPanel');

  if (!responses.length) {
    stage2LeftEl.innerHTML = `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Outline</h4><p class="breakdown-placeholder">No responses found. Please run Breakdown in Stage 1 first.</p></div></div>`;
    breakdownContentEl.innerHTML = `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Refined Draft</h4><p class="breakdown-placeholder">No responses found. Please run Breakdown in Stage 1 first.</p></div></div>`;
    return;
  }

  // ── Left panel: Outline cards ──
  const outlineCards = responses.map((resp, idx) => {
    const item = stage2Map[resp.id] || { outline: '', draft: '', assets: [] };
    const sourceIdx = Number((`${resp.source_id || ''}`.match(/(\d+)$/) || [])[1] || idx + 1);
    const sourceLabel = resp.source === 'question' ? 'Question' : 'Weakness';
    const headerTitle = `${sourceLabel} ${sourceIdx}: ${resp.title || 'Untitled'}`;
    return `<div class="response-card stage2-outline-card" data-response-id="${escapeHTML(resp.id)}">
      <div class="response-header response-header-red">Response ${idx + 1}</div>
      <div class="fixed-issue-meta">
        <h5 class="stage2-issue-title">${escapeHTML(headerTitle)}</h5>
        <div class="fixed-issue-quote">&gt; ${escapeHTML(resp.quoted_issue || '')}</div>
      </div>
      <textarea class="response-textarea outline-textarea" data-stage2-field="outline" data-response-id="${escapeHTML(resp.id)}" placeholder="Input a response outline for this issue (key points, evidence, and writing strategy).">${escapeHTML(item.outline || '')}</textarea>
      <div class="stage2-outline-tip">Right click in outline box: Insert Table / Code</div>
    </div>`;
  }).join('');

  stage2LeftEl.innerHTML = `<h3 class="breakdown-heading">My Reply</h3><div class="responses-grid">${outlineCards}</div>`;

  // ── Right panel: Refined Draft cards ──
  const progressTotal = stage2RefineProgress?.total || 0;
  const progressCurrent = stage2RefineProgress?.current || 0;
  const progressPercent = progressTotal > 0 ? Math.min(100, Math.round((progressCurrent / progressTotal) * 100)) : 0;
  const progressHtml = progressTotal > 0
    ? `<div class="stage2-progress-wrap">
      <div class="stage2-progress-title">Refine progress: ${progressCurrent}/${progressTotal}${stage2RefineProgress?.responseId ? ` · ${escapeHTML(stage2RefineProgress.responseId)}` : ''}</div>
      <div class="stage2-progress-track"><div class="stage2-progress-fill" style="width:${progressPercent}%"></div></div>
    </div>`
    : '';

  const draftCards = responses.map((resp, idx) => {
    const item = stage2Map[resp.id] || { outline: '', draft: '', assets: [] };
    const hasDraft = (item.draft || '').trim().length > 0;
    const sourceIdx = Number((`${resp.source_id || ''}`.match(/(\d+)$/) || [])[1] || idx + 1);
    const sourceLabel = resp.source === 'question' ? 'Question' : 'Weakness';
    const headerTitle = `${sourceLabel} ${sourceIdx}: ${resp.title || 'Untitled'}`;
    return `<div class="response-card stage2-draft-card" data-response-id="${escapeHTML(resp.id)}">
      <div class="response-header response-header-blue">Response ${idx + 1}</div>
      <h5 class="stage2-issue-title">${escapeHTML(headerTitle)}</h5>
      ${hasDraft
        ? `<textarea class="response-textarea draft-textarea" data-stage2-field="draft" data-response-id="${escapeHTML(resp.id)}" readonly placeholder="Refined academic reply will appear here.">${escapeHTML(item.draft)}</textarea>`
        : `<div class="stage2-draft-placeholder">Click <strong>Refine</strong> to generate academic reply for this response.</div>`
      }
    </div>`;
  }).join('');

  breakdownContentEl.innerHTML = `${progressHtml}<div class="responses-grid">${draftCards}</div>`;
}

function ensureStage2ContextMenu() {
  let menu = document.getElementById('stage2OutlineMenu');
  if (menu) return menu;
  menu = document.createElement('div');
  menu.id = 'stage2OutlineMenu';
  menu.className = 'stage2-outline-menu hidden';
  menu.innerHTML = `
    <button class="stage2-outline-menu-item" data-outline-insert="table">Insert Table</button>
        <button class="stage2-outline-menu-item" data-outline-insert="code">Insert Code</button>
  `;
  document.body.appendChild(menu);
  return menu;
}

function hideStage2ContextMenu() {
  const menu = document.getElementById('stage2OutlineMenu');
  if (!menu) return;
  menu.classList.add('hidden');
}

function insertStage2Asset(responseId, type, content) {
  if (!responseId || !content) return;
  const map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
  if (!map[responseId]) {
    map[responseId] = { outline: '', draft: '', assets: [] };
  }
  const cur = map[responseId].outline || '';
  map[responseId].outline = `${cur}${cur ? '\n\n' : ''}${content}`;
  map[responseId].assets.push({ type, content });
  state.stage2Replies[state.activeReviewerIdx] = map;
  queueStateSync();
  renderBreakdownPanel();
}
function stage3ResponsesForActiveReviewer() {
  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);
  return Array.isArray(data.responses) ? data.responses : [];
}

function getStage3DraftForResponse(responseId) {
  if (!state.stage3Drafts[state.activeReviewerIdx]) state.stage3Drafts[state.activeReviewerIdx] = {};
  if (!state.stage3Drafts[state.activeReviewerIdx][responseId]) {
    state.stage3Drafts[state.activeReviewerIdx][responseId] = { planTask: '' };
  }
  return state.stage3Drafts[state.activeReviewerIdx][responseId];
}

function ensureStage3Selection() {
  const responses = stage3ResponsesForActiveReviewer();
  if (!responses.length) return null;
  const selected = state.stage3Selection[state.activeReviewerIdx];
  if (selected && responses.some((r) => r.id === selected)) return selected;
  state.stage3Selection[state.activeReviewerIdx] = responses[0].id;
  return responses[0].id;
}

function stage3IssueCode(resp) {
  return resp.source === 'question' ? `Q${(resp.source_id || '').replace(/\D/g, '') || '1'}` : `W${(resp.source_id || '').replace(/\D/g, '') || '1'}`;
}

function renderStage3Palette() {
  if (!stage3PresetColorsEl) return;
  const activeColor = state.stage3Settings.color || '#f26921';
  const buttons = STAGE3_PRESET_COLORS.map((color) => `<button class="stage3-color-dot ${color.toLowerCase() === activeColor.toLowerCase() ? 'active' : ''}" data-stage3-color="${color}" style="--dot:${color}" title="${color}"></button>`).join('');
  stage3PresetColorsEl.innerHTML = `${buttons}<button class="stage3-color-custom" data-stage3-color="custom">Custom</button>`;
  stage3CustomHexInputEl.value = activeColor;
}

function renderStage3StyleOptions() {
  const styles = STAGE3_STYLE_LIBRARY?.styles || {};
  const keys = Object.keys(styles);
  if (!keys.length) return;
  stage3StyleSelectEl.innerHTML = keys.map((key) => `<option value="${key}">${escapeHTML(styles[key].label || key)}</option>`).join('');
}

function openStage3StyleModal() {
  if (!stage3StyleModalEl) return;
  renderStage3StyleOptions();
  stage3StyleSelectEl.value = state.stage3Settings.style || (STAGE3_STYLE_LIBRARY.defaultStyle || 'standard');
  stage3StyleErrorEl.textContent = '';
  stage3ColorSectionEl.classList.toggle('hidden', stage3StyleSelectEl.value !== 'standard');
  renderStage3Palette();
  stage3StyleModalEl.classList.remove('hidden');
}

function normalizeHexColor(value) {
  const text = `${value || ''}`.trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(text)) return '';
  return text.toLowerCase();
}

function applyStage3StyleSettings() {
  const style = stage3StyleSelectEl.value || 'standard';
  let color = state.stage3Settings.color || '#f26921';
  if (style === 'standard') {
    const maybeHex = normalizeHexColor(stage3CustomHexInputEl.value);
    if (!maybeHex) {
      stage3StyleErrorEl.textContent = 'Please input a valid hex color like #f26921.';
      return;
    }
    color = maybeHex;
  }
  state.stage3Settings = { style, color };
  stage3StyleModalEl.classList.add('hidden');
  queueStateSync();
  if (currentStageKey() === 'stage3') renderStage3Panels();
}

function renderStage3Panels() {
  const stage2LeftEl = document.getElementById('stage2LeftPanel');
  const responses = stage3ResponsesForActiveReviewer();
  const selectedId = ensureStage3Selection();

  if (!responses.length) {
    stage2LeftEl.innerHTML = `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Reviewer</h4><p class="breakdown-placeholder">No responses found. Please complete Stage 1 and Stage 2 first.</p></div></div>`;
    breakdownContentEl.innerHTML = `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Preview</h4><p class="breakdown-placeholder">Nothing to preview yet.</p></div></div>`;
    return;
  }

  const reviewerName = state.reviewers[state.activeReviewerIdx]?.name || `${state.activeReviewerIdx + 1}`;
  const chips = responses.map((resp, idx) => `<button class="stage3-issue-pill ${resp.id === selectedId ? 'active' : ''}" data-stage3-response="${escapeHTML(resp.id)}">${idx + 1}</button>`).join('');
  const selectedResp = responses.find((r) => r.id === selectedId) || responses[0];
  const draft = getStage3DraftForResponse(selectedResp.id);

  stage2LeftEl.innerHTML = `
    <div class="stage3-left-wrap">
      <div class="stage3-reviewer-label">Reviewer ${escapeHTML(reviewerName)}</div>
      <div class="stage3-issues-row">${chips}</div>
      <div class="stage3-plan-head">Plan Task</div>
      <textarea class="response-textarea outline-textarea" data-stage3-field="planTask" data-response-id="${escapeHTML(selectedResp.id)}" placeholder="Edit plan task for this response...">${escapeHTML(draft.planTask || '')}</textarea>
    </div>`;

  const stage2Map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
  const refined = stage2Map[selectedResp.id]?.draft || '';
  const color = state.stage3Settings.color || '#f26921';
  const issueLabel = selectedResp.source === 'question' ? 'Question' : 'Weakness';
  const issueIndex = (selectedResp.source_id || '').replace(/\D/g, '') || '1';
  const preview = `### <span style="color:${color};">R${responses.findIndex((r) => r.id === selectedResp.id) + 1}: ${escapeHTML(selectedResp.title || 'Untitled')}</span>\n\n> <span style="color:${color};">${issueLabel}-${issueIndex}:</span> "${escapeHTML(selectedResp.quoted_issue || '')}"\n\n<span style="color:${color};">Response ${stage3IssueCode(selectedResp)}:</span>\n\n${escapeHTML(refined || '(No refined answer yet)')}`;
  breakdownContentEl.innerHTML = `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Preview</h4><div class="stage3-preview-markdown">${preview}</div></div></div>`;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


function renderAtomicIssuesAndResponses(issues, responses) {
  if (!responses.length && !issues.length) return '';

  // Centered dashed divider with title
  let html = '<div class="atomic-divider"><span class="atomic-divider-text">Atomic Issues</span></div>';

  html += `<div class="insert-response-wrapper"><button class="insert-response-btn" data-insert-index="0" title="Add issue">＋</button></div>`;

  // Render each Response card
  responses.forEach((resp, idx) => {
    const sourceId = resp.source_id || '';
    const isQuestion = resp.source === 'question';
    const sourceClass = isQuestion ? 'question-source' : '';
    const title = resp.title || '';

    html += `<div class="response-item">
      <div class="response-item-label">Response ${idx + 1}</div>
      <div class="response-source-badge">
        <span class="source-id ${sourceClass}">${escapeHTML(sourceId)}</span>${title ? `<span class="source-title">: ${escapeHTML(title)}</span>` : ''}
      </div>
      <div class="response-field-label">Quoted Issue</div>
      <textarea class="response-quoted-issue" data-response-id="${escapeHTML(resp.id)}" data-response-field="quoted_issue">${escapeHTML(resp.quoted_issue || '')}</textarea>
    </div>`;

    html += `<div class="insert-response-wrapper"><button class="insert-response-btn" data-insert-index="${idx + 1}" title="Add issue">＋</button></div>`;
  });

  return html;
}

/* ── Add Response Modal ── */
const addResponseModalEl = document.getElementById('addResponseModal');
const addResponseTypeInput = document.getElementById('addResponseTypeInput');
const addResponseTitleInput = document.getElementById('addResponseTitleInput');
const addResponseContentInput = document.getElementById('addResponseContentInput');
const addResponseError = document.getElementById('addResponseError');
const confirmAddResponseBtn = document.getElementById('confirmAddResponseBtn');
const cancelAddResponseBtn = document.getElementById('cancelAddResponseBtn');

let pendingInsertIndex = null;

function promptAddResponse(idx) {
  pendingInsertIndex = idx;
  addResponseTitleInput.value = '';
  addResponseContentInput.value = '';
  addResponseError.textContent = '';
  addResponseModalEl.classList.remove('hidden');
  setTimeout(() => addResponseTitleInput.focus(), 60);
}

function confirmAddResponse() {
  const title = addResponseTitleInput.value.trim();
  const content = addResponseContentInput.value.trim();
  const type = addResponseTypeInput.value;

  if (!content) {
    addResponseError.textContent = 'Content is required.';
    return;
  }

  if (pendingInsertIndex === null) return;

  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);
  if (!data.responses) data.responses = [];

  data.responses.splice(pendingInsertIndex, 0, {
    title: title,
    source: type,
    quoted_issue: content
  });

  syncAndResequenceResponses(data);
  state.breakdownData[state.activeReviewerIdx] = data;
  queueStateSync();
  renderBreakdownPanel();

  addResponseModalEl.classList.add('hidden');
  pendingInsertIndex = null;
}

function cancelAddResponse() {
  addResponseModalEl.classList.add('hidden');
  pendingInsertIndex = null;
}

function syncAndResequenceResponses(data) {
  let wCount = 0;
  let qCount = 0;
  let rCount = 0;
  const newIssues = [];

  data.responses.forEach(resp => {
    rCount++;
    resp.id = `Response${rCount}`;
    if (resp.source === 'weakness') {
      wCount++;
      resp.source_id = `weakness${wCount}`;
    } else {
      qCount++;
      resp.source_id = `question${qCount}`;
    }

    newIssues.push({
      id: resp.source_id,
      source: resp.source,
      text: (resp.title ? resp.title + ': ' : '') + (resp.quoted_issue || '')
    });
  });
  data.atomicIssues = newIssues;
}

if (confirmAddResponseBtn) {
  confirmAddResponseBtn.addEventListener('click', confirmAddResponse);
  cancelAddResponseBtn.addEventListener('click', cancelAddResponse);
}

function parseSectionFromEditable(element) {
  if (!element) return '';
  return element.innerText.trim();
}

async function runStage1ApiBreakdown(rawText) {
  const providerKey = state.apiSettings.activeApiProvider;
  const profile = getActiveApiProfile(providerKey);
  if (!profile || !profile.apiKey) {
    throw new Error('Please configure API Settings first.');
  }
  return window.studioApi.runStage1Breakdown({
    providerKey,
    profile,
    content: rawText,
  });
}

async function runStage2RefineForResponses() {
  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);
  const responses = Array.isArray(data.responses) ? data.responses : [];
  if (!responses.length) {
    alert('No Stage1 responses found.');
    return;
  }

  const providerKey = state.apiSettings.activeApiProvider;
  const profile = getActiveApiProfile(providerKey);
  if (!profile || !profile.apiKey) {
    alert('Please configure API Settings first.');
    return;
  }

  const stage2Map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
  convertBtnEl.disabled = true;
  convertBtnEl.classList.add('loading');

  try {
    stage2RefineProgress = { total: responses.length, current: 0, responseId: '' };
    renderBreakdownPanel();
    for (let i = 0; i < responses.length; i++) {
      const resp = responses[i];
      const draftCell = stage2Map[resp.id] || { outline: '', draft: '', assets: [] };
      stage2RefineProgress = { total: responses.length, current: i + 1, responseId: resp.id };
      renderBreakdownPanel();
      if (!`${draftCell.outline || ''}`.trim()) {
        continue;
      }
      const refined = await window.studioApi.runStage2Refine({
        providerKey,
        profile,
        responseId: resp.id,
        title: resp.title || '',
        source: resp.source || '',
        sourceId: resp.source_id || '',
        quotedIssue: resp.quoted_issue || '',
        outline: draftCell.outline || '',
      });
      draftCell.draft = refined?.draft || draftCell.draft;
      stage2Map[resp.id] = draftCell;
    }
    state.stage2Replies[state.activeReviewerIdx] = stage2Map;
    queueStateSync();
    renderBreakdownPanel();
  } catch (error) {
    console.error(error);
    alert(error.message || 'Failed to run Stage2 refine API.');
  } finally {
    stage2RefineProgress = null;
    convertBtnEl.disabled = false;
    convertBtnEl.classList.remove('loading');
    renderBreakdownPanel();
  }
}

/* ────────────────────────────────────────────────────────────
   Convert Button — parse reviewer input to breakdown
   ──────────────────────────────────────────────────────────── */
async function performBreakdown() {
  const rawText = reviewerInput.innerText.trim();
  if (!rawText) return;

  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);
  convertBtnEl.disabled = true;
  convertBtnEl.classList.add('loading');

  try {
    const result = await runStage1ApiBreakdown(rawText);
    data.scores = {
      ...data.scores,
      ...(result?.scores || {}),
    };
    data.sections = {
      ...data.sections,
      ...(result?.sections || {}),
    };
    data.atomicIssues = Array.isArray(result?.atomicIssues) ? result.atomicIssues : [];
    data.responses = Array.isArray(result?.responses) ? result.responses : [];
  } catch (error) {
    console.error(error);
    alert(error.message || 'Failed to run Stage1 breakdown API.');
  } finally {
    convertBtnEl.disabled = false;
    convertBtnEl.classList.remove('loading');
  }

  state.breakdownData[state.activeReviewerIdx] = data;

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
      state.reviewers = [{ id: 0, name: '', content: state.currentDoc.stage1?.content || '' }];
    }
    state.activeReviewerIdx = 0;

    // Load breakdown data from project
    if (state.currentDoc.breakdownData) {
      state.breakdownData = state.currentDoc.breakdownData;
    } else {
      state.breakdownData = {};
    }

    state.stage2Replies = state.currentDoc.stage2Replies || {};
    state.stage3Settings = state.currentDoc.stage3Settings || { style: 'standard', color: '#f26921' };
    state.stage3Drafts = state.currentDoc.stage3Drafts || {};
    state.stage3Selection = state.currentDoc.stage3Selection || {};

    renderReviewerTabs();
    renderBreakdownPanel();
    syncStageUi();

    enterProjectMode();

    // If the first reviewer has no name yet, prompt for it
    if (!state.reviewers[0].name) {
      promptReviewerName((suffix) => {
        state.reviewers[0].name = suffix;
        renderReviewerTabs();
        queueStateSync();
      }, () => {
        // User cancelled — assign a fallback 4-char ID
        state.reviewers[0].name = 'R001';
        renderReviewerTabs();
        queueStateSync();
      });
    }
  } else {
    exitProjectMode();
    syncStageUi();
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
  state.currentDoc.stage2Replies = state.stage2Replies;
  state.currentDoc.stage3Settings = state.stage3Settings;
  state.currentDoc.stage3Drafts = state.stage3Drafts;
  state.currentDoc.stage3Selection = state.stage3Selection;
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
  // Reset model selector to text input mode
  apiModelSelectEl.classList.add('hidden');
  apiModelInputEl.classList.remove('hidden');
  renderProviderGuide(providerKey);
}


function fillModelSuggestions(models = []) {
  if (models.length === 0) {
    // No models — hide select, show text input
    apiModelSelectEl.classList.add('hidden');
    apiModelInputEl.classList.remove('hidden');
    apiModelSelectEl.innerHTML = '<option value="">-- Select a model --</option>';
    return;
  }
  // Build options
  let opts = models.map((name) => `<option value="${name}">${name}</option>`).join('');
  opts += '<option value="__custom__">Custom...</option>';
  apiModelSelectEl.innerHTML = opts;
  // Show select, hide text input
  apiModelSelectEl.classList.remove('hidden');
  apiModelInputEl.classList.add('hidden');
  // Pre-select the current model if it matches, otherwise select first
  const curModel = apiModelInputEl.value.trim();
  if (curModel && models.includes(curModel)) {
    apiModelSelectEl.value = curModel;
  } else {
    apiModelSelectEl.value = models[0];
    apiModelInputEl.value = models[0];
  }
}

function renderProviderGuide(providerKey) {
  const guide = API_PROVIDER_GUIDE[providerKey] || {};
  apiBaseUrlHelpEl.textContent = guide.baseUrlHelp || '';
  if (!apiBaseUrlInputEl.value.trim() && guide.baseUrl) {
    apiBaseUrlInputEl.value = guide.baseUrl;
  }
  if (!apiModelInputEl.value.trim() && guide.model) {
    apiModelInputEl.value = guide.model;
  }
}

async function detectProviderModels() {
  apiSettingsErrorEl.textContent = '';
  apiModelHintEl.textContent = '';
  const providerKey = apiProviderSelectEl.value;
  const currentProfile = getActiveApiProfile(providerKey) || {};
  const profile = {
    ...currentProfile,
    baseUrl: apiBaseUrlInputEl.value.trim(),
    apiKey: apiInputEl.value.trim(),
    model: apiModelInputEl.value.trim(),
  };

  if (!profile.apiKey) {
    apiSettingsErrorEl.textContent = 'Please fill API key first, then click Detect models.';
    return;
  }

  detectModelsBtnEl.disabled = true;
  detectModelsBtnEl.textContent = 'Detecting...';
  try {
    const result = await window.studioApi.listProviderModels({ providerKey, profile });
    const models = result?.models || [];
    fillModelSuggestions(models);
    if (!apiModelInputEl.value.trim() && models.length) {
      apiModelInputEl.value = models[0];
    }
    apiModelHintEl.textContent = result?.hint || '';
    if (!models.length && !result?.hint) {
      apiModelHintEl.textContent = 'No models returned.';
    }
  } catch (error) {
    apiSettingsErrorEl.textContent = error.message || 'Failed to detect models.';
  } finally {
    detectModelsBtnEl.disabled = false;
    detectModelsBtnEl.textContent = 'Detect models';
  }
}

function validateApiSettingsInput(providerKey, profile) {
  if (!API_PROVIDER_KEYS.includes(providerKey)) {
    return 'Please choose a supported API provider.';
  }
  if (!profile.apiKey || !profile.apiKey.trim()) {
    return 'API key is required.';
  }
  if (providerKey !== 'azureOpenai' && (!profile.baseUrl || !profile.baseUrl.trim())) {
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
  const guide = API_PROVIDER_GUIDE[providerKey] || {};
  const nextProfile = {
    ...currentProfile,
    baseUrl: apiBaseUrlInputEl.value.trim() || guide.baseUrl || '',
    model: apiModelInputEl.value.trim() || guide.model || '',
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
  renderBreakdownPanel();
  syncStageUi();
}

function syncStageUi() {
  const stageKey = currentStageKey();
  const isStage2 = stageKey === 'stage2';
  const isStage3 = stageKey === 'stage3';
  convertBtnEl.querySelector('.convert-label').textContent = isStage2 ? 'Refine' : (isStage3 ? 'Preview' : 'Break down');

  const iconEl = convertBtnEl.querySelector('.convert-icon');
  if (isStage2) {
    iconEl.textContent = '⇢';
  } else if (isStage3) {
    iconEl.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top:4px"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  } else {
    iconEl.textContent = '→';
  }

  const heading = document.querySelector('.breakdown-panel > .breakdown-heading');
  if (heading) {
    heading.textContent = isStage2 ? 'Refined Draft' : (isStage3 ? 'Preview' : 'Structured Breakdown');
  }

  // Toggle left panel: reviewer input vs outline panel
  const stage2LeftEl = document.getElementById('stage2LeftPanel');
  if (isStage2 || isStage3) {
    reviewerInput.classList.add('hidden');
    document.querySelector('.reviewer-tabs-row')?.classList.add('hidden');
    stage2LeftEl.classList.remove('hidden');
  } else {
    reviewerInput.classList.remove('hidden');
    document.querySelector('.reviewer-tabs-row')?.classList.remove('hidden');
    stage2LeftEl.classList.add('hidden');
  }
  reviewerInput.setAttribute('contenteditable', (isStage2 || isStage3) ? 'false' : 'true');
  reviewerInput.classList.toggle('readonly', (isStage2 || isStage3));

  if (stage3AdjustStyleBtn) {
    stage3AdjustStyleBtn.classList.toggle('hidden', !isStage3);
  }
}

/* ────────────────────────────────────────────────────────────
   Init
   ──────────────────────────────────────────────────────────── */
async function init() {
  loadTheme();
  await loadTemplateLibrary();
  await loadStage3StyleLibrary();
  state.appSettings = await window.studioApi.getAppSettings();
  state.apiSettings = await window.studioApi.getApiSettings();
  autosaveInput.value = state.appSettings.defaultAutosaveIntervalSeconds;
  await loadProjects();
  renderWorkspace();
  syncStageUi();
}

/* ────────────────────────────────────────────────────────────
   Event listeners
   ──────────────────────────────────────────────────────────── */
document.getElementById('newBtn').addEventListener('click', beginProjectCreation);
document.getElementById('brandBtn').addEventListener('click', () => {
  state.pendingCreate = false;
  state.currentDoc = null;
  state.currentFolderName = null;
  state.reviewers = [{ id: 0, name: '', content: '' }];
  state.activeReviewerIdx = 0;
  state.breakdownData = {};
  state.stage2Replies = {};
  state.stage3Settings = { style: 'standard', color: '#f26921' };
  state.stage3Drafts = {};
  state.stage3Selection = {};
  renderWorkspace();
  syncStageUi();
});
document.getElementById('cancelProjectBtn').addEventListener('click', () => {
  state.pendingCreate = false;
  renderWorkspace();
  syncStageUi();
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
  const templateBtn = e.target.closest('[data-template-open]');
  if (templateBtn) {
    openTemplateModal();
    return;
  }
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
convertBtnEl.addEventListener('click', () => {
  if (currentStageKey() === 'stage2') {
    runStage2RefineForResponses();
    return;
  }
  if (currentStageKey() === 'stage3') {
    renderStage3Panels();
    return;
  }
  performBreakdown();
});

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



breakdownContentEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.insert-response-btn');
  if (btn) {
    promptAddResponse(Number(btn.dataset.insertIndex));
  }
});

breakdownContentEl.addEventListener('input', (e) => {
  if (e.target.classList.contains('response-quoted-issue')) {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }

  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);

  const stage2Field = e.target?.dataset?.stage2Field;
  const stage2ResponseId = e.target?.dataset?.responseId;
  if (stage2Field && stage2ResponseId) {
    const stage2Map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
    if (!stage2Map[stage2ResponseId]) {
      stage2Map[stage2ResponseId] = { outline: '', draft: '', assets: [] };
    }
    stage2Map[stage2ResponseId][stage2Field] = e.target.value;
    state.stage2Replies[state.activeReviewerIdx] = stage2Map;
    queueStateSync();
    return;
  }
  const scoreKey = e.target?.dataset?.scoreEdit;
  if (scoreKey) {
    data.scores[scoreKey] = e.target.innerText.trim();
    state.breakdownData[state.activeReviewerIdx] = data;
    queueStateSync();
    return;
  }

  const sectionKey = e.target?.dataset?.sectionEdit;
  if (sectionKey) {
    data.sections[sectionKey] = parseSectionFromEditable(e.target);
    state.breakdownData[state.activeReviewerIdx] = data;
    queueStateSync();
    return;
  }

  const issueId = e.target?.dataset?.issueEdit;
  if (issueId) {
    const issue = (data.atomicIssues || []).find((item) => item.id === issueId);
    if (issue) {
      issue.text = parseSectionFromEditable(e.target);
      state.breakdownData[state.activeReviewerIdx] = data;
      queueStateSync();
    }
  }
});

breakdownContentEl.addEventListener('change', (e) => {
  const field = e.target?.dataset?.responseField;
  const responseId = e.target?.dataset?.responseId;
  if (!field || !responseId) return;
  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);
  const response = (data.responses || []).find((item) => item.id === responseId);
  if (!response) return;
  response[field] = e.target.value.trim();
  state.breakdownData[state.activeReviewerIdx] = data;
  queueStateSync();
});


// Stage2 left panel input handler (outline text in stage2)
const stage2LeftPanelEl = document.getElementById('stage2LeftPanel');
stage2LeftPanelEl.addEventListener('input', (e) => {
  const stage2Field = e.target?.dataset?.stage2Field;
  const stage2ResponseId = e.target?.dataset?.responseId;
  const stage3Field = e.target?.dataset?.stage3Field;
  const stage3ResponseId = e.target?.dataset?.responseId;
  if (stage3Field && stage3ResponseId) {
    const draft = getStage3DraftForResponse(stage3ResponseId);
    draft[stage3Field] = e.target.value;
    queueStateSync();
    return;
  }
  if (stage2Field && stage2ResponseId) {
    const stage2Map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
    if (!stage2Map[stage2ResponseId]) {
      stage2Map[stage2ResponseId] = { outline: '', draft: '', assets: [] };
    }
    stage2Map[stage2ResponseId][stage2Field] = e.target.value;
    state.stage2Replies[state.activeReviewerIdx] = stage2Map;
    queueStateSync();
  }
});

// Right-click context menu on stage2 left panel outline textareas
stage2LeftPanelEl.addEventListener('contextmenu', (e) => {
  if (e.target.dataset?.stage2Field !== 'outline') return;
  e.preventDefault();
  const responseId = e.target.dataset.responseId;
  stage2OutlineContext = { responseId, x: e.clientX, y: e.clientY };
  const menu = ensureStage2ContextMenu();
  menu.style.left = `${e.clientX}px`;
  menu.style.top = `${e.clientY}px`;
  menu.classList.remove('hidden');
});

breakdownContentEl.addEventListener('contextmenu', (e) => {
  const outlineEl = e.target.closest('textarea[data-stage2-field="outline"]');
  if (!outlineEl) return;
  e.preventDefault();
  const menu = ensureStage2ContextMenu();
  stage2OutlineContext = {
    responseId: outlineEl.dataset.responseId || null,
    x: e.clientX,
    y: e.clientY,
  };
  menu.style.left = `${stage2OutlineContext.x}px`;
  menu.style.top = `${stage2OutlineContext.y}px`;
  menu.classList.remove('hidden');
});

document.addEventListener('click', (e) => {
  const option = e.target.closest('[data-outline-insert]');
  if (!option) {
    hideStage2ContextMenu();
    return;
  }
  const responseId = stage2OutlineContext.responseId;
  const action = option.dataset.outlineInsert;
  hideStage2ContextMenu();
  if (!responseId || !action) return;

  if (action === 'table') {
    openStage2TableModal(responseId);
    return;
  }

  if (action === 'code') {
    openStage2CodeModal(responseId);
  }
});


function buildStage2TableGrid(rows = stage2TableRows, cols = stage2TableCols) {
  stage2TableRows = normalizePositiveInt(rows, stage2TableRows, 1, 20);
  stage2TableCols = normalizePositiveInt(cols, stage2TableCols, 1, 10);
  stage2TableRowsInputEl.value = stage2TableRows;
  stage2TableColsInputEl.value = stage2TableCols;

  const grid = Array.from({ length: stage2TableRows }).map((_, r) => {
    const rowHtml = Array.from({ length: stage2TableCols })
      .map((__, c) => `<input class="stage2-table-cell" data-table-row="${r}" data-table-col="${c}" placeholder="${r === 0 ? `H${c + 1}` : ''}" />`)
      .join('');
    return `<div class="stage2-table-row" style="grid-template-columns: repeat(${stage2TableCols}, minmax(120px, 1fr));">${rowHtml}</div>`;
  }).join('');
  stage2TableGridEl.innerHTML = grid;
}

function buildMarkdownTableFromGrid() {
  const rows = Array.from(stage2TableGridEl.querySelectorAll('.stage2-table-row'));
  if (!rows.length) return '';
  const matrix = rows.map((row) => Array.from(row.querySelectorAll('.stage2-table-cell')).map((input) => {
    const text = `${input.value || ''}`.replace(/\|/g, '\\|').trim();
    return text || ' ';
  }));
  const header = matrix[0].map((cell, idx) => cell.trim() || `H${idx + 1}`);
  const divider = header.map(() => '---');
  const body = matrix.slice(1);
  const lines = [
    `| ${header.join(' | ')} |`,
    `| ${divider.join(' | ')} |`,
    ...body.map((row) => `| ${row.join(' | ')} |`),
  ];
  return lines.join('\n');
}

function openStage2TableModal(responseId) {
  stage2ModalTargetResponseId = responseId;
  stage2TableErrorEl.textContent = '';
  buildStage2TableGrid(stage2TableRowsInputEl.value || stage2TableRows, stage2TableColsInputEl.value || stage2TableCols);
  openModal('stage2TableModal');
}

function closeStage2TableModal() {
  stage2TableErrorEl.textContent = '';
  closeModal('stage2TableModal');
}

function openStage2CodeModal(responseId) {
  stage2ModalTargetResponseId = responseId;
  stage2CodeErrorEl.textContent = '';
  stage2CodeLanguageInputEl.value = '';
  stage2CodeContentInputEl.value = '';
  openModal('stage2CodeModal');
  stage2CodeContentInputEl.focus();
}

function closeStage2CodeModal() {
  stage2CodeErrorEl.textContent = '';
  closeModal('stage2CodeModal');
}

stage2TableBuildBtnEl.addEventListener('click', () => {
  buildStage2TableGrid(stage2TableRowsInputEl.value, stage2TableColsInputEl.value);
});

stage2TableCancelBtnEl.addEventListener('click', closeStage2TableModal);
stage2TableConfirmBtnEl.addEventListener('click', () => {
  if (!stage2ModalTargetResponseId) {
    closeStage2TableModal();
    return;
  }
  const tableMd = buildMarkdownTableFromGrid();
  if (!tableMd.trim()) {
    stage2TableErrorEl.textContent = 'Please build and fill table content first.';
    return;
  }
  insertStage2Asset(stage2ModalTargetResponseId, 'table', tableMd);
  closeStage2TableModal();
});

stage2CodeCancelBtnEl.addEventListener('click', closeStage2CodeModal);
stage2CodeConfirmBtnEl.addEventListener('click', () => {
  if (!stage2ModalTargetResponseId) {
    closeStage2CodeModal();
    return;
  }
  const rawCode = `${stage2CodeContentInputEl.value || ''}`.trimEnd();
  if (!rawCode.trim()) {
    stage2CodeErrorEl.textContent = 'Please input code content.';
    return;
  }
  const lang = `${stage2CodeLanguageInputEl.value || ''}`.trim();
  const fenced = `\`\`\`${lang}
${rawCode}
\`\`\``;
  insertStage2Asset(stage2ModalTargetResponseId, 'code', fenced);
  closeStage2CodeModal();
});

document.getElementById('apiOpenBtn').addEventListener('click', openApiSettingsModal);
document.getElementById('cancelApiBtn').addEventListener('click', () => closeModal('apiModal'));
document.getElementById('saveApiBtn').addEventListener('click', saveApiSettings);
apiProviderSelectEl.addEventListener('change', (e) => {
  renderApiForm(e.target.value);
  apiSettingsErrorEl.textContent = '';
  apiModelHintEl.textContent = '';
  fillModelSuggestions([]);
});
apiModelSelectEl.addEventListener('change', () => {
  const val = apiModelSelectEl.value;
  if (val === '__custom__') {
    // Switch to manual input mode
    apiModelSelectEl.classList.add('hidden');
    apiModelInputEl.classList.remove('hidden');
    apiModelInputEl.value = '';
    apiModelInputEl.focus();
  } else if (val) {
    apiModelInputEl.value = val;
  }
});
detectModelsBtnEl.addEventListener('click', detectProviderModels);

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


document.getElementById('closeTemplateBtn').addEventListener('click', () => closeModal('templateModal'));
templateAudienceTabsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-template-audience]');
  if (!btn) return;
  state.templateUi.audienceKey = btn.dataset.templateAudience;
  state.templateUi.typeKey = '';
  renderTemplateModal();
  templateRenderedOutputEl.value = renderTemplateText();
});
templateTypeListEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-template-type]');
  if (!btn) return;
  state.templateUi.typeKey = btn.dataset.templateType;
  renderTemplateModal();
  templateRenderedOutputEl.value = renderTemplateText();
});
templateFieldsEl.addEventListener('input', (e) => {
  const key = e.target?.dataset?.templateVar;
  if (!key) return;
  state.templateUi.values[key] = e.target.value;
  templateRenderedOutputEl.value = renderTemplateText();
});
document.getElementById('templateRenderCopyBtn').addEventListener('click', async () => {
  templateRenderedOutputEl.value = renderTemplateText();
  await copyText(templateRenderedOutputEl.value);
});
document.getElementById('templateAiPolishBtn').addEventListener('click', runTemplatePolish);


if (stage3StyleSelectEl) {
  stage3StyleSelectEl.addEventListener('change', () => {
    stage3ColorSectionEl.classList.toggle('hidden', stage3StyleSelectEl.value !== 'standard');
  });
  stage3PresetColorsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-stage3-color]');
    if (!btn) return;
    const color = btn.dataset.stage3Color;
    if (color && color !== 'custom') {
      stage3CustomHexInputEl.value = color;
      renderStage3Palette();
    } else {
      stage3CustomHexInputEl.focus();
    }
  });
  stage3StyleConfirmBtnEl.addEventListener('click', applyStage3StyleSettings);

  stage2LeftPanelEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-stage3-response]');
    if (!btn) return;
    state.stage3Selection[state.activeReviewerIdx] = btn.dataset.stage3Response;
    queueStateSync();
    renderStage3Panels();
  });
}

if (stage3AdjustStyleBtn) {
  stage3AdjustStyleBtn.addEventListener('click', openStage3StyleModal);
}

init();
