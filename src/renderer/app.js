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
  ICML: {
    scores: [
      { key: 'rating', label: 'Rating', default: 'A' },
      { key: 'confidence', label: 'Confidence', default: 'B' },
    ],
    metrics: [
      { key: 'soundness', label: 'Soundness', default: 'C' },
      { key: 'presentation', label: 'Presentation', default: 'D' },
      { key: 'significance', label: 'Significance', default: 'E' },
      { key: 'originality', label: 'Originality', default: 'F' },
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
  { key: 'stage5', label: 'Final Remarks', desc: 'Finalize and summarize the rebuttal outcome' },
];


/* TEMPLATE_LIBRARY is loaded asynchronously from templates/templates.json */
let TEMPLATE_LIBRARY = {};
let STAGE3_STYLE_LIBRARY = {};
let STAGE5_STYLE_LIBRARY = {};
let STAGE5_SAMPLE_TEMPLATE = '';

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

async function loadStage5StyleLibrary() {
  try {
    const resp = await fetch('../../templates/stage5_styles.json');
    if (resp.ok) {
      STAGE5_STYLE_LIBRARY = await resp.json();
    } else {
      console.error('Failed to load stage5_styles.json:', resp.status);
    }
  } catch (err) {
    console.error('Error loading stage5_styles.json:', err);
  }
}

async function loadStage5SampleTemplate() {
  try {
    const resp = await fetch('../../templates/final_remarks_tokenseek.md');
    if (resp.ok) {
      STAGE5_SAMPLE_TEMPLATE = await resp.text();
    } else {
      console.error('Failed to load final_remarks_tokenseek.md:', resp.status);
      STAGE5_SAMPLE_TEMPLATE = '';
    }
  } catch (err) {
    console.error('Error loading final_remarks_tokenseek.md:', err);
    STAGE5_SAMPLE_TEMPLATE = '';
  }
}

/* ── Docs panel state ── */
const DOCS_FILES = [
  { label: 'README', path: '../../documents/en/README.md' },
  { label: 'Stage 1 — Breakdown', path: '../../documents/en/stage1-breakdown.md' },
  { label: 'Stage 2 — Reply', path: '../../documents/en/stage2-reply.md' },
  { label: 'Stage 3 — First Round', path: '../../documents/en/stage3-first-round.md' },
  { label: 'Stage 4 — Multi Rounds', path: '../../documents/en/stage4-multi-rounds.md' },
  { label: 'Stage 5 — Final Remarks', path: '../../documents/en/stage5-final-remarks.md' },
];
let docsCurrentPath = DOCS_FILES[0].path;

/* ── Skills catalog ── */
const SKILLS_CATALOG = [
  {
    stage: 'Stage 1 — Breakdown',
    skills: [
      { label: 'ICLR', icon: '🔬', path: '../../skills/stage1/iclr/SKILL.md' },
      { label: 'ICML', icon: '🔬', path: '../../skills/stage1/icml/SKILL.md' },
    ],
  },
  {
    stage: 'Stage 2 — Reply',
    skills: [
      { label: 'ICLR', icon: '✍️', path: '../../skills/stage2/iclr/SKILL.md' },
      { label: 'ICML', icon: '✍️', path: '../../skills/stage2/icml/SKILL.md' },
    ],
  },
  {
    stage: 'Stage 4 — Multi Rounds',
    skills: [
      { label: 'Condense', icon: '🗜️', path: '../../skills/stage4/condense/SKILL.md' },
      { label: 'Refine', icon: '🪄', path: '../../skills/stage4/refine/SKILL.md' },
    ],
  },
  {
    stage: 'Stage 5 — Final Remarks',
    skills: [
      { label: 'Final Remarks', icon: '🎯', path: '../../skills/stage5/final-remarks/SKILL.md' },
    ],
  },
  {
    stage: 'Utility',
    skills: [
      { label: 'Polish', icon: '✨', path: '../../skills/polish/SKILL.md' },
    ],
  },
];

const GITHUB_PR_URL = 'https://github.com/runtsang/RebuttalStudio/pulls';

/* ────────────────────────────────────────────────────────────
   State
   ──────────────────────────────────────────────────────────── */
const state = {
  appSettings: { defaultAutosaveIntervalSeconds: 60 },
  projects: [],
  projectSortMode: 'date-desc', // 'date-desc' | 'date-asc' | 'az' | 'za'
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
  stage4Data: {},
  stage5Data: {},
  stage5Settings: { style: 'run' },
  templateUi: {
    audienceKey: 'reviewer',
    typeKey: 'nudge_reply',
    values: { reviewerId: 'X', submissionId: 'X' },
  },
};

let stage2RefineProgress = null;
let stage4RefineRuntime = { running: false, reviewerIdx: -1 };
let stage5AutoFillRuntime = { running: false };
let stage2OutlineContext = { responseId: null, x: 0, y: 0 };
let stage3SourceContext = { responseId: null, x: 0, y: 0, start: 0, end: 0 };

// Writing Anti-AI context menu state
const antiAIState = {
  element: null,
  type: null,          // 'textarea' | 'contenteditable'
  selectedText: '',
  selStart: 0,         // textarea only
  selEnd: 0,           // textarea only
  savedRange: null,    // contenteditable only (cloned Range)
  originalValue: '',   // full content before replacement (for undo)
  undoTimerId: null,
};
let exportTargetFolder = null;
let stage2ModalTargetResponseId = null;
let stage2TableRows = 3;
let stage2TableCols = 3;
let stage3BreakdownPartsCache = [];
const STAGE3_PRESET_COLORS = ['#ff0000', '#ff7f00', '#ffff00', '#00aa00', '#0077ff', '#4b0082', '#8b00ff'];
const STAGE3_ALL_TAB_ID = '__all__';
const STAGE3_ALL_OPENING_PARAGRAPH = 'Thank you for acknowledging the A, B, and C of our method. We sincerely appreciate your time and effort in reviewing our paper and providing valuable comments. We provide explanations to your questions point-by-point in the following.';
const STAGE3_ALL_CLOSING_PARAGRAPH = '**We appreciate your thoughtful comments. We hope our response addresses your concerns. Please let us know if there are any additional questions, and we will be happy to discuss further.**';

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
const searchProjectsToggleBtn = document.getElementById('searchProjectsToggleBtn');
const projectSearchContainer = document.getElementById('projectSearchContainer');
const exportProjectPopup = document.getElementById('exportProjectPopup');

const sidebarEl = document.getElementById('sidebar');
const sidebarProjectsEl = document.getElementById('sidebarProjects');
const sidebarStagesEl = document.getElementById('sidebarStages');
const sidebarStageListEl = document.getElementById('sidebarStageList');

const projectDrawerEl = document.getElementById('projectDrawer');
const drawerToggleEl = document.getElementById('drawerToggle');

const reviewerTabsEl = document.getElementById('reviewerTabs');
const addReviewerBtnEl = document.getElementById('addReviewerBtn');
const reviewerTabsRowEl = document.querySelector('.reviewer-tabs-row');

const convertBtnEl = document.getElementById('convertBtn');
const stage3AdjustStyleBtn = document.getElementById('stage3AdjustStyleBtn');
const stage2AutoFitBtn = document.getElementById('stage2AutoFitBtn');
const stage3ThemeNoticeEl = document.getElementById('stage3ThemeNotice');
const breakdownContentEl = document.getElementById('breakdownContent');

const appEl = document.querySelector('.app');
const templateModalEl = document.getElementById('templateModal');
const templateAudienceTabsEl = document.getElementById('templateAudienceTabs');
const templateTypeListEl = document.getElementById('templateTypeList');
const templatePreviewTitleEl = document.getElementById('templatePreviewTitle');
const templateFieldsEl = document.getElementById('templateFields');
const templateRenderedOutputEl = document.getElementById('templateRenderedOutput');
const templateErrorEl = document.getElementById('templateError');
const stage4CopyPopupEl = document.getElementById('stage4CopyPopup');
const stage4CopyPopupCopyBtnEl = document.getElementById('stage4CopyPopupCopyBtn');
const stage4CopyPopupCloseBtnEl = document.getElementById('stage4CopyPopupCloseBtn');
const convertColumnEl = document.querySelector('.convert-column');


const API_PROVIDER_KEYS = ['openai', 'anthropic', 'gemini', 'deepseek', 'azureOpenai', 'qwen', 'custom'];


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
  qwen: {
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
    baseUrlHelp: 'Alibaba DashScope compatible-mode endpoint. Get your API key from console.aliyun.com. Common models: qwen-turbo, qwen-plus, qwen-max.',
  },
  custom: {
    baseUrl: '',
    model: '',
    baseUrlHelp: 'Enter any OpenAI-compatible base URL (e.g. https://api.moonshot.cn/v1, http://localhost:11434/v1 for Ollama). Use "Detect models" to list available models.',
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
const activeModelBadgeEl = document.getElementById('activeModelBadge');

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
const stage5TemplateModalEl = document.getElementById('stage5TemplateModal');
const stage5TemplateSelectEl = document.getElementById('stage5TemplateSelect');
const stage5TemplateErrorEl = document.getElementById('stage5TemplateError');
const stage5TemplateApplyBtnEl = document.getElementById('stage5TemplateApplyBtn');
const stage5TemplateCancelBtnEl = document.getElementById('stage5TemplateCancelBtn');
const stage3BreakdownModalEl = document.getElementById('stage3BreakdownModal');
const stage3BreakdownLengthInputEl = document.getElementById('stage3BreakdownLengthInput');
const stage3BreakdownErrorEl = document.getElementById('stage3BreakdownError');
const stage3BreakdownCancelBtnEl = document.getElementById('stage3BreakdownCancelBtn');
const stage3BreakdownConfirmBtnEl = document.getElementById('stage3BreakdownConfirmBtn');
const stage3BreakdownResultModalEl = document.getElementById('stage3BreakdownResultModal');
const stage3BreakdownResultBodyEl = document.getElementById('stage3BreakdownResultBody');
const stage3BreakdownResultCloseBtnEl = document.getElementById('stage3BreakdownResultCloseBtn');


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

function hasAnyStage1Responses() {
  return state.reviewers.some((_, reviewerIdx) => {
    const bData = state.breakdownData[reviewerIdx] || {};
    return Array.isArray(bData.responses) && bData.responses.length > 0;
  });
}

function isStage2FullyRefined() {
  for (let reviewerIdx = 0; reviewerIdx < state.reviewers.length; reviewerIdx += 1) {
    const bData = state.breakdownData[reviewerIdx] || {};
    const responses = Array.isArray(bData.responses) ? bData.responses : [];
    if (!responses.length) continue;
    const stage2Map = state.stage2Replies[reviewerIdx] || {};
    const missing = responses.some((resp) => !`${stage2Map[resp.id]?.draft || ''}`.trim());
    if (missing) return false;
  }
  return true;
}

function syncStage2CompletionState() {
  if (!state.currentDoc?.stage2) return;
  const completed = isStage2FullyRefined();
  state.currentDoc.stage2.content = completed ? 'completed' : '';
  state.currentDoc.stage2.lastEditedAt = new Date().toISOString();
}

function isStageComplete(stageKey) {
  if (!state.currentDoc) return false;

  const stageIdx = STAGES.findIndex((s) => s.key === stageKey);
  const curIdx = stageIndexFromCurrent();
  if (stageIdx >= 0 && stageIdx < curIdx) return true;

  if (stageKey === 'stage1') {
    return `${state.currentDoc?.stage1?.content || ''}`.trim().length > 0 || hasAnyStage1Responses();
  }
  if (stageKey === 'stage2') {
    return isStage2FullyRefined();
  }
  return `${state.currentDoc?.[stageKey]?.content || ''}`.trim().length > 0;
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

  const docsPanelEl = document.getElementById('docsPanel');
  const isDocsActive = docsPanelEl && !docsPanelEl.classList.contains('hidden');
  const docsActiveCls = isDocsActive ? ' active' : '';

  sidebarStageListEl.insertAdjacentHTML('beforeend', `
    <button class="sidebar-template-trigger${docsActiveCls}" type="button" data-docs-open="${cur + 1}" aria-label="Open Stage Documents" style="margin-bottom: 8px;">
      <span class="sidebar-template-icon" style="display:flex; align-items:center; justify-content:center;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
      </span>
      <span class="sidebar-template-text">Documents</span>
    </button>
    <button class="sidebar-template-trigger" type="button" data-template-open="1" aria-label="Open template center">
      <span class="sidebar-template-icon">✦</span>
      <span class="sidebar-template-text">Template</span>
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
  let list = state.projects.filter((p) => (p.projectName || '').toLowerCase().includes(search));

  // Sort
  const mode = state.projectSortMode || 'date-desc';
  list = [...list].sort((a, b) => {
    if (mode === 'az') return (a.projectName || '').localeCompare(b.projectName || '');
    if (mode === 'za') return (b.projectName || '').localeCompare(a.projectName || '');
    const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return mode === 'date-asc' ? ta - tb : tb - ta;
  });

  const html = list
    .map((p) => {
      if (p.unavailable) {
        return `<button class="project-item unavailable" disabled>Unavailable (${p.projectName})<span class="project-meta">${p.error}</span></button>`;
      }
      return `<button class="project-item" data-folder="${p.folderName}">
        <div class="project-item-info">
          <div class="project-item-name">${escapeHTML(p.projectName)}</div>
          <span class="project-meta">${escapeHTML(p.conference || 'ICLR')} · ${fmtDate(p.updatedAt)}</span>
        </div>
        <div class="project-export-btn" data-export-folder="${p.folderName}" title="Export First Round">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          </svg>
        </div>
      </button>`;
    })
    .join('');

  projectListEl.innerHTML = html;
  drawerProjectListEl.innerHTML = html;

  // Update the active state in the popup menu
  document.querySelectorAll('.sort-popup-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sort === mode);
  });
}

/* ────────────────────────────────────────────────────────────
   Docs Panel
   ──────────────────────────────────────────────────────────── */
async function renderDocsPanel(filePath) {
  const docsPanelEl = document.getElementById('docsPanel');
  const docsContentEl = document.getElementById('docsContent');
  const docsFileSelectEl = document.getElementById('docsFileSelect');

  // Populate selector if first open
  if (!docsFileSelectEl.options.length) {
    docsFileSelectEl.innerHTML = DOCS_FILES.map((f) =>
      `<option value="${f.path}">${f.label}</option>`
    ).join('');
  }

  docsCurrentPath = filePath || docsCurrentPath;
  docsFileSelectEl.value = docsCurrentPath;

  // Show panel, hide others
  document.getElementById('emptyState').classList.add('hidden');
  document.getElementById('workspace').classList.add('hidden');
  document.getElementById('namingPanel').classList.add('hidden');
  const skillsPanelEl = document.getElementById('skillsPanel');
  if (skillsPanelEl) skillsPanelEl.classList.add('hidden');
  docsPanelEl.classList.remove('hidden');

  try {
    const resp = await fetch(docsCurrentPath);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const raw = await resp.text();
    docsContentEl.innerHTML = DOMPurify.sanitize(marked.parse(raw));
  } catch (err) {
    docsContentEl.textContent = `Failed to load: ${err.message}`;
  }

  // Ensure sidebar reflects active state
  if (state.currentDoc) {
    renderSidebarStages();
  }
}

/* ────────────────────────────────────────────────────────────
   Skills Panel
   ──────────────────────────────────────────────────────────── */
function renderSkillsPanel() {
  const skillsPanelEl = document.getElementById('skillsPanel');
  const skillsGridEl = document.getElementById('skillsGrid');

  // Show panel, hide others
  document.getElementById('emptyState').classList.add('hidden');
  document.getElementById('workspace').classList.add('hidden');
  document.getElementById('namingPanel').classList.add('hidden');
  document.getElementById('docsPanel').classList.add('hidden');
  skillsPanelEl.classList.remove('hidden');

  skillsGridEl.innerHTML = SKILLS_CATALOG.map((group) => `
    <div class="skills-stage-group">
      <p class="skills-stage-label">${group.stage}</p>
      <div class="skills-cards-row">
        ${group.skills.map((s) => `
          <button class="skill-card" data-skill-path="${s.path}" data-skill-label="${group.stage} / ${s.label}">
            <span class="skill-card-icon">${s.icon}</span>
            <span>${s.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('') + `
    <div style="margin-top: var(--space-4);">
      <button class="skills-propose-btn" data-propose>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Propose a Skill
      </button>
    </div>
  `;
}

async function openSkillModal(path, label) {
  const modalEl = document.getElementById('skillModal');
  const titleEl = document.getElementById('skillModalTitle');
  const contentEl = document.getElementById('skillModalContent');

  titleEl.textContent = label;
  contentEl.innerHTML = '<p style="color:var(--text-muted)">Loading…</p>';
  modalEl.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  try {
    const resp = await fetch(path);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const raw = await resp.text();
    contentEl.innerHTML = DOMPurify.sanitize(marked.parse(raw));
  } catch (err) {
    contentEl.textContent = `Failed to load skill: ${err.message}`;
  }
}

function closeSkillModal() {
  document.getElementById('skillModal').classList.add('hidden');
  document.body.style.overflow = '';
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

function reviewerSelectionStorageKey() {
  return `rebuttal-studio-active-reviewer:${state.currentFolderName || 'default'}`;
}

function persistActiveReviewerSelection() {
  const idx = Math.max(0, Number(state.activeReviewerIdx) || 0);
  if (state.currentDoc) state.currentDoc.activeReviewerIdx = idx;
  try {
    localStorage.setItem(reviewerSelectionStorageKey(), String(idx));
  } catch (_err) {
    // ignore storage failures
  }
}

function restoreActiveReviewerSelection() {
  const reviewerCount = state.reviewers.length || 1;
  const fromDoc = Number(state.currentDoc?.activeReviewerIdx);
  let idx = Number.isFinite(fromDoc) ? fromDoc : NaN;
  if (!Number.isFinite(idx)) {
    try {
      const raw = localStorage.getItem(reviewerSelectionStorageKey());
      const fromLs = Number(raw);
      idx = Number.isFinite(fromLs) ? fromLs : 0;
    } catch (_err) {
      idx = 0;
    }
  }
  state.activeReviewerIdx = Math.max(0, Math.min(reviewerCount - 1, Math.floor(idx)));
}

function switchReviewer(idx) {
  if (stage4RefineRuntime.running) {
    alert('Stage4 refine is running. Please wait until it finishes before switching reviewers.');
    return;
  }
  // Save current content
  if (state.reviewers[state.activeReviewerIdx]) {
    state.reviewers[state.activeReviewerIdx].content = reviewerInput.innerHTML;
  }
  hideCopyPopup();
  state.activeReviewerIdx = idx;
  persistActiveReviewerSelection();
  renderReviewerTabs();
  renderBreakdownPanel();
  queueStateSync();
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
    persistActiveReviewerSelection();
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

  if (stageKey === 'stage4') {
    renderStage4Panels();
    return;
  }

  if (stageKey === 'stage5') {
    renderStage5Panels();
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
    document.querySelectorAll('.response-quoted-issue, .response-textarea').forEach(el => {
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
    const isRefining = stage2RefineProgress?.responseId === resp.id;
    return `<div class="response-card stage2-draft-card" data-response-id="${escapeHTML(resp.id)}">
      <div class="response-header response-header-blue">Response ${idx + 1}</div>
      <div class="stage2-draft-head-row">
        <h5 class="stage2-issue-title">${escapeHTML(headerTitle)}</h5>
        <button class="stage2-refine-one-btn ${isRefining ? 'loading' : ''}" data-stage2-refine-one="${escapeHTML(resp.id)}" title="Refine this response only" aria-label="Refine this response only">${isRefining ? '…' : '↗'}</button>
      </div>
      ${hasDraft
        ? `<textarea class="response-textarea draft-textarea" data-stage2-field="draft" data-response-id="${escapeHTML(resp.id)}" placeholder="Refined academic reply will appear here.">${escapeHTML(item.draft)}</textarea>`
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

function ensureStage3SourceMenu() {
  let menu = document.getElementById('stage3SourceMenu');
  if (menu) return menu;
  menu = document.createElement('div');
  menu.id = 'stage3SourceMenu';
  menu.className = 'stage2-outline-menu hidden';
  menu.innerHTML = `
    <button class="stage2-outline-menu-item" data-stage3-format="bold">Bold</button>
    <button class="stage2-outline-menu-item" data-stage3-format="italic">Italic</button>
    <button class="stage2-outline-menu-item" data-stage3-format="underline">Underline</button>
    <button class="stage2-outline-menu-item" data-stage3-format="color">Color</button>
    <button class="stage2-outline-menu-item" data-stage3-format="h1">Large Heading</button>
    <button class="stage2-outline-menu-item" data-stage3-format="h2">Small Heading</button>
  `;
  document.body.appendChild(menu);
  return menu;
}

function hideStage3SourceMenu() {
  const menu = document.getElementById('stage3SourceMenu');
  if (!menu) return;
  menu.classList.add('hidden');
}

/* ──────────────────────────────────────────────────────────────
   Writing Anti-AI — context menu, toast, and replacement logic
   ────────────────────────────────────────────────────────────── */

function ensureAntiAIMenu() {
  let menu = document.getElementById('writingAntiAIMenu');
  if (menu) return menu;
  menu = document.createElement('div');
  menu.id = 'writingAntiAIMenu';
  menu.className = 'writing-anti-ai-menu hidden';
  menu.innerHTML = `
    <button class="writing-anti-ai-menu-item" id="writingAntiAIBtn">
      <span class="writing-anti-ai-btn-label">✦ Writing Anti-AI</span>
    </button>
  `;
  document.body.appendChild(menu);
  menu.querySelector('#writingAntiAIBtn').addEventListener('click', () => {
    hideAntiAIMenu();
    runAntiAIReplacement();
  });
  return menu;
}

function hideAntiAIMenu() {
  const menu = document.getElementById('writingAntiAIMenu');
  if (menu) menu.classList.add('hidden');
}

function showAntiAIMenu(e, editableEl) {
  if (editableEl.tagName === 'TEXTAREA') {
    if (editableEl.selectionStart === editableEl.selectionEnd) return;
    antiAIState.element = editableEl;
    antiAIState.type = 'textarea';
    antiAIState.selectedText = editableEl.value.substring(editableEl.selectionStart, editableEl.selectionEnd);
    antiAIState.selStart = editableEl.selectionStart;
    antiAIState.selEnd = editableEl.selectionEnd;
    antiAIState.originalValue = editableEl.value;
    antiAIState.savedRange = null;
  } else {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    antiAIState.element = editableEl;
    antiAIState.type = 'contenteditable';
    antiAIState.selectedText = sel.toString();
    antiAIState.selStart = 0;
    antiAIState.selEnd = 0;
    antiAIState.savedRange = sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
    antiAIState.originalValue = editableEl.innerHTML;
  }
  if (!antiAIState.selectedText.trim()) return;

  e.preventDefault();
  const menu = ensureAntiAIMenu();
  // Position: keep menu within viewport
  const menuW = 200;
  const menuH = 46;
  const x = Math.min(e.clientX, window.innerWidth - menuW - 8);
  const y = Math.min(e.clientY, window.innerHeight - menuH - 8);
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.classList.remove('hidden');
  hideStage2ContextMenu();
  hideStage3SourceMenu();
}

// ── Toast helpers ──

function _getOrCreateAntiAIToast() {
  let toast = document.getElementById('antiAIToast');
  if (toast) return toast;
  toast = document.createElement('div');
  toast.id = 'antiAIToast';
  toast.className = 'anti-ai-toast hidden';
  document.body.appendChild(toast);
  return toast;
}

function _clearAntiAITimer() {
  if (antiAIState.undoTimerId) {
    clearTimeout(antiAIState.undoTimerId);
    antiAIState.undoTimerId = null;
  }
}

function showAntiAILoadingToast() {
  const toast = _getOrCreateAntiAIToast();
  toast.className = 'anti-ai-toast';
  toast.innerHTML = `<span class="anti-ai-toast-msg">✦ Removing AI patterns…</span>`;
  _clearAntiAITimer();
}

function showAntiAIUndoToast(element, type, originalValue, selStart, selEnd) {
  const toast = _getOrCreateAntiAIToast();
  toast.className = 'anti-ai-toast';
  toast.innerHTML = `
    <span class="anti-ai-toast-msg">✦ Writing Anti-AI applied</span>
    <button class="anti-ai-toast-undo-btn" id="antiAIUndoBtn">Undo</button>
  `;
  _clearAntiAITimer();

  document.getElementById('antiAIUndoBtn').addEventListener('click', () => {
    if (type === 'textarea') {
      element.value = originalValue;
      element.selectionStart = selStart;
      element.selectionEnd = selEnd;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      element.innerHTML = originalValue;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
    hideAntiAIToast();
  });

  antiAIState.undoTimerId = setTimeout(hideAntiAIToast, 10000);
}

function showAntiAIErrorToast(msg) {
  const toast = _getOrCreateAntiAIToast();
  toast.className = 'anti-ai-toast anti-ai-toast--error';
  toast.innerHTML = `<span class="anti-ai-toast-msg">${escapeHTML(String(msg))}</span>`;
  _clearAntiAITimer();
  antiAIState.undoTimerId = setTimeout(hideAntiAIToast, 5000);
}

function hideAntiAIToast() {
  const toast = document.getElementById('antiAIToast');
  if (toast) toast.classList.add('hidden');
  _clearAntiAITimer();
}

// ── Core replacement ──

async function runAntiAIReplacement() {
  const { element, type, selectedText, selStart, selEnd, savedRange, originalValue } = antiAIState;
  if (!element || !selectedText.trim()) return;

  const providerKey = state.apiSettings.activeApiProvider;
  const profile = getActiveApiProfile(providerKey);
  if (!profile || !profile.apiKey) {
    showAntiAIErrorToast('Please configure API Settings first.');
    return;
  }

  showAntiAILoadingToast();

  try {
    const result = await window.studioApi.runWritingAntiAI({ providerKey, profile, content: selectedText });
    const newText = `${result?.text || ''}`.trim();
    if (!newText) throw new Error('Empty response from Writing Anti-AI.');

    if (type === 'textarea') {
      const before = originalValue.substring(0, selStart);
      const after = originalValue.substring(selEnd);
      element.value = before + newText + after;
      element.selectionStart = selStart;
      element.selectionEnd = selStart + newText.length;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // contenteditable: restore saved selection and replace
      const sel = window.getSelection();
      sel.removeAllRanges();
      if (savedRange) sel.addRange(savedRange);
      if (sel.rangeCount === 0) {
        // savedRange was null — append at end as fallback
        element.append(document.createTextNode(newText));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        showAntiAIUndoToast(element, type, originalValue, selStart, selEnd);
        return;
      }
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(newText));
      sel.collapseToEnd();
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    showAntiAIUndoToast(element, type, originalValue, selStart, selEnd);
  } catch (err) {
    showAntiAIErrorToast(err.message || 'Writing Anti-AI failed.');
  }
}

function stage3SelectionTouchesStrictLines(text, start, end) {
  const source = `${text || ''}`;
  const safeStart = Math.max(0, Math.min(start, end));
  const safeEnd = Math.min(source.length, Math.max(start, end));
  const lines = source.split('\n');
  let acc = 0;
  for (const line of lines) {
    const lineStart = acc;
    const lineEnd = acc + line.length;
    acc = lineEnd + 1;
    if (safeEnd < lineStart || safeStart > lineEnd) continue;
    const trimmed = line.trim();
    if (
      STAGE3_STRICT_RE.titleLine.test(trimmed)
      || STAGE3_STRICT_RE.quoteLabelLine.test(trimmed)
      || STAGE3_STRICT_RE.responseLabelLine.test(trimmed)
    ) {
      return true;
    }
  }
  return false;
}

function isSelectionAlreadyInStage3ColorToken(source, start, end, colorHex) {
  const text = `${source || ''}`;
  const prefix = `\${\\color{${colorHex}}\\text{`;
  const suffix = '}}$';
  const leftIdx = text.lastIndexOf(prefix, start);
  if (leftIdx < 0) return false;
  const bodyStart = leftIdx + prefix.length;
  const rightIdx = text.indexOf(suffix, bodyStart);
  if (rightIdx < 0) return false;
  return start >= bodyStart && end <= rightIdx;
}

function applyStage3HeadingPrefix(text, prefix) {
  return text.split('\n').map((line) => {
    if (!line.trim()) return line;
    return `${prefix} ${line.replace(/^#{1,6}\s+/, '')}`;
  }).join('\n');
}

function applyStage3SourceFormat(formatType) {
  const editor = document.querySelector('textarea.stage3-source-editor');
  if (!editor) return;

  const source = editor.value || '';
  let start = editor.selectionStart;
  let end = editor.selectionEnd;
  if (start === end && typeof stage3SourceContext.start === 'number' && typeof stage3SourceContext.end === 'number') {
    start = stage3SourceContext.start;
    end = stage3SourceContext.end;
  }
  if (start === end) {
    showStage3ThemeNotice('Select text first.');
    return;
  }

  if (stage3SelectionTouchesStrictLines(source, start, end)) {
    alert('Formatting on strict Stage 3 title/label lines is blocked to preserve immutable syntax.');
    return;
  }

  const selected = source.slice(start, end);
  let replacement = selected;
  if (formatType === 'bold') replacement = `**${selected}**`;
  if (formatType === 'italic') replacement = `*${selected}*`;
  if (formatType === 'underline') replacement = `<u>${selected}</u>`;
  if (formatType === 'color') {
    const hex = normalizeHexColor(state.stage3Settings.color || '#ff0000') || '#ff0000';
    if (isSelectionAlreadyInStage3ColorToken(source, start, end, hex)) return;
    replacement = `\${\\color{${hex}}\\text{${selected}}}$`;
  }
  if (formatType === 'h1') replacement = applyStage3HeadingPrefix(selected, '#');
  if (formatType === 'h2') replacement = applyStage3HeadingPrefix(selected, '##');

  editor.setRangeText(replacement, start, end, 'select');
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  editor.focus();
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
  return getOrCreateStage3DraftForReviewer(state.activeReviewerIdx, responseId);
}

function ensureStage3Selection() {
  const responses = stage3ResponsesForActiveReviewer();
  if (!responses.length) return null;
  const selected = state.stage3Selection[state.activeReviewerIdx];
  if (selected === STAGE3_ALL_TAB_ID) return selected;
  if (selected && responses.some((r) => r.id === selected)) return selected;
  state.stage3Selection[state.activeReviewerIdx] = responses[0].id;
  return responses[0].id;
}

function countChars(text) {
  return `${text || ''}`.length;
}

function getCurrentReviewerIdentifier() {
  return state.reviewers[state.activeReviewerIdx]?.name || `${state.activeReviewerIdx + 1}`;
}

function getReviewerId(reviewerIdx = state.activeReviewerIdx) {
  const idx = Number.isFinite(Number(reviewerIdx)) ? Number(reviewerIdx) : state.activeReviewerIdx;
  const safeIdx = Math.max(0, Math.min(state.reviewers.length - 1, idx));
  const reviewerName = `${state.reviewers[safeIdx]?.name || ''}`.trim();
  return reviewerName || `R${String(safeIdx + 1).padStart(3, '0')}`;
}

function reviewerIdxFromId(reviewerId) {
  if (Number.isFinite(Number(reviewerId))) {
    const idx = Number(reviewerId);
    if (idx >= 0 && idx < state.reviewers.length) return idx;
  }
  const key = `${reviewerId || ''}`.trim();
  const byName = state.reviewers.findIndex((_, idx) => getReviewerId(idx) === key);
  return byName >= 0 ? byName : state.activeReviewerIdx;
}

function extractTextFromHtml(html = '') {
  const div = document.createElement('div');
  div.innerHTML = `${html || ''}`;
  return (div.textContent || div.innerText || '').trim();
}

function createStage4ProgressState() {
  return {
    step1: { status: 'idle', text: '' },
    step2: { status: 'idle', text: '' },
  };
}

function stage4DraftStorageKey(reviewerId) {
  const safeReviewer = `${reviewerId || ''}`.replace(/[^a-zA-Z0-9_-]/g, '_') || 'reviewer';
  return `rebuttal-studio-stage4-draft:${state.currentFolderName || 'default'}:${safeReviewer}`;
}

function loadStage4DraftFromStorage(reviewerId) {
  try {
    return localStorage.getItem(stage4DraftStorageKey(reviewerId)) || '';
  } catch (_error) {
    return '';
  }
}

function persistStage4DraftToStorage(reviewerId, draft) {
  try {
    localStorage.setItem(stage4DraftStorageKey(reviewerId), `${draft || ''}`);
  } catch (_error) {
    // ignore storage failures
  }
}

function getStage4StateForReviewer(reviewerIdx = state.activeReviewerIdx) {
  if (!state.stage4Data[reviewerIdx]) {
    state.stage4Data[reviewerIdx] = {
      followupQuestion: '',
      draft: '',
      condensedMarkdown: '',
      condensedPath: '',
      refinedText: '',
      progress: createStage4ProgressState(),
    };
  }
  const cell = state.stage4Data[reviewerIdx];
  const reviewerId = getReviewerId(reviewerIdx);
  if (typeof cell.followupQuestion !== 'string') cell.followupQuestion = '';
  if (typeof cell.draft !== 'string') cell.draft = '';
  if (!cell.draft) {
    cell.draft = loadStage4DraftFromStorage(reviewerId);
  }
  if (typeof cell.condensedMarkdown !== 'string') cell.condensedMarkdown = '';
  if (typeof cell.condensedPath !== 'string') cell.condensedPath = '';
  if (typeof cell.refinedText !== 'string') cell.refinedText = '';
  if (!cell.progress || typeof cell.progress !== 'object') cell.progress = createStage4ProgressState();
  if (!cell.progress.step1 || !cell.progress.step2) cell.progress = createStage4ProgressState();
  return cell;
}

function getStage3AllSource(reviewerId) {
  const reviewerIdx = reviewerIdxFromId(reviewerId);
  return buildAllDocument(reviewerIdx);
}

async function skill1_condense(allSource) {
  const providerKey = state.apiSettings.activeApiProvider;
  const profile = getActiveApiProfile(providerKey);
  if (!profile || !profile.apiKey) {
    throw new Error('Please configure API Settings first.');
  }
  const result = await window.studioApi.runStage4Condense({
    providerKey,
    profile,
    allSource,
  });
  return `${result?.condensedMarkdown || ''}`.trim();
}

async function saveCondensedMarkdown(reviewerId, condensedMarkdown) {
  const result = await window.studioApi.saveStage4CondensedMarkdown({
    reviewerId,
    condensedMarkdown,
    folderName: state.currentFolderName || '',
  });
  return `${result?.path || ''}`.trim();
}

async function skill2_refine(condensedMarkdown, followupQuestion, draft) {
  const providerKey = state.apiSettings.activeApiProvider;
  const profile = getActiveApiProfile(providerKey);
  if (!profile || !profile.apiKey) {
    throw new Error('Please configure API Settings first.');
  }
  const result = await window.studioApi.runStage4Refine({
    providerKey,
    profile,
    condensedMarkdown,
    followupQuestion,
    draft,
  });
  return `${result?.refinedText || ''}`.trim();
}

function setProgress(step, status) {
  const stage4 = getStage4StateForReviewer(state.activeReviewerIdx);
  const targets = {
    step1: {
      running: 'Condensing prior discussion…',
      saved: 'Saved condensed context to local Markdown.',
      error: 'Step 1 failed.',
      idle: '',
    },
    step2: {
      running: 'Refining follow-up response with condensed context…',
      done: 'Done.',
      error: 'Step 2 failed.',
      idle: '',
    },
  };
  if (!targets[step]) return;
  stage4.progress[step] = {
    status,
    text: targets[step][status] || '',
  };
}

function showCopyPopup(refinedText) {
  if (!stage4CopyPopupEl) return;
  stage4CopyPopupEl.dataset.copyText = `${refinedText || ''}`;
  stage4CopyPopupEl.classList.remove('hidden');
}

function hideCopyPopup() {
  if (!stage4CopyPopupEl) return;
  stage4CopyPopupEl.classList.add('hidden');
  stage4CopyPopupEl.dataset.copyText = '';
}

function renderStage4ProgressLine(label, step) {
  const status = step?.status || 'idle';
  const text = step?.text || '';
  return `<div class="stage4-progress-line" data-status="${escapeHTML(status)}">
    <span class="stage4-progress-dot"></span>
    <span class="stage4-progress-label">${escapeHTML(label)}</span>
    <span class="stage4-progress-text">${escapeHTML(text || 'Waiting...')}</span>
  </div>`;
}

function renderStage4Panels() {
  const stage2LeftEl = document.getElementById('stage2LeftPanel');
  const reviewerName = state.reviewers[state.activeReviewerIdx]?.name || `${state.activeReviewerIdx + 1}`;
  const stage4 = getStage4StateForReviewer(state.activeReviewerIdx);
  const isRunning = stage4RefineRuntime.running && stage4RefineRuntime.reviewerIdx === state.activeReviewerIdx;

  stage2LeftEl.innerHTML = `
    <div class="stage4-left-wrap">
      <div class="stage3-reviewer-label">Reviewer ${escapeHTML(reviewerName)}</div>
      <div class="breakdown-block stage4-left-block">
        <div class="breakdown-section">
          <h4 class="breakdown-section-title">Reviewer Follow-up (Raw)</h4>
          <textarea class="response-textarea stage4-followup-editor" data-stage4-field="followupQuestion" placeholder="Paste the complete reviewer follow-up question or concern here.">${escapeHTML(stage4.followupQuestion || '')}</textarea>
        </div>
      </div>
      <div class="breakdown-block stage4-left-block">
        <div class="breakdown-section">
          <h4 class="breakdown-section-title">Draft Editor</h4>
          <textarea class="response-textarea stage4-draft-editor" data-stage4-field="draft" placeholder="Draft your follow-up response for this reviewer...">${escapeHTML(stage4.draft || '')}</textarea>
        </div>
      </div>
    </div>`;

  const refinedText = stage4.refinedText || '';
  const progress = stage4.progress || createStage4ProgressState();
  const hasProgress = Boolean(progress.step1?.text || progress.step2?.text || isRunning);
  breakdownContentEl.innerHTML = `
    <div class="stage4-right-wrap">
      <div class="stage4-progress-wrap ${hasProgress ? '' : 'stage4-progress-muted'}">
        ${renderStage4ProgressLine('Step 1', progress.step1)}
        ${renderStage4ProgressLine('Step 2', progress.step2)}
      </div>
      <div class="breakdown-block">
        <div class="breakdown-section">
          <div class="stage4-section-head">
            <h4 class="breakdown-section-title">Final Refined Output</h4>
            <button class="btn" data-stage4-copy-refined="1">Copy</button>
          </div>
          <textarea class="response-textarea stage4-refined-readonly" readonly>${escapeHTML(refinedText)}</textarea>
          ${stage4.condensedPath ? `<p class="muted stage4-condensed-path">Condensed context: ${escapeHTML(stage4.condensedPath)}</p>` : ''}
        </div>
      </div>
    </div>`;
}

async function runStage4RefinePipeline() {
  if (stage4RefineRuntime.running) return;
  const reviewerIdx = state.activeReviewerIdx;
  const reviewerId = getReviewerId(reviewerIdx);
  const stage4 = getStage4StateForReviewer(reviewerIdx);
  const allSource = getStage3AllSource(reviewerIdx);
  if (!`${allSource || ''}`.trim()) {
    alert('Stage3 All source is empty for this reviewer.');
    return;
  }

  stage4RefineRuntime = { running: true, reviewerIdx };
  convertBtnEl.disabled = true;
  convertBtnEl.classList.add('loading');
  setProgress('step1', 'running');
  setProgress('step2', 'idle');
  renderStage4Panels();

  try {
    const condensedMarkdown = await skill1_condense(allSource);
    const pathSaved = await saveCondensedMarkdown(reviewerId, condensedMarkdown);
    stage4.condensedMarkdown = condensedMarkdown;
    stage4.condensedPath = pathSaved;
    setProgress('step1', 'saved');
    queueStateSync();
    renderStage4Panels();
  } catch (error) {
    setProgress('step1', 'error');
    queueStateSync();
    renderStage4Panels();
    stage4RefineRuntime = { running: false, reviewerIdx: -1 };
    alert(error.message || 'Stage4 Step1 failed.');
    return;
  }

  try {
    setProgress('step2', 'running');
    renderStage4Panels();
    const refinedText = await skill2_refine(stage4.condensedMarkdown, stage4.followupQuestion, stage4.draft);
    stage4.refinedText = refinedText;
    setProgress('step2', 'done');
    queueStateSync();
    renderStage4Panels();
    showCopyPopup(refinedText);
  } catch (error) {
    setProgress('step2', 'error');
    queueStateSync();
    renderStage4Panels();
    alert(error.message || 'Stage4 Step2 failed.');
  } finally {
    stage4RefineRuntime = { running: false, reviewerIdx: -1 };
    convertBtnEl.disabled = false;
    convertBtnEl.classList.remove('loading');
    renderStage4Panels();
  }
}

function createStage5ProgressState() {
  return {
    step1: { status: 'idle', text: '' },
    step2: { status: 'idle', text: '' },
  };
}

function getStage5TemplateEntry(styleKey = state.stage5Settings.style) {
  const styles = STAGE5_STYLE_LIBRARY?.styles || {};
  const wanted = `${styleKey || ''}`.trim();
  if (wanted && styles[wanted]) return { key: wanted, entry: styles[wanted] };
  const fallbackKey = STAGE5_STYLE_LIBRARY?.defaultStyle || Object.keys(styles)[0] || '';
  return fallbackKey && styles[fallbackKey] ? { key: fallbackKey, entry: styles[fallbackKey] } : null;
}

function buildStage5TemplateSource(styleKey = state.stage5Settings.style) {
  const selected = getStage5TemplateEntry(styleKey);
  return `${selected?.entry?.template?.body || ''}`.trim();
}

function getStage5State() {
  if (!state.stage5Data || typeof state.stage5Data !== 'object') {
    state.stage5Data = {};
  }
  const cell = state.stage5Data;
  if (typeof cell.styleKey !== 'string' || !cell.styleKey) {
    cell.styleKey = state.stage5Settings.style || getStage5TemplateEntry()?.key || '';
  }
  if (typeof cell.source !== 'string') cell.source = '';
  if (typeof cell.renderedHtml !== 'string') cell.renderedHtml = '';
  if (typeof cell.templateConfirmed !== 'boolean') cell.templateConfirmed = false;
  if (!cell.templateConfirmed && `${cell.source || ''}`.trim()) cell.templateConfirmed = true;
  if (typeof cell.previewMode !== 'string') cell.previewMode = 'project';
  if (!cell.progress || typeof cell.progress !== 'object') cell.progress = createStage5ProgressState();
  if (!cell.progress.step1 || !cell.progress.step2) cell.progress = createStage5ProgressState();
  if (!cell.finalRatings || typeof cell.finalRatings !== 'object') cell.finalRatings = {};
  if (!cell.condensedMap || typeof cell.condensedMap !== 'object') cell.condensedMap = {};
  if (!cell.condensedPaths || typeof cell.condensedPaths !== 'object') cell.condensedPaths = {};

  state.reviewers.forEach((_, idx) => {
    const reviewerId = getReviewerId(idx);
    if (typeof cell.finalRatings[reviewerId] !== 'string') {
      cell.finalRatings[reviewerId] = '';
    }
  });

  if (cell.templateConfirmed && !cell.source && cell.styleKey) {
    cell.source = buildStage5TemplateSource(cell.styleKey);
  }

  return cell;
}

function renderStage5TemplateOptions() {
  if (!stage5TemplateSelectEl) return;
  const styles = STAGE5_STYLE_LIBRARY?.styles || {};
  const keys = Object.keys(styles);
  stage5TemplateSelectEl.innerHTML = keys.map((key) => {
    const label = styles[key]?.label || key;
    return `<option value="${escapeHTML(key)}">${escapeHTML(label)}</option>`;
  }).join('');
}

function openStage5TemplateModal() {
  if (!stage5TemplateModalEl) return;
  renderStage5TemplateOptions();
  const stage5 = getStage5State();
  const selected = getStage5TemplateEntry(stage5.styleKey);
  if (selected?.key) {
    stage5TemplateSelectEl.value = selected.key;
  }
  stage5TemplateErrorEl.textContent = '';
  stage5TemplateModalEl.classList.remove('hidden');
}

function closeStage5TemplateModal() {
  if (!stage5TemplateModalEl) return;
  stage5TemplateErrorEl.textContent = '';
  stage5TemplateModalEl.classList.add('hidden');
}

function applyStage5TemplateSelection() {
  const picked = `${stage5TemplateSelectEl?.value || ''}`.trim();
  if (!picked) {
    stage5TemplateErrorEl.textContent = 'Please select a template.';
    return;
  }
  const selected = getStage5TemplateEntry(picked);
  if (!selected?.entry) {
    stage5TemplateErrorEl.textContent = 'Selected template is unavailable.';
    return;
  }
  const stage5 = getStage5State();
  stage5.styleKey = selected.key;
  stage5.templateConfirmed = true;
  stage5.source = buildStage5TemplateSource(selected.key);
  stage5.renderedHtml = '';
  stage5.previewMode = 'project';
  stage5.progress = createStage5ProgressState();
  state.stage5Settings.style = selected.key;
  queueStateSync();
  closeStage5TemplateModal();
  if (currentStageKey() === 'stage5') {
    renderStage5Panels();
  }
}

function renderStage5PreviewHtml(markdownSource = '') {
  const rawHtml = renderStage3Markdown(markdownSource || '');
  const safeHtml = sanitizeStage3Html(rawHtml);
  return `<div class="stage5-openreview-preview">${safeHtml || '<p class="breakdown-placeholder">Nothing to preview yet.</p>'}</div>`;
}

function fitStage5SourceEditorHeight() {
  if (currentStageKey() !== 'stage5') return;
  const editor = document.querySelector('textarea.stage5-source-editor');
  const leftPanel = document.getElementById('stage2LeftPanel');
  if (!editor || !leftPanel) return;

  const editorTop = editor.getBoundingClientRect().top;
  const panelBottom = leftPanel.getBoundingClientRect().bottom;
  const minTarget = Math.max(300, Math.floor(panelBottom - editorTop - 12));
  editor.style.height = 'auto';
  editor.style.minHeight = `${minTarget}px`;
  editor.style.height = `${Math.max(minTarget, editor.scrollHeight)}px`;
}

function setStage5Progress(step, status, customText = '') {
  const stage5 = getStage5State();
  const targets = {
    step1: {
      running: 'Condensing all reviewers from Stage3 All source…',
      saved: 'Saved all condensed reviewer markdown files.',
      error: 'Step 1 failed.',
      idle: '',
    },
    step2: {
      running: 'Filling Stage5 template placeholders from reviewer summaries…',
      done: 'Done.',
      error: 'Step 2 failed.',
      idle: '',
    },
  };
  if (!targets[step]) return;
  stage5.progress[step] = {
    status,
    text: customText || targets[step][status] || '',
  };
}

function renderStage5ProgressLine(label, step) {
  const status = step?.status || 'idle';
  const text = step?.text || '';
  return `<div class="stage4-progress-line" data-status="${escapeHTML(status)}">
    <span class="stage4-progress-dot"></span>
    <span class="stage4-progress-label">${escapeHTML(label)}</span>
    <span class="stage4-progress-text">${escapeHTML(text || 'Waiting...')}</span>
  </div>`;
}

function renderStage5Panels() {
  const stage2LeftEl = document.getElementById('stage2LeftPanel');
  const stage5 = getStage5State();
  const selectedTemplate = getStage5TemplateEntry(stage5.styleKey);

  if (!stage5.templateConfirmed || !selectedTemplate?.entry) {
    stage2LeftEl.innerHTML = `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Final Remarks Template</h4><p class="breakdown-placeholder">Please select a Stage5 template first.</p></div></div>`;
    breakdownContentEl.innerHTML = `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Rendered Preview</h4><p class="breakdown-placeholder">Nothing to preview yet.</p></div></div>`;
    if (stage5TemplateModalEl?.classList.contains('hidden')) {
      openStage5TemplateModal();
    }
    return;
  }

  if (!stage5.source) {
    stage5.source = buildStage5TemplateSource(stage5.styleKey);
  }

  const reviewerRows = state.reviewers.map((reviewer, idx) => {
    const reviewerId = getReviewerId(idx);
    const reviewerLabel = reviewer.name ? `Reviewer ${reviewer.name}` : `Reviewer ${idx + 1}`;
    const original = `${state.breakdownData?.[idx]?.scores?.rating || ''}`.trim() || 'N/A';
    const finalRating = `${stage5.finalRatings[reviewerId] || ''}`;
    return `<label class="stage5-score-row">
      <span class="stage5-score-row-label">${escapeHTML(reviewerLabel)}: ${escapeHTML(original)}</span>
      <span class="stage5-score-row-arrow">→</span>
      <input class="text-input stage5-rating-input" data-stage5-rating="${escapeHTML(reviewerId)}" value="${escapeHTML(finalRating)}" placeholder="final rating" />
    </label>`;
  }).join('');

  const progress = stage5.progress || createStage5ProgressState();
  const hasProgress = Boolean(progress.step1?.text || progress.step2?.text || stage5AutoFillRuntime.running);

  stage2LeftEl.innerHTML = `
    <div class="stage5-left-wrap">
      <div class="stage5-score-board">
        ${reviewerRows || '<p class="muted">No reviewers found.</p>'}
      </div>
      <div class="breakdown-block stage4-left-block">
        <div class="breakdown-section">
          <h4 class="breakdown-section-title">Raw Source (Editable)</h4>
          <textarea class="response-textarea stage5-source-editor" data-stage5-field="source" placeholder="Stage5 template source...">${escapeHTML(stage5.source || '')}</textarea>
        </div>
      </div>
    </div>`;

  const sampleMode = stage5.previewMode === 'sample';
  const toggleLabel = sampleMode ? 'Return' : 'Final Template';
  const previewHtml = sampleMode
    ? renderStage5PreviewHtml(STAGE5_SAMPLE_TEMPLATE || '')
    : (stage5.renderedHtml || '');
  const previewBody = previewHtml
    ? `<div class="stage5-preview-host">${previewHtml}</div>`
    : `<p class="breakdown-placeholder">${sampleMode ? 'Sample template is unavailable.' : 'Click Preview to render the current Stage5 source.'}</p>`;

  breakdownContentEl.innerHTML = `
    <div class="stage5-right-wrap">
      <div class="stage4-progress-wrap ${hasProgress ? '' : 'stage4-progress-muted'}">
        ${renderStage5ProgressLine('Step 1', progress.step1)}
        ${renderStage5ProgressLine('Step 2', progress.step2)}
      </div>
      <div class="breakdown-block">
        <div class="breakdown-section">
          <div class="stage4-section-head">
            <h4 class="breakdown-section-title">${sampleMode ? 'Final Template Sample (Read-only)' : 'Rendered Preview (Read-only)'}</h4>
            <button class="btn" data-stage5-toggle-sample="1">${toggleLabel}</button>
          </div>
          ${previewBody}
        </div>
      </div>
    </div>`;
  setTimeout(() => fitStage5SourceEditorHeight(), 0);
}

async function saveStage5CondensedMarkdownFile(reviewerId, condensedMarkdown) {
  const result = await window.studioApi.saveStage5CondensedMarkdown({
    reviewerId,
    condensedMarkdown,
    folderName: state.currentFolderName || '',
  });
  return `${result?.path || ''}`.trim();
}

async function skill5_finalize(templateSource, reviewerSummaries) {
  const providerKey = state.apiSettings.activeApiProvider;
  const profile = getActiveApiProfile(providerKey);
  if (!profile || !profile.apiKey) {
    throw new Error('Please configure API Settings first.');
  }
  const result = await window.studioApi.runStage5FinalRemarks({
    providerKey,
    profile,
    templateSource,
    reviewerSummaries,
  });
  return `${result?.filledMarkdown || ''}`.trim();
}

async function runStage5AutoFillPipeline() {
  if (stage5AutoFillRuntime.running) return;
  const stage5 = getStage5State();
  if (!`${stage5.source || ''}`.trim()) {
    alert('Stage5 template source is empty. Please select a template first.');
    return;
  }
  if (!state.reviewers.length) {
    alert('No reviewers found.');
    return;
  }

  stage5AutoFillRuntime = { running: true };
  stage2AutoFitBtn.disabled = true;
  stage2AutoFitBtn.classList.add('loading');
  setStage5Progress('step1', 'running');
  setStage5Progress('step2', 'idle');
  renderStage5Panels();

  const reviewerSummaries = [];
  const condensedMap = {};
  const condensedPaths = {};

  try {
    for (let idx = 0; idx < state.reviewers.length; idx += 1) {
      const reviewerId = getReviewerId(idx);
      const reviewerLabel = state.reviewers[idx]?.name || `${idx + 1}`;
      const allSource = getStage3AllSource(idx);
      if (!`${allSource || ''}`.trim()) {
        throw new Error(`Stage3 All source is empty for Reviewer ${reviewerLabel}.`);
      }
      setStage5Progress('step1', 'running', `Condensing Reviewer ${reviewerLabel}...`);
      renderStage5Panels();
      const condensedMarkdown = await skill1_condense(allSource);
      const pathSaved = await saveStage5CondensedMarkdownFile(reviewerId, condensedMarkdown);
      condensedMap[reviewerId] = condensedMarkdown;
      condensedPaths[reviewerId] = pathSaved;
      reviewerSummaries.push({
        reviewerId,
        originalRating: `${state.breakdownData?.[idx]?.scores?.rating || ''}`.trim(),
        finalRating: `${stage5.finalRatings?.[reviewerId] || ''}`.trim(),
        condensedMarkdown,
      });
    }
    stage5.condensedMap = condensedMap;
    stage5.condensedPaths = condensedPaths;
    setStage5Progress('step1', 'saved');
    queueStateSync();
    renderStage5Panels();
  } catch (error) {
    setStage5Progress('step1', 'error', error.message || 'Stage5 step1 failed.');
    queueStateSync();
    renderStage5Panels();
    stage5AutoFillRuntime = { running: false };
    stage2AutoFitBtn.disabled = false;
    stage2AutoFitBtn.classList.remove('loading');
    alert(error.message || 'Stage5 step1 failed.');
    return;
  }

  try {
    setStage5Progress('step2', 'running');
    renderStage5Panels();
    const filled = await skill5_finalize(stage5.source, reviewerSummaries);
    stage5.source = filled;
    stage5.renderedHtml = '';
    stage5.previewMode = 'project';
    setStage5Progress('step2', 'done');
    queueStateSync();
    renderStage5Panels();
  } catch (error) {
    setStage5Progress('step2', 'error', error.message || 'Stage5 step2 failed.');
    queueStateSync();
    renderStage5Panels();
    alert(error.message || 'Stage5 step2 failed.');
  } finally {
    stage5AutoFillRuntime = { running: false };
    stage2AutoFitBtn.disabled = false;
    stage2AutoFitBtn.classList.remove('loading');
    renderStage5Panels();
  }
}

function renderStage5Preview() {
  const stage5 = getStage5State();
  const liveEditor = document.querySelector('textarea.stage5-source-editor');
  if (liveEditor && typeof liveEditor.value === 'string') {
    stage5.source = liveEditor.value;
  }
  stage5.previewMode = 'project';
  stage5.renderedHtml = renderStage5PreviewHtml(stage5.source || '');
  queueStateSync();
  renderStage5Panels();
}

function getOrCreateStage3DraftForReviewer(reviewerIdx, responseId) {
  if (!state.stage3Drafts[reviewerIdx]) state.stage3Drafts[reviewerIdx] = {};
  if (!state.stage3Drafts[reviewerIdx][responseId]) {
    state.stage3Drafts[reviewerIdx][responseId] = { markdownSource: '', planTask: '', renderedHtml: '', renderedThemeColor: '' };
  }
  const draft = state.stage3Drafts[reviewerIdx][responseId];
  if (typeof draft.markdownSource !== 'string') draft.markdownSource = '';
  if (typeof draft.renderedHtml !== 'string') draft.renderedHtml = '';
  if (typeof draft.renderedThemeColor !== 'string') draft.renderedThemeColor = '';
  if (typeof draft.planTask !== 'string') draft.planTask = '';
  return draft;
}

function buildStage3UnitsForReviewer(reviewerIdx) {
  const data = getBreakdownDataForReviewer(reviewerIdx);
  const responses = Array.isArray(data.responses) ? data.responses : [];
  const stage2Map = getStage2ResponsesForReviewer(reviewerIdx);
  const color = state.stage3Settings.color || '#f26921';
  const units = [{ key: 'opening', text: STAGE3_ALL_OPENING_PARAGRAPH, atomic: true }];

  responses.forEach((resp) => {
    const draft = getOrCreateStage3DraftForReviewer(reviewerIdx, resp.id);
    const refined = stage2Map[resp.id]?.draft || '';
    const strictSource = enforceStrictStage3Source(draft.markdownSource, resp, responses, refined, color);
    units.push({ key: resp.id, text: strictSource, atomic: true });
  });

  units.push({ key: 'closing', text: STAGE3_ALL_CLOSING_PARAGRAPH, atomic: true });
  return units;
}

function buildAllDocument(reviewerId) {
  const reviewerIdx = Number(reviewerId);
  const safeReviewerIdx = Number.isFinite(reviewerIdx) ? reviewerIdx : state.activeReviewerIdx;
  const units = buildStage3UnitsForReviewer(safeReviewerIdx);
  return units.map((unit) => unit.text).join('\n\n');
}

function compileFirstRoundForExport(doc) {
  const reviewers = doc.reviewers || [];
  const breakdownData = doc.breakdownData || {};
  const stage2Replies = doc.stage2Replies || {};
  const stage3Settings = doc.stage3Settings || { style: 'standard', color: '#f26921' };
  const stage3Drafts = doc.stage3Drafts || {};
  const color = stage3Settings.color || '#f26921';

  const segments = [];

  reviewers.forEach((r, rIdx) => {
    const rName = r.name || `Reviewer ${rIdx + 1}`;
    const rData = breakdownData[rIdx] || {};
    const responses = Array.isArray(rData.responses) ? rData.responses : [];
    const rStage2 = stage2Replies[rIdx] || {};
    const rStage3 = stage3Drafts[rIdx] || {};

    segments.push(`# Response to Reviewer ${rName}`);

    // Opening
    segments.push(STAGE3_ALL_OPENING_PARAGRAPH);

    responses.forEach(resp => {
      const draft = rStage3[resp.id] || { markdownSource: '' };
      const refined = rStage2[resp.id]?.draft || '';
      const text = enforceStrictStage3Source(draft.markdownSource, resp, responses, refined, color);
      segments.push(text);
    });

    segments.push(STAGE3_ALL_CLOSING_PARAGRAPH);
    if (rIdx < reviewers.length - 1) {
      segments.push('\n---\n');
    }
  });

  const markdown = segments.join('\n\n');
  const html = renderStage3Markdown(markdown);

  return { markdown, html };
}

function splitByUnits(units, L) {
  const maxLen = Number(L);
  if (!Number.isFinite(maxLen) || maxLen <= 0) return [];
  const parts = [];
  let currentUnits = [];
  let currentLength = 0;

  const finalizeCurrent = () => {
    if (!currentUnits.length) return;
    const text = currentUnits.map((u) => u.text).join('\n\n');
    parts.push({
      units: currentUnits,
      text,
      length: countChars(text),
      hasOversizedUnit: currentUnits.some((u) => countChars(u.text) > maxLen),
    });
    currentUnits = [];
    currentLength = 0;
  };

  units.forEach((unit) => {
    const unitLength = countChars(unit.text);
    if (unitLength > maxLen) {
      finalizeCurrent();
      parts.push({
        units: [unit],
        text: unit.text,
        length: unitLength,
        hasOversizedUnit: true,
      });
      return;
    }

    if (!currentUnits.length) {
      currentUnits.push(unit);
      currentLength = unitLength;
      return;
    }

    const separatorLen = 2; // \n\n between units
    if (currentLength + separatorLen + unitLength <= maxLen) {
      currentUnits.push(unit);
      currentLength += separatorLen + unitLength;
      return;
    }

    finalizeCurrent();
    currentUnits.push(unit);
    currentLength = unitLength;
  });

  finalizeCurrent();
  return parts;
}

function renderPreview(text) {
  const color = state.stage3Settings.color || '#f26921';
  return parseAndSanitizeStage3Markdown(text, color);
}

function updateStage3CharCounter(text) {
  const label = document.querySelector('[data-stage3-char-counter]');
  if (!label) return;
  label.textContent = `Total words: ${countChars(text)}`;
}

function openStage3BreakdownModal() {
  if (!stage3BreakdownModalEl) return;
  stage3BreakdownErrorEl.textContent = '';
  stage3BreakdownLengthInputEl.value = '';
  stage3BreakdownModalEl.classList.remove('hidden');
  setTimeout(() => stage3BreakdownLengthInputEl.focus(), 50);
}

function closeStage3BreakdownModal() {
  if (!stage3BreakdownModalEl) return;
  stage3BreakdownModalEl.classList.add('hidden');
}

function closeStage3BreakdownResultModal() {
  if (!stage3BreakdownResultModalEl) return;
  stage3BreakdownResultModalEl.classList.add('hidden');
  stage3BreakdownPartsCache = [];
}

function renderStage3BreakdownResult(parts) {
  if (!stage3BreakdownResultModalEl || !stage3BreakdownResultBodyEl) return;
  stage3BreakdownPartsCache = Array.isArray(parts) ? parts : [];
  const reviewerId = getCurrentReviewerIdentifier();
  const total = parts.length;
  stage3BreakdownResultBodyEl.innerHTML = parts.map((part, idx) => {
    const subject = `Author Response to Reviewer ${reviewerId} (Part ${idx + 1}/${total})`;
    const warning = part.hasOversizedUnit
      ? '<p class="muted">Warning: This part contains at least one atomic unit longer than the max length and was kept intact.</p>'
      : '';
    return `
      <div class="stage3-breakdown-part">
        <div class="stage3-breakdown-subject"><strong>Subject:</strong> ${escapeHTML(subject)}</div>
        ${warning}
        <div class="stage3-breakdown-content-label"><strong>Content:</strong></div>
        <textarea class="text-input stage3-breakdown-content" readonly>${escapeHTML(part.text)}</textarea>
        <div class="stage3-breakdown-actions">
          <button class="btn" data-stage3-copy-part="${idx}" data-stage3-copy-subject="${escapeHTML(subject)}">Copy</button>
        </div>
      </div>
    `;
  }).join('');
  stage3BreakdownResultModalEl.classList.remove('hidden');
}

function confirmStage3Breakdown() {
  const raw = `${stage3BreakdownLengthInputEl?.value || ''}`.trim();
  const limit = Number(raw);
  if (!Number.isInteger(limit) || limit <= 0) {
    stage3BreakdownErrorEl.textContent = 'Please input a positive integer.';
    return;
  }
  const units = buildStage3UnitsForReviewer(state.activeReviewerIdx);
  const parts = splitByUnits(units, limit);
  if (!parts.length) {
    stage3BreakdownErrorEl.textContent = 'Unable to split content. Please check the max length.';
    return;
  }
  closeStage3BreakdownModal();
  renderStage3BreakdownResult(parts);
}

function stage3IssueCode(resp) {
  return resp.source === 'question' ? `Q${(resp.source_id || '').replace(/\D/g, '') || '1'}` : `W${(resp.source_id || '').replace(/\D/g, '') || '1'}`;
}

function renderStage3Palette(tempColor) {
  if (!stage3PresetColorsEl) return;
  const activeColor = (tempColor && tempColor !== 'custom') ? tempColor : (state.stage3Settings.color || '#f26921');
  let isCustom = true;
  const buttons = STAGE3_PRESET_COLORS.map((color) => {
    const isActive = tempColor !== 'custom' && color.toLowerCase() === activeColor.toLowerCase();
    if (isActive) isCustom = false;
    return `<button class="stage3-color-dot ${isActive ? 'active' : ''}" data-stage3-color="${color}" style="--dot:${color}" title="${color}"></button>`;
  }).join('');

  if (tempColor === 'custom') isCustom = true;

  stage3PresetColorsEl.innerHTML = `${buttons}<button class="stage3-color-custom ${isCustom ? 'active' : ''}" data-stage3-color="custom">Custom</button>`;

  if (tempColor !== 'custom') {
    stage3CustomHexInputEl.value = activeColor;
  }
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

function showStage3ThemeNotice(message) {
  if (!stage3ThemeNoticeEl) return;
  if (!message) {
    stage3ThemeNoticeEl.textContent = '';
    stage3ThemeNoticeEl.classList.add('hidden');
    return;
  }
  stage3ThemeNoticeEl.textContent = message;
  stage3ThemeNoticeEl.classList.remove('hidden');
}

const STAGE3_STRICT_RE = {
  titleLine: /^### \*\*\$\{\\color\{#[0-9a-fA-F]{6}\}\\text\{([^{}]+)\}\}\$\*\*$/,
  quoteLabelLine: /^> \$\{\\color\{#[0-9a-fA-F]{6}\}\\text\{([^{}]+)\}\}\$$/,
  responseLabelLine: /^\$\{\\color\{#[0-9a-fA-F]{6}\}\\text\{([^{}]+)\}\}\$$/,
  latexColorToken: /\$\{\\color\{(#[0-9a-fA-F]{6})\}\\text\{([^{}]+)\}\}\$/g,
  legacyTitleSpan: /^###\s*<span[^>]*color\s*:\s*(#[0-9a-fA-F]{6})[^>]*>(.*?)<\/span>\s*$/gim,
  legacyQuoteSpan: /^>\s*<span[^>]*color\s*:\s*(#[0-9a-fA-F]{6})[^>]*>(.*?)<\/span>\s*(.*)$/gim,
  legacyResponseSpan: /^<span[^>]*color\s*:\s*(#[0-9a-fA-F]{6})[^>]*>(.*?)<\/span>\s*$/gim,
};

function sanitizeStage3LabelText(text, fallback) {
  const cleaned = `${text || ''}`
    .replace(/\r?\n/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || fallback;
}

function stage3LatexColorToken(color, text, fallbackText = '') {
  const safeColor = normalizeHexColor(color) || '#f26921';
  const safeText = sanitizeStage3LabelText(text, fallbackText);
  return `\${\\color{${safeColor}}\\text{${safeText}}}$`;
}

function stage3DefaultTitleLabel(selectedResp, responses) {
  const idx = responses.findIndex((r) => r.id === selectedResp.id) + 1;
  if (idx === 1) return 'R1: Regarding the Novelty Clarification.';
  const raw = sanitizeStage3LabelText(selectedResp.title || `Response ${idx}`, `Response ${idx}`);
  return `R${idx}: ${raw}`;
}

function stage3DefaultQuoteLabel(selectedResp) {
  const issueLabel = selectedResp.source === 'question' ? 'Question' : 'Weakness';
  const issueIndex = (selectedResp.source_id || '').replace(/\D/g, '') || '1';
  return `${issueLabel}-${issueIndex}:`;
}

function stage3DefaultResponseLabel(selectedResp) {
  return `Response ${stage3IssueCode(selectedResp)}:`;
}

function stripTags(value) {
  return `${value || ''}`.replace(/<[^>]*>/g, '').trim();
}

function migrateLegacyStage3Source(markdownSource, fallbackColor) {
  const safeColor = normalizeHexColor(fallbackColor) || '#f26921';
  let src = `${markdownSource || ''}`;

  src = src.replace(STAGE3_STRICT_RE.legacyTitleSpan, (_m, hex, text) => {
    const color = normalizeHexColor(hex) || safeColor;
    return `### **${stage3LatexColorToken(color, stripTags(text), 'R1: Regarding the Novelty Clarification.')}**`;
  });

  src = src.replace(STAGE3_STRICT_RE.legacyQuoteSpan, (_m, hex, text, rest) => {
    const color = normalizeHexColor(hex) || safeColor;
    const label = `> ${stage3LatexColorToken(color, stripTags(text), 'Weakness-1:')}`;
    const trailing = `${rest || ''}`.trim();
    if (!trailing) return label;
    return `${label}\n> ${trailing}`;
  });

  src = src.replace(STAGE3_STRICT_RE.legacyResponseSpan, (_m, hex, text) => {
    const color = normalizeHexColor(hex) || safeColor;
    return stage3LatexColorToken(color, stripTags(text), 'Response W1:');
  });

  return src;
}

function extractStage3LineText(markdownSource, re, fallback) {
  const lines = `${markdownSource || ''}`.split('\n');
  for (const line of lines) {
    const m = line.trim().match(re);
    if (m?.[1]) return sanitizeStage3LabelText(m[1], fallback);
  }
  return fallback;
}

function extractStage3QuoteContent(lines, quoteIdx, responseIdx, fallback) {
  if (quoteIdx < 0) return fallback || '';
  const end = responseIdx >= 0 ? responseIdx : lines.length;
  const quoteLines = [];
  for (let i = quoteIdx + 1; i < end; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      if (quoteLines.length) break;
      continue;
    }
    if (!trimmed.startsWith('>')) break;
    quoteLines.push(line.replace(/^>\s?/, ''));
  }
  if (quoteLines.length) return quoteLines.join('\n').trim();
  return `${fallback || ''}`.trim();
}

function extractStage3ResponseBody(lines, responseIdx, fallback) {
  if (responseIdx < 0) return `${fallback || ''}`.trim();
  const tail = lines.slice(responseIdx + 1);
  while (tail.length && !tail[0].trim()) tail.shift();
  return tail.join('\n').trim() || `${fallback || ''}`.trim();
}

function enforceStrictStage3Source(markdownSource, selectedResp, responses, refined, color) {
  const safeColor = normalizeHexColor(color) || '#f26921';
  const migrated = migrateLegacyStage3Source(markdownSource, safeColor);
  const lines = migrated.split('\n');
  const responseOrdinal = responses.findIndex((r) => r.id === selectedResp.id) + 1;

  const defaultTitle = stage3DefaultTitleLabel(selectedResp, responses);
  const defaultQuoteLabel = stage3DefaultQuoteLabel(selectedResp);
  const defaultResponseLabel = stage3DefaultResponseLabel(selectedResp);

  let titleLabel = extractStage3LineText(migrated, STAGE3_STRICT_RE.titleLine, defaultTitle);
  if (responseOrdinal === 1) {
    titleLabel = 'R1: Regarding the Novelty Clarification.';
  }
  const quoteLabel = extractStage3LineText(migrated, STAGE3_STRICT_RE.quoteLabelLine, defaultQuoteLabel);
  const responseLabel = extractStage3LineText(migrated, STAGE3_STRICT_RE.responseLabelLine, defaultResponseLabel);

  const quoteIdx = lines.findIndex((line) => STAGE3_STRICT_RE.quoteLabelLine.test(line.trim()));
  const responseIdx = lines.findIndex((line) => STAGE3_STRICT_RE.responseLabelLine.test(line.trim()));

  const quoteContent = extractStage3QuoteContent(lines, quoteIdx, responseIdx, selectedResp.quoted_issue || '');
  const responseBody = extractStage3ResponseBody(lines, responseIdx, refined || '(No refined answer yet)');

  const strictLines = [
    `### **${stage3LatexColorToken(safeColor, titleLabel, defaultTitle)}**`,
    '',
    `> ${stage3LatexColorToken(safeColor, quoteLabel, defaultQuoteLabel)}`,
  ];

  if (quoteContent) {
    quoteContent.split('\n').forEach((line) => {
      strictLines.push(`> ${line}`);
    });
  }

  strictLines.push('');
  strictLines.push(stage3LatexColorToken(safeColor, responseLabel, defaultResponseLabel));
  strictLines.push('');
  strictLines.push(responseBody || '(No refined answer yet)');
  return strictLines.join('\n');
}

function buildStage3DefaultMarkdown(selectedResp, responses, refined, color) {
  return enforceStrictStage3Source('', selectedResp, responses, refined, color);
}

function tokenizeStage3LatexColor(markdownSource) {
  const tokens = [];
  const text = `${markdownSource || ''}`;
  const markedSource = text.replace(STAGE3_STRICT_RE.latexColorToken, (_m, hex, labelText) => {
    const idx = tokens.length;
    const safeColor = normalizeHexColor(hex) || '#f26921';
    tokens.push({ color: safeColor, text: labelText });
    return `@@STAGE3_LATEX_COLOR_${idx}@@`;
  });
  return { markedSource, tokens };
}

function renderStage3InlineFallback(text) {
  const escaped = escapeHTML(text || '');
  return escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function renderStage3MarkdownFallback(markdownSource) {
  const lines = `${markdownSource || ''}`.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      html.push(`<h3>${renderStage3InlineFallback(h3[1])}</h3>`);
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const parts = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        parts.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      html.push(`<blockquote><p>${parts.map((p) => renderStage3InlineFallback(p)).join('<br>')}</p></blockquote>`);
      continue;
    }

    const para = [];
    while (i < lines.length && lines[i].trim() && !/^###\s+/.test(lines[i]) && !/^>\s?/.test(lines[i])) {
      para.push(lines[i]);
      i += 1;
    }
    html.push(`<p>${para.map((p) => renderStage3InlineFallback(p)).join('<br>')}</p>`);
  }

  return html.join('');
}

function markedParseApi() {
  if (!window.marked) return null;
  if (typeof window.marked.parse === 'function') return window.marked.parse.bind(window.marked);
  if (typeof window.marked === 'function') return window.marked.bind(window);
  return null;
}

function renderStage3Markdown(markdownSource) {
  const parse = markedParseApi();
  if (!parse) return renderStage3MarkdownFallback(markdownSource);
  try {
    return parse(markdownSource || '', {
      gfm: true,
      breaks: true,
      headerIds: false,
      mangle: false,
    });
  } catch (err) {
    console.error('Stage3 markdown parse failed, fallback renderer used:', err);
    return renderStage3MarkdownFallback(markdownSource);
  }
}

function injectStage3LatexTokens(htmlSource, tokens) {
  let out = `${htmlSource || ''}`;
  tokens.forEach((token, idx) => {
    const marker = `@@STAGE3_LATEX_COLOR_${idx}@@`;
    const replacement = `<span class="stage3-latex-token" style="color:${token.color};">${escapeHTML(token.text)}</span>`;
    out = out.split(marker).join(replacement);
  });
  return out;
}

function sanitizeStage3Html(htmlSource) {
  if (window.DOMPurify?.sanitize) {
    return window.DOMPurify.sanitize(htmlSource || '', {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['style', 'class'],
    });
  }
  return htmlSource || '';
}

function parseAndSanitizeStage3Markdown(markdownSource, themeColor) {
  const normalized = `${markdownSource || ''}`.replace(/\r\n/g, '\n');
  const { markedSource, tokens } = tokenizeStage3LatexColor(normalized);
  const rawHtml = renderStage3Markdown(markedSource);
  const htmlWithColorTokens = injectStage3LatexTokens(rawHtml, tokens);
  const safeHtml = sanitizeStage3Html(htmlWithColorTokens);
  return `<div class="stage3-openreview-preview" style="--stage3-theme-color:${themeColor};">${safeHtml || '<p class="breakdown-placeholder">Nothing to preview yet.</p>'}</div>`;
}

function renderStage3Panels() {
  const stage2LeftEl = document.getElementById('stage2LeftPanel');
  const responses = stage3ResponsesForActiveReviewer();
  const selectedId = ensureStage3Selection();

  if (!responses.length) {
    stage2LeftEl.innerHTML = `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Markdown Source</h4><p class="breakdown-placeholder">No responses found. Please complete Stage 1 and Stage 2 first.</p></div></div>`;
    breakdownContentEl.innerHTML = `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Rendered Preview</h4><p class="breakdown-placeholder">Nothing to preview yet.</p></div></div>`;
    return;
  }

  const reviewerName = state.reviewers[state.activeReviewerIdx]?.name || `${state.activeReviewerIdx + 1}`;
  const chips = [
    `<button class="stage3-issue-pill ${selectedId === STAGE3_ALL_TAB_ID ? 'active' : ''}" data-stage3-response="${STAGE3_ALL_TAB_ID}">All</button>`,
    ...responses.map((resp, idx) => `<button class="stage3-issue-pill ${resp.id === selectedId ? 'active' : ''}" data-stage3-response="${escapeHTML(resp.id)}">${idx + 1}</button>`),
  ].join('');

  if (selectedId === STAGE3_ALL_TAB_ID) {
    const allDoc = buildAllDocument(state.activeReviewerIdx);
    stage2LeftEl.innerHTML = `
      <div class="stage3-left-wrap">
        <div class="stage3-head-row">
          <div class="stage3-reviewer-label">Reviewer ${escapeHTML(reviewerName)}</div>
          <div class="stage3-head-actions">
            <div class="stage3-counter-label" data-stage3-char-counter>Total words: ${countChars(allDoc)}</div>
            <button class="btn primary stage3-breakdown-float-btn" type="button" data-stage3-breakdown-open="1">To break down</button>
          </div>
        </div>
        <div class="stage3-issues-row">${chips}</div>
        <div class="stage3-plan-head">Combined Raw Source (Read-only)</div>
        <textarea class="response-textarea outline-textarea stage3-source-editor stage3-source-editor-readonly" readonly>${escapeHTML(allDoc)}</textarea>
      </div>`;
    const allPreviewHtml = renderPreview(allDoc);
    breakdownContentEl.innerHTML = `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Rendered Preview (Read-only)</h4><div class="stage3-preview-host">${allPreviewHtml}</div></div></div>`;
    autoExpandStage3Editor();
    updateStage3CharCounter(allDoc);
    return;
  }

  const selectedResp = responses.find((r) => r.id === selectedId) || responses[0];
  const draft = getStage3DraftForResponse(selectedResp.id);
  const stage2Map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
  const refined = stage2Map[selectedResp.id]?.draft || '';
  const color = state.stage3Settings.color || '#f26921';

  if (!draft.markdownSource) {
    draft.markdownSource = buildStage3DefaultMarkdown(selectedResp, responses, refined, color);
    queueStateSync();
  }

  stage2LeftEl.innerHTML = `
    <div class="stage3-left-wrap">
      <div class="stage3-head-row">
        <div class="stage3-reviewer-label">Reviewer ${escapeHTML(reviewerName)}</div>
        <div class="stage3-counter-label" data-stage3-char-counter>Total words: ${countChars(draft.markdownSource)}</div>
      </div>
      <div class="stage3-issues-row">${chips}</div>
      <div class="stage3-plan-head">Editable Raw Source (Markdown)</div>
      <textarea class="response-textarea outline-textarea stage3-source-editor" data-stage3-field="markdownSource" data-response-id="${escapeHTML(selectedResp.id)}" placeholder="Write raw markdown source here...">${escapeHTML(draft.markdownSource)}</textarea>
    </div>`;

  const previewBody = draft.renderedHtml
    ? `<div class="stage3-preview-host">${draft.renderedHtml}</div>`
    : '<p class="breakdown-placeholder">Click Preview to render the current Markdown source.</p>';

  breakdownContentEl.innerHTML = `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Rendered Preview (Read-only)</h4>${previewBody}</div></div>`;
  autoExpandStage3Editor();
  updateStage3CharCounter(draft.markdownSource);
}

function autoExpandStage3Editor() {
  if (currentStageKey() !== 'stage3') return;
  const editor = document.querySelector('textarea.stage3-source-editor');
  if (!editor) return;
  stage2LeftPanelEl.style.overflowY = 'visible';
  editor.style.height = 'auto';
  editor.style.height = `${editor.scrollHeight}px`;
}

function renderStage3Preview() {
  const responses = stage3ResponsesForActiveReviewer();
  const selectedId = ensureStage3Selection();
  if (selectedId === STAGE3_ALL_TAB_ID) {
    renderStage3Panels();
    return;
  }
  const selectedResp = responses.find((r) => r.id === selectedId);
  if (!selectedResp) {
    renderStage3Panels();
    return;
  }

  const draft = getStage3DraftForResponse(selectedResp.id);
  const liveEditor = document.querySelector('textarea.stage3-source-editor');
  if (liveEditor && typeof liveEditor.value === 'string') {
    draft.markdownSource = liveEditor.value;
  }
  const stage2Map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
  const refined = stage2Map[selectedResp.id]?.draft || '';
  const color = state.stage3Settings.color || '#f26921';
  draft.markdownSource = enforceStrictStage3Source(draft.markdownSource, selectedResp, responses, refined, color);
  draft.renderedHtml = renderPreview(draft.markdownSource);
  draft.renderedThemeColor = color;
  queueStateSync();
  showStage3ThemeNotice('');
  renderStage3Panels();
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

  const latexColorRe = /(\\color\{)#[0-9a-fA-F]{6}(\})/g;
  const legacySpanColorRe = /(style\s*=\s*["'][^"']*color\s*:\s*)#[0-9a-fA-F]{6}/gi;
  for (const rIdx in state.stage3Drafts) {
    const drafts = state.stage3Drafts[rIdx];
    if (!drafts) continue;
    for (const rId in drafts) {
      const source = drafts[rId]?.markdownSource;
      if (typeof source !== 'string') continue;
      drafts[rId].markdownSource = source
        .replace(latexColorRe, `$1${color}$2`)
        .replace(legacySpanColorRe, `$1${color}`);
    }
  }

  stage3StyleModalEl.classList.add('hidden');
  queueStateSync();
  showStage3ThemeNotice('Theme updated successfully. Please re-preview.');
  if (currentStageKey() === 'stage3') renderStage3Panels();
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
      <div class="response-item-label">
        Response ${idx + 1}
        <button class="split-response-btn" data-split-index="${idx}" title="Split issue">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>
          Split
        </button>
      </div>
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

/* ── Split Response Modal ── */
const splitResponseModalEl = document.getElementById('splitResponseModal');
const splitResponseContentInput = document.getElementById('splitResponseContentInput');
const splitResponseError = document.getElementById('splitResponseError');
const confirmSplitResponseBtn = document.getElementById('confirmSplitResponseBtn');
const cancelSplitResponseBtn = document.getElementById('cancelSplitResponseBtn');

let pendingSplitIndex = null;

function promptSplitResponse(idx) {
  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);
  const resp = data.responses && data.responses[idx];
  if (!resp) return;
  pendingSplitIndex = idx;
  splitResponseContentInput.value = resp.quoted_issue || '';
  splitResponseError.textContent = '';
  splitResponseModalEl.classList.remove('hidden');
  setTimeout(() => {
    splitResponseContentInput.focus();
    splitResponseContentInput.setSelectionRange(0, 0);
  }, 60);
}

function confirmSplitResponse() {
  const content = splitResponseContentInput.value;
  const cursorPosition = splitResponseContentInput.selectionStart;

  if (cursorPosition === 0 || cursorPosition === content.length) {
    splitResponseError.textContent = 'Please place the cursor in the middle of the text to split.';
    return;
  }

  const part1 = content.slice(0, cursorPosition).trim();
  const part2 = content.slice(cursorPosition).trim();

  if (!part1 || !part2) {
    splitResponseError.textContent = 'Both split parts must contain text.';
    return;
  }

  if (pendingSplitIndex === null) return;

  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);
  const originalResp = data.responses[pendingSplitIndex];

  // Update original to part1
  originalResp.quoted_issue = part1;

  // Insert part2 as a new issue right after
  data.responses.splice(pendingSplitIndex + 1, 0, {
    title: originalResp.title ? `${originalResp.title} (Part 2)` : '',
    source: originalResp.source,
    quoted_issue: part2
  });

  syncAndResequenceResponses(data);
  state.breakdownData[state.activeReviewerIdx] = data;
  queueStateSync();
  renderBreakdownPanel();

  splitResponseModalEl.classList.add('hidden');
  pendingSplitIndex = null;
}

function cancelSplitResponse() {
  splitResponseModalEl.classList.add('hidden');
  pendingSplitIndex = null;
}

if (confirmSplitResponseBtn) {
  confirmSplitResponseBtn.addEventListener('click', confirmSplitResponse);
  cancelSplitResponseBtn.addEventListener('click', cancelSplitResponse);
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
    conference: state.currentDoc?.conference || 'ICLR',
  });
}

async function runStage2RefineOneResponse(responseId) {
  if (convertBtnEl.disabled) return;
  const data = getBreakdownDataForReviewer(state.activeReviewerIdx);
  const responses = Array.isArray(data.responses) ? data.responses : [];
  const resp = responses.find((r) => r.id === responseId);
  if (!resp) return;

  const providerKey = state.apiSettings.activeApiProvider;
  const profile = getActiveApiProfile(providerKey);
  if (!profile || !profile.apiKey) {
    alert('Please configure API Settings first.');
    return;
  }

  const stage2Map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
  const draftCell = stage2Map[resp.id] || { outline: '', draft: '', assets: [] };
  if (!`${draftCell.outline || ''}`.trim()) {
    alert('This response has no outline yet. Please write an outline first.');
    return;
  }

  convertBtnEl.disabled = true;
  convertBtnEl.classList.add('loading');
  stage2RefineProgress = { total: 1, current: 1, responseId: resp.id };
  renderBreakdownPanel();

  try {
    const refined = await window.studioApi.runStage2Refine({
      providerKey,
      profile,
      responseId: resp.id,
      title: resp.title || '',
      source: resp.source || '',
      source_id: resp.source_id || '',
      quotedIssue: resp.quoted_issue || '',
      outline: draftCell.outline || '',
      conference: state.currentDoc?.conference || 'ICLR',
    });
    draftCell.draft = refined?.draft || draftCell.draft;
    stage2Map[resp.id] = draftCell;
    state.stage2Replies[state.activeReviewerIdx] = stage2Map;
    syncStage2CompletionState();
    queueStateSync();
    renderBreakdownPanel();
    renderSidebarStages();
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

async function runStage2RefineForResponses() {
  if (convertBtnEl.disabled) return;
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
      // Skip if draft is already present
      if (`${draftCell.draft || ''}`.trim()) {
        continue;
      }

      const refined = await window.studioApi.runStage2Refine({
        providerKey,
        profile,
        responseId: resp.id,
        title: resp.title || '',
        source: resp.source || '',
        source_id: resp.source_id || '',
        quotedIssue: resp.quoted_issue || '',
        outline: draftCell.outline || '',
        conference: state.currentDoc?.conference || 'ICLR',
      });
      draftCell.draft = refined?.draft || draftCell.draft;
      stage2Map[resp.id] = draftCell;
    }
    state.stage2Replies[state.activeReviewerIdx] = stage2Map;
    syncStage2CompletionState();
    queueStateSync();
    renderBreakdownPanel();
    renderSidebarStages();
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

  // If advancing from Stage 2 to Stage 3
  if (curIdx === 1) {
    if (!isStage2FullyRefined()) {
      alert("Missing Refined Answers: Please ensure all responses have a generated or manually entered Refined Draft before proceeding.");
      return;
    }
  }

  const nextStage = STAGES[curIdx + 1];
  pendingAdvanceTarget = nextStage.label;
  stageAdvanceMsgEl.textContent = `You are currently at "${STAGES[curIdx].label}". Are you ready to advance to "${nextStage.label}"?`;
  stageAdvanceModalEl.classList.remove('hidden');
}

function confirmAdvance() {
  if (!state.currentDoc || !pendingAdvanceTarget) return;
  const nextIdx = STAGES.findIndex((s) => s.label === pendingAdvanceTarget);
  const prevStage = nextIdx > 0 ? STAGES[nextIdx - 1] : null;
  if (prevStage?.key === 'stage2') {
    syncStage2CompletionState();
  }
  state.currentDoc.currentStage = pendingAdvanceTarget;
  pendingAdvanceTarget = null;
  stageAdvanceModalEl.classList.add('hidden');
  queueStateSync();
  renderSidebarStages();
  renderBreakdownPanel();
  syncStageUi();
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
  document.getElementById('docsPanel')?.classList.add('hidden');
  document.getElementById('skillsPanel')?.classList.add('hidden');
  const hasProject = Boolean(state.currentDoc);
  workspaceEl.classList.toggle('hidden', !hasProject);
  emptyStateEl.classList.toggle('hidden', hasProject || state.pendingCreate);
  namingPanelEl.classList.toggle('hidden', !state.pendingCreate);

  if (hasProject) {
    stage4RefineRuntime = { running: false, reviewerIdx: -1 };
    stage5AutoFillRuntime = { running: false };
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
    state.stage4Data = state.currentDoc.stage4Data || {};
    state.stage5Data = state.currentDoc.stage5Data || {};
    state.stage5Settings = state.currentDoc.stage5Settings || { style: 'run' };

    restoreActiveReviewerSelection();
    renderReviewerTabs();
    renderBreakdownPanel();
    syncStageUi();

    enterProjectMode();

    // If the first reviewer has no name yet, prompt for it
    if (!state.reviewers[0].name) {
      promptReviewerName((suffix) => {
        state.reviewers[0].name = suffix;
        persistActiveReviewerSelection();
        renderReviewerTabs();
        queueStateSync();
      }, () => {
        // User cancelled — assign a fallback 4-char ID
        state.reviewers[0].name = 'R001';
        persistActiveReviewerSelection();
        renderReviewerTabs();
        queueStateSync();
      });
    }
  } else {
    hideCopyPopup();
    closeStage5TemplateModal();
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
  state.currentDoc.activeReviewerIdx = state.activeReviewerIdx;
  state.currentDoc.breakdownData = state.breakdownData;
  state.currentDoc.stage2Replies = state.stage2Replies;
  state.currentDoc.stage3Settings = state.stage3Settings;
  state.currentDoc.stage3Drafts = state.stage3Drafts;
  state.currentDoc.stage3Selection = state.stage3Selection;
  state.currentDoc.stage4Data = state.stage4Data;
  state.currentDoc.stage5Data = state.stage5Data;
  state.currentDoc.stage5Settings = state.stage5Settings;
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

function isLocalModelProfile(profile = {}) {
  const baseUrl = `${profile.baseUrl || ''}`.trim();
  if (!baseUrl) return false;
  try {
    const host = `${new URL(baseUrl).hostname || ''}`.toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host === '::1' || host.endsWith('.local');
  } catch {
    return /localhost|127\.0\.0\.1|0\.0\.0\.0|::1/i.test(baseUrl);
  }
}

function getActiveModelBadgeText() {
  const profile = getActiveApiProfile(state.apiSettings.activeApiProvider);
  if (!profile) return '';
  if (isLocalModelProfile(profile)) return 'local model';
  return `${profile.model || ''}`.trim();
}

function renderActiveModelBadge() {
  if (!activeModelBadgeEl) return;
  const text = getActiveModelBadgeText();
  activeModelBadgeEl.textContent = text;
  activeModelBadgeEl.title = text;
  activeModelBadgeEl.classList.toggle('hidden', !text);
}

function renderApiForm(providerKey = state.apiSettings.activeApiProvider) {
  const profile = getActiveApiProfile(providerKey);
  const guide = API_PROVIDER_GUIDE[providerKey] || {};
  apiProviderSelectEl.value = providerKey;
  apiBaseUrlInputEl.value = profile?.baseUrl ?? guide.baseUrl ?? '';
  apiModelInputEl.value = profile?.model ?? guide.model ?? '';
  apiInputEl.value = profile?.apiKey ?? '';
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
  renderActiveModelBadge();
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
  renderActiveModelBadge();
  closeModal('apiModal');
}


function beginProjectCreation() {
  state.pendingCreate = true;
  state.currentDoc = null;
  state.stage4Data = {};
  state.stage5Data = {};
  state.stage5Settings = { style: 'run' };
  state.selectedConference = 'ICLR';
  conferenceSelect.value = 'ICLR';
  exitProjectMode();
  renderWorkspace();
  projectNameInput.focus();
}

function selectStage(label) {
  if (!state.currentDoc) return;

  const docsPanelEl = document.getElementById('docsPanel');
  if (docsPanelEl && !docsPanelEl.classList.contains('hidden')) {
    docsPanelEl.classList.add('hidden');
    document.getElementById('workspace').classList.remove('hidden');
  }

  state.currentDoc.currentStage = label;
  queueStateSync();
  renderSidebarStages();
  renderBreakdownPanel();
  syncStageUi();
  if (currentStageKey() === 'stage5') {
    const stage5 = getStage5State();
    if (!stage5.templateConfirmed || !stage5.styleKey || !getStage5TemplateEntry(stage5.styleKey)) {
      openStage5TemplateModal();
    }
  }
}

function syncStageUi() {
  const stageKey = currentStageKey();
  const isStage2 = stageKey === 'stage2';
  const isStage3 = stageKey === 'stage3';
  const isStage4 = stageKey === 'stage4';
  const isStage5 = stageKey === 'stage5';
  const isRefineMode = isStage2 || isStage4;
  const isPreviewMode = isStage3 || isStage5;
  convertBtnEl.querySelector('.convert-label').textContent = isRefineMode ? 'Refine' : (isPreviewMode ? 'Preview' : 'Break down');

  const iconEl = convertBtnEl.querySelector('.convert-icon');
  if (isRefineMode) {
    iconEl.textContent = '⇢';
  } else if (isPreviewMode) {
    iconEl.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top:4px"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  } else {
    iconEl.textContent = '→';
  }

  const heading = document.querySelector('.breakdown-panel > .breakdown-heading');
  if (heading) {
    heading.textContent = isStage2
      ? 'Refined Draft'
      : (isStage3
        ? 'Preview'
        : (isStage4
          ? 'Final Refined Output'
          : (isStage5 ? 'Final Remarks Preview' : 'Structured Breakdown')));
  }

  // Toggle left panel: reviewer input vs outline panel
  const stage2LeftEl = document.getElementById('stage2LeftPanel');
  if (isStage2 || isStage3 || isStage4 || isStage5) {
    reviewerInput.classList.add('hidden');
    stage2LeftEl.classList.remove('hidden');
  } else {
    reviewerInput.classList.remove('hidden');
    stage2LeftEl.classList.add('hidden');
  }
  stage2LeftEl.style.overflowY = isStage3 ? 'visible' : 'auto';
  reviewerInput.setAttribute('contenteditable', (isStage2 || isStage3 || isStage4 || isStage5) ? 'false' : 'true');
  reviewerInput.classList.toggle('readonly', (isStage2 || isStage3 || isStage4 || isStage5));

  if (reviewerTabsRowEl) {
    reviewerTabsRowEl.classList.toggle('hidden', isStage5);
  }

  if (stage3AdjustStyleBtn) {
    stage3AdjustStyleBtn.classList.toggle('hidden', !(isStage3 || isStage5));
    const labelEl = stage3AdjustStyleBtn.querySelector('.convert-label');
    const iconSpan = stage3AdjustStyleBtn.querySelector('.convert-icon');
    if (isStage5) {
      if (labelEl) labelEl.textContent = 'Template';
      stage3AdjustStyleBtn.title = 'Choose template';
      stage3AdjustStyleBtn.setAttribute('aria-label', 'Choose template');
      if (iconSpan) {
        iconSpan.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="6" rx="1.5"></rect><rect x="3" y="14" width="18" height="6" rx="1.5"></rect></svg>';
      }
    } else {
      if (labelEl) labelEl.textContent = 'Style';
      stage3AdjustStyleBtn.title = 'Adjust Style';
      stage3AdjustStyleBtn.setAttribute('aria-label', 'Adjust Style');
      if (iconSpan) {
        iconSpan.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>';
      }
    }
  }
  if (stage3ThemeNoticeEl && !isStage3) {
    showStage3ThemeNotice('');
  }

  if (stage2AutoFitBtn) {
    stage2AutoFitBtn.classList.toggle('hidden', !(isStage2 || isStage5));
    const labelEl = stage2AutoFitBtn.querySelector('.convert-label');
    const iconSpan = stage2AutoFitBtn.querySelector('.convert-icon');
    if (isStage5) {
      if (labelEl) labelEl.textContent = 'Auto Fill';
      stage2AutoFitBtn.title = 'Auto fill final remarks';
      stage2AutoFitBtn.setAttribute('aria-label', 'Auto fill final remarks');
      if (iconSpan) {
        iconSpan.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';
      }
    } else {
      if (labelEl) labelEl.textContent = 'Auto Fit';
      stage2AutoFitBtn.title = 'Auto fit heights';
      stage2AutoFitBtn.setAttribute('aria-label', 'Auto fit heights');
      if (iconSpan) {
        iconSpan.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>';
      }
    }
  }
  if (convertColumnEl) {
    convertColumnEl.classList.remove('hidden');
  }
  workspaceEl.classList.remove('stage4-two-col');
  if (!isStage4) {
    hideCopyPopup();
  }
}

/* ────────────────────────────────────────────────────────────
   Init
   ──────────────────────────────────────────────────────────── */
async function init() {
  loadTheme();
  await loadTemplateLibrary();
  await loadStage3StyleLibrary();
  await loadStage5StyleLibrary();
  await loadStage5SampleTemplate();
  state.appSettings = await window.studioApi.getAppSettings();
  state.apiSettings = await window.studioApi.getApiSettings();
  renderActiveModelBadge();
  autosaveInput.value = state.appSettings.defaultAutosaveIntervalSeconds;
  await loadProjects();
  renderWorkspace();
  syncStageUi();
}

/* ────────────────────────────────────────────────────────────
   Event listeners
   ──────────────────────────────────────────────────────────── */
// New Project (Global Sidebar handling or Delegate)
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-new-project-open]')) {
    beginProjectCreation();
  }
});

document.getElementById('sortProjectsBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const popup = document.getElementById('sortProjectsPopup');
  if (popup) {
    popup.classList.toggle('hidden');
  }
});

// Hide sort popup when clicking outside
document.addEventListener('click', (e) => {
  const popup = document.getElementById('sortProjectsPopup');
  if (popup && !popup.classList.contains('hidden') && !e.target.closest('#sortProjectsBtn')) {
    popup.classList.add('hidden');
  }
});

document.querySelectorAll('.sort-popup-item').forEach(btn => {
  btn.addEventListener('click', (e) => {
    state.projectSortMode = e.target.dataset.sort;
    renderProjectList();
    document.getElementById('sortProjectsPopup')?.classList.add('hidden');
  });
});


// Documentation buttons
document.getElementById('openDocsExternalBtn')?.addEventListener('click', async () => {
  const url = new URL('../../documents/en/README.md', window.location.href);
  const absPath = decodeURIComponent(url.pathname);
  await window.studioApi.openPath(absPath);
});

document.getElementById('openDocsReaderBtn')?.addEventListener('click', () => {
  renderDocsPanel(DOCS_FILES[0].path);
});

document.getElementById('docsFileSelect')?.addEventListener('change', (e) => {
  renderDocsPanel(e.target.value);
});

document.getElementById('docsCloseBtn')?.addEventListener('click', () => {
  document.getElementById('docsPanel').classList.add('hidden');
  renderWorkspace();
});

// Skills nav button
document.getElementById('skillsNavBtn')?.addEventListener('click', () => {
  renderSkillsPanel();
});

// Skills panel: click skill card or propose button (event delegation)
document.getElementById('skillsGrid')?.addEventListener('click', async (e) => {
  const card = e.target.closest('[data-skill-path]');
  if (card) {
    await openSkillModal(card.dataset.skillPath, card.dataset.skillLabel);
    return;
  }
  const propose = e.target.closest('[data-propose]');
  if (propose) {
    await window.studioApi.openExternal(GITHUB_PR_URL);
  }
});

// Skill modal close button
document.getElementById('skillModalCloseBtn')?.addEventListener('click', closeSkillModal);

// Skill modal backdrop click to close
document.getElementById('skillModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('skillModal')) closeSkillModal();
});

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
  state.stage4Data = {};
  state.stage5Data = {};
  state.stage5Settings = { style: 'run' };
  hideCopyPopup();
  closeStage5TemplateModal();
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

searchProjectsToggleBtn.addEventListener('click', () => {
  projectSearchContainer.classList.toggle('hidden');
  if (!projectSearchContainer.classList.contains('hidden')) {
    projectSearchEl.focus();
  } else {
    projectSearchEl.value = '';
    renderProjectList();
  }
});

// Project list click (main sidebar)
projectListEl.addEventListener('click', (e) => {
  const exportBtn = e.target.closest('.project-export-btn');
  if (exportBtn) {
    const folder = exportBtn.dataset.exportFolder;
    showExportPopup(exportBtn, folder);
    return;
  }
  const btn = e.target.closest('[data-folder]');
  if (btn) openProject(btn.dataset.folder);
});

// Project list click (drawer)
drawerProjectListEl.addEventListener('click', (e) => {
  const exportBtn = e.target.closest('.project-export-btn');
  if (exportBtn) {
    const folder = exportBtn.dataset.exportFolder;
    showExportPopup(exportBtn, folder);
    return;
  }
  const btn = e.target.closest('[data-folder]');
  if (btn) openProject(btn.dataset.folder);
});

// Stage selection from sidebar
sidebarStageListEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-stage]');
  const templateBtn = e.target.closest('[data-template-open]');
  const docsBtn = e.target.closest('[data-docs-open]');

  if (templateBtn) {
    openTemplateModal();
    return;
  }
  if (docsBtn) {
    const docIdx = parseInt(docsBtn.dataset.docsOpen, 10);
    if (DOCS_FILES[docIdx]) {
      renderDocsPanel(DOCS_FILES[docIdx].path);
    }
    return;
  }
  if (!btn || btn.disabled) return;
  selectStage(btn.dataset.stage);
});

// Drawer toggle
drawerToggleEl.addEventListener('click', toggleDrawer);

// Export Popup Logic
function showExportPopup(btn, folder) {
  exportTargetFolder = folder;
  exportProjectPopup.classList.remove('hidden');

  const rect = btn.getBoundingClientRect();
  const popupRect = exportProjectPopup.getBoundingClientRect();

  // Align right edge of popup with right edge of button
  let left = rect.right - popupRect.width;
  let top = rect.bottom + 5;

  // Stay within sidebar if sidebar reference is available
  const sidebarRect = sidebarEl?.getBoundingClientRect();
  if (sidebarRect && left < sidebarRect.left + 5) left = sidebarRect.left + 5;

  if (top + popupRect.height > window.innerHeight) {
    top = rect.top - popupRect.height - 5;
  }

  exportProjectPopup.style.position = 'fixed';
  exportProjectPopup.style.top = `${top}px`;
  exportProjectPopup.style.left = `${left}px`;
  exportProjectPopup.style.zIndex = '10000';
}

function hideExportPopup() {
  exportProjectPopup.classList.add('hidden');
  exportTargetFolder = null;
}

// Global click to close popups
document.addEventListener('click', (e) => {
  if (!e.target.closest('.project-export-btn') && !e.target.closest('#exportProjectPopup')) {
    hideExportPopup();
  }
  if (!e.target.closest('#sortProjectsBtn') && !e.target.closest('#sortProjectsPopup')) {
    const popup = document.getElementById('sortProjectsPopup');
    if (popup) popup.classList.add('hidden');
  }
});

exportProjectPopup.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-export-type]');
  if (!btn) return;
  const type = btn.dataset.exportType;
  const folder = exportTargetFolder;
  hideExportPopup();
  await handleProjectExport(type, folder);
});

async function handleProjectExport(format, folder) {
  if (!folder) return;

  try {
    console.log(`Starting export: ${folder} as ${format}`);
    let doc;
    if (state.currentDoc && state.currentFolderName === folder) {
      doc = state.currentDoc;
    } else {
      const res = await window.studioApi.openProject(folder);
      doc = res.doc;
    }

    if (!doc) throw new Error('Project data could not be loaded.');

    const { markdown, html } = compileFirstRoundForExport(doc);
    const exportRes = await window.studioApi.exportFirstRound({
      folderName: folder,
      format,
      markdown,
      htmlStr: html
    });

    if (exportRes && exportRes.success) {
      console.log('Export success');
      alert('Project exported successfully!');
    }
  } catch (err) {
    console.error('Export failed:', err);
    alert(`Export failed: ${err.message}`);
  }
}

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
    renderStage3Preview();
    return;
  }
  if (currentStageKey() === 'stage4') {
    runStage4RefinePipeline();
    return;
  }
  if (currentStageKey() === 'stage5') {
    renderStage5Preview();
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
  const stage4CopyBtn = e.target.closest('[data-stage4-copy-refined]');
  if (stage4CopyBtn) {
    const stage4 = getStage4StateForReviewer(state.activeReviewerIdx);
    copyText(stage4.refinedText || '');
    return;
  }
  const stage5ToggleBtn = e.target.closest('[data-stage5-toggle-sample]');
  if (stage5ToggleBtn) {
    const stage5 = getStage5State();
    stage5.previewMode = stage5.previewMode === 'sample' ? 'project' : 'sample';
    queueStateSync();
    renderStage5Panels();
    return;
  }

  const refineOneBtn = e.target.closest('[data-stage2-refine-one]');
  if (refineOneBtn) {
    runStage2RefineOneResponse(refineOneBtn.dataset.stage2RefineOne);
    return;
  }

  const insertBtn = e.target.closest('.insert-response-btn');
  if (insertBtn) {
    promptAddResponse(Number(insertBtn.dataset.insertIndex));
    return;
  }
  const splitBtn = e.target.closest('.split-response-btn');
  if (splitBtn) {
    promptSplitResponse(Number(splitBtn.dataset.splitIndex));
    return;
  }
});

breakdownContentEl.addEventListener('input', (e) => {
  if (e.target.classList.contains('response-quoted-issue') || e.target.classList.contains('response-textarea')) {
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
    syncStage2CompletionState();
    queueStateSync();
    if (stage2Field === 'draft') renderSidebarStages();
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
  if (e.target.classList.contains('response-textarea')) {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }

  const stage2Field = e.target?.dataset?.stage2Field;
  const stage2ResponseId = e.target?.dataset?.responseId;
  const stage3Field = e.target?.dataset?.stage3Field;
  const stage3ResponseId = e.target?.dataset?.responseId;
  const stage4Field = e.target?.dataset?.stage4Field;
  const stage5Field = e.target?.dataset?.stage5Field;
  const stage5RatingReviewerId = e.target?.dataset?.stage5Rating;
  if (stage3Field && stage3ResponseId) {
    const draft = getStage3DraftForResponse(stage3ResponseId);
    draft[stage3Field] = e.target.value;
    if (stage3Field === 'markdownSource') {
      updateStage3CharCounter(draft.markdownSource);
    }
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
    syncStage2CompletionState();
    queueStateSync();
    if (stage2Field === 'draft') {
      renderSidebarStages();
    }
    return;
  }
  if (stage4Field === 'draft') {
    const stage4 = getStage4StateForReviewer(state.activeReviewerIdx);
    stage4.draft = e.target.value;
    persistStage4DraftToStorage(getReviewerId(state.activeReviewerIdx), stage4.draft);
    queueStateSync();
    return;
  }
  if (stage4Field === 'followupQuestion') {
    const stage4 = getStage4StateForReviewer(state.activeReviewerIdx);
    stage4.followupQuestion = e.target.value;
    queueStateSync();
    return;
  }
  if (stage5Field === 'source') {
    const stage5 = getStage5State();
    stage5.source = e.target.value;
    stage5.previewMode = 'project';
    fitStage5SourceEditorHeight();
    queueStateSync();
    return;
  }
  if (stage5RatingReviewerId) {
    const stage5 = getStage5State();
    stage5.finalRatings[stage5RatingReviewerId] = e.target.value;
    queueStateSync();
  }
});

// Right-click context menu on stage2 left panel outline textareas
stage2LeftPanelEl.addEventListener('contextmenu', (e) => {
  const target = e.target;
  if (target?.dataset?.stage2Field === 'outline') {
    // When text is selected, show Writing Anti-AI instead of insert menu
    if (target.selectionStart !== target.selectionEnd) {
      showAntiAIMenu(e, target);
      return;
    }
    e.preventDefault();
    const responseId = target.dataset.responseId;
    stage2OutlineContext = { responseId, x: e.clientX, y: e.clientY };
    const menu = ensureStage2ContextMenu();
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    menu.classList.remove('hidden');
    hideStage3SourceMenu();
    hideAntiAIMenu();
    return;
  }

  if (target?.dataset?.stage3Field === 'markdownSource') {
    // When text is selected, show Writing Anti-AI instead of formatting menu
    if (target.selectionStart !== target.selectionEnd) {
      showAntiAIMenu(e, target);
      return;
    }
    e.preventDefault();
    const responseId = target.dataset.responseId;
    stage3SourceContext = {
      responseId,
      x: e.clientX,
      y: e.clientY,
      start: target.selectionStart || 0,
      end: target.selectionEnd || 0,
    };
    const menu = ensureStage3SourceMenu();
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    menu.classList.remove('hidden');
    hideStage2ContextMenu();
    hideAntiAIMenu();
  }
});

breakdownContentEl.addEventListener('contextmenu', (e) => {
  const outlineEl = e.target.closest('textarea[data-stage2-field="outline"]');
  if (!outlineEl) return;
  // When text is selected, show Writing Anti-AI instead of insert menu
  if (outlineEl.selectionStart !== outlineEl.selectionEnd) {
    showAntiAIMenu(e, outlineEl);
    return;
  }
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
  hideAntiAIMenu();
});

// Global contextmenu handler for Writing Anti-AI on any editable element with a selection
document.addEventListener('contextmenu', (e) => {
  const target = e.target;

  // Determine whether right-click is inside an editable element
  const isTextarea = target.tagName === 'TEXTAREA' && !target.readOnly && !target.disabled;
  const contentEditableEl = !isTextarea ? target.closest('[contenteditable="true"]') : null;

  if (isTextarea) {
    if (target.selectionStart === target.selectionEnd) return; // no selection
    // Stage2/Stage3 textareas with selection are already handled above — let those handlers call showAntiAIMenu
    // For all other textareas (stage4, stage5, modal textareas, reviewerInput-style textareas) handle here
    const alreadyHandled = target.dataset.stage2Field === 'outline' || target.dataset.stage3Field === 'markdownSource';
    if (alreadyHandled) return;
    showAntiAIMenu(e, target);
  } else if (contentEditableEl) {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) return;
    showAntiAIMenu(e, contentEditableEl);
  }
});

document.addEventListener('click', (e) => {
  // Dismiss Anti-AI menu on any outside click
  if (!e.target.closest('#writingAntiAIMenu')) {
    hideAntiAIMenu();
  }

  const stage3Fmt = e.target.closest('[data-stage3-format]');
  if (stage3Fmt) {
    const action = stage3Fmt.dataset.stage3Format;
    hideStage3SourceMenu();
    if (action) applyStage3SourceFormat(action);
    hideStage2ContextMenu();
    return;
  }

  const option = e.target.closest('[data-outline-insert]');
  if (!option) {
    hideStage2ContextMenu();
    hideStage3SourceMenu();
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const skillModalEl = document.getElementById('skillModal');
    if (skillModalEl && !skillModalEl.classList.contains('hidden')) {
      closeSkillModal();
      return;
    }
    hideStage2ContextMenu();
    hideStage3SourceMenu();
    hideAntiAIMenu();
    hideAntiAIToast();
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
      renderStage3Palette(color);
    } else {
      renderStage3Palette('custom');
      stage3CustomHexInputEl.focus();
    }
  });

  stage3CustomHexInputEl.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    let isCustom = true;
    document.querySelectorAll('.stage3-color-dot').forEach(btn => {
      if (normalizeHexColor(btn.dataset.stage3Color) === normalizeHexColor(val) && normalizeHexColor(val) !== '') {
        btn.classList.add('active');
        isCustom = false;
      } else {
        btn.classList.remove('active');
      }
    });
    const customBtn = stage3PresetColorsEl.querySelector('.stage3-color-custom');
    if (customBtn) {
      if (isCustom) customBtn.classList.add('active');
      else customBtn.classList.remove('active');
    }
  });
  stage3StyleConfirmBtnEl.addEventListener('click', applyStage3StyleSettings);

  stage2LeftPanelEl.addEventListener('click', (e) => {
    const breakdownOpenBtn = e.target.closest('[data-stage3-breakdown-open]');
    if (breakdownOpenBtn) {
      openStage3BreakdownModal();
      return;
    }
    const btn = e.target.closest('[data-stage3-response]');
    if (!btn) return;
    state.stage3Selection[state.activeReviewerIdx] = btn.dataset.stage3Response;
    queueStateSync();
    renderStage3Panels();
  });
}

if (stage3AdjustStyleBtn) {
  stage3AdjustStyleBtn.addEventListener('click', () => {
    if (currentStageKey() === 'stage5') {
      openStage5TemplateModal();
      return;
    }
    openStage3StyleModal();
  });
}

if (stage2AutoFitBtn) {
  stage2AutoFitBtn.addEventListener('click', () => {
    if (currentStageKey() === 'stage5') {
      runStage5AutoFillPipeline();
      return;
    }
    document.querySelectorAll('.response-quoted-issue, .response-textarea').forEach(el => {
      el.style.height = 'auto';
      if (el.scrollHeight > 0) el.style.height = el.scrollHeight + 'px';
    });
  });
}

if (stage5TemplateApplyBtnEl) {
  stage5TemplateApplyBtnEl.addEventListener('click', applyStage5TemplateSelection);
}

if (stage5TemplateCancelBtnEl) {
  stage5TemplateCancelBtnEl.addEventListener('click', closeStage5TemplateModal);
}

if (stage3BreakdownCancelBtnEl) {
  stage3BreakdownCancelBtnEl.addEventListener('click', closeStage3BreakdownModal);
}

if (stage3BreakdownConfirmBtnEl) {
  stage3BreakdownConfirmBtnEl.addEventListener('click', confirmStage3Breakdown);
}

if (stage3BreakdownLengthInputEl) {
  stage3BreakdownLengthInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmStage3Breakdown();
    if (e.key === 'Escape') closeStage3BreakdownModal();
  });
}

if (stage3BreakdownResultCloseBtnEl) {
  stage3BreakdownResultCloseBtnEl.addEventListener('click', closeStage3BreakdownResultModal);
}

if (stage3BreakdownResultBodyEl) {
  stage3BreakdownResultBodyEl.addEventListener('click', async (e) => {
    const copyBtn = e.target.closest('[data-stage3-copy-part]');
    if (!copyBtn) return;
    const idx = Number(copyBtn.dataset.stage3CopyPart);
    const part = stage3BreakdownPartsCache[idx];
    if (!part) return;
    const reviewerId = getCurrentReviewerIdentifier();
    const total = stage3BreakdownPartsCache.length;
    const subject = `Author Response to Reviewer ${reviewerId} (Part ${idx + 1}/${total})`;
    await copyText(`Subject: ${subject}\n\nContent:\n${part.text}`);
  });
}

if (stage4CopyPopupCopyBtnEl) {
  stage4CopyPopupCopyBtnEl.addEventListener('click', async () => {
    const text = stage4CopyPopupEl?.dataset?.copyText || '';
    await copyText(text);
  });
}

if (stage4CopyPopupCloseBtnEl) {
  stage4CopyPopupCloseBtnEl.addEventListener('click', hideCopyPopup);
}

window.addEventListener('resize', () => {
  autoExpandStage3Editor();
  fitStage5SourceEditorHeight();
});

init();
