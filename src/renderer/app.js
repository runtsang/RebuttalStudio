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
  reviewers: [{ id: 0, name: '', content: '' }],
  activeReviewerIdx: 0,
  drawerOpen: false,
  // Breakdown data per reviewer
  breakdownData: {},
  stage2Replies: {},
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
    breakdownContentEl.innerHTML = renderStage2Panel(data);
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
      <span class="score-label">${s.label}</span>
      <span class="score-value" contenteditable="true" data-score-edit="${s.key}">${escapeHTML(val)}</span>
    </div>`;
  });
  scoresHTML += '</div>';
  scoresHTML += '</div>';

  let blocksHTML = '';
  tpl.blocks.forEach(blockIdxs => {
    blocksHTML += '<div class="breakdown-block">';
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
}

function renderStage2Panel(data) {
  const responses = Array.isArray(data.responses) ? data.responses : [];
  const stage2Map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
  if (!responses.length) {
    return `<div class="breakdown-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Replied</h4><p class="breakdown-placeholder">No responses found in Stage1. Please run Breakdown first.</p></div></div>`;
  }

  const cards = responses.map((resp, idx) => {
    const item = stage2Map[resp.id] || { outline: '', draft: '', assets: [] };
    const assets = (item.assets || []).map((asset, assetIdx) => `<div class="response-asset-item"><span>${escapeHTML(asset.type.toUpperCase())} ${assetIdx + 1}</span><button class="asset-insert-btn" data-asset-insert="${escapeHTML(resp.id)}" data-asset-index="${assetIdx}">Insert</button></div>`).join('');
    return `<div class="response-card stage2-response-card" data-response-id="${escapeHTML(resp.id)}">
      <div class="response-header">Response${idx + 1}</div>
      <div class="fixed-issue-meta">
        <div><strong>${escapeHTML(resp.source_id || `weakness${idx + 1}`)}</strong> · ${escapeHTML(resp.title || '')}</div>
        <div class="fixed-issue-quote">${escapeHTML(resp.quoted_issue || '')}</div>
      </div>
      <label>Outline</label>
      <textarea class="response-textarea" data-stage2-field="outline" data-response-id="${escapeHTML(resp.id)}" placeholder="Input a response outline for this issue (key points, evidence, and writing strategy).">${escapeHTML(item.outline || '')}</textarea>
      <div class="stage2-tools-row">
        <button class="btn mini" data-stage2-insert-table="${escapeHTML(resp.id)}">Insert Table</button>
        <button class="btn mini" data-stage2-insert-formula="${escapeHTML(resp.id)}">Insert Formula</button>
      </div>
      <div class="stage2-assets">${assets || '<span class="muted">No snippet inserted yet.</span>'}</div>
      <label>Refined Draft</label>
      <textarea class="response-textarea" data-stage2-field="draft" data-response-id="${escapeHTML(resp.id)}" placeholder="Refined academic reply will appear here.">${escapeHTML(item.draft || '')}</textarea>
    </div>`;
  }).join('');

  return `<div class="breakdown-block breakdown-output-block"><div class="breakdown-section"><h4 class="breakdown-section-title">Replied</h4><div class="responses-grid">${cards}</div></div></div>`;
}
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


function renderAtomicIssuesAndResponses(issues, responses) {
  const issueItems = issues.map((issue) => `
    <div class="issue-card" data-issue-id="${escapeHTML(issue.id)}">
      <div class="issue-id">${escapeHTML(issue.id)}</div>
      <div class="issue-text" contenteditable="true" data-issue-edit="${escapeHTML(issue.id)}">${escapeHTML(issue.text)}</div>
    </div>`).join('');

  const responseItems = responses.map((resp) => `
    <div class="response-card" data-response-id="${escapeHTML(resp.id)}">
      <div class="response-header">${escapeHTML(resp.id)} · ${escapeHTML(resp.title || '')}</div>
      <label>Source</label>
      <input class="response-input" data-response-field="source" data-response-id="${escapeHTML(resp.id)}" value="${escapeHTML(resp.source || '')}" />
      <label>Source ID</label>
      <input class="response-input" data-response-field="source_id" data-response-id="${escapeHTML(resp.id)}" value="${escapeHTML(resp.source_id || '')}" />
      <label>Quoted Issue</label>
      <textarea class="response-textarea" data-response-field="quoted_issue" data-response-id="${escapeHTML(resp.id)}">${escapeHTML(resp.quoted_issue || '')}</textarea>
    </div>`).join('');

  return `<div class="breakdown-block breakdown-output-block">
    <div class="breakdown-section">
      <h4 class="breakdown-section-title">Atomic Issues (API Output)</h4>
      <div class="issues-grid">${issueItems || '<p class="breakdown-placeholder">No issues extracted.</p>'}</div>
    </div>
    <div class="breakdown-section">
      <h4 class="breakdown-section-title">Responses (Editable Check)</h4>
      <div class="responses-grid">${responseItems || '<p class="breakdown-placeholder">No responses generated.</p>'}</div>
    </div>
  </div>`;
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
    for (const resp of responses) {
      const draftCell = stage2Map[resp.id] || { outline: '', draft: '', assets: [] };
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
    convertBtnEl.disabled = false;
    convertBtnEl.classList.remove('loading');
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
  convertBtnEl.querySelector('.convert-label').textContent = isStage2 ? 'Refine' : 'Break down';
  convertBtnEl.querySelector('.convert-icon').textContent = isStage2 ? '⇢' : '→';
  const heading = document.querySelector('.breakdown-heading');
  if (heading) {
    heading.textContent = isStage2 ? 'Replied' : 'Structured Breakdown';
  }
  reviewerInput.setAttribute('contenteditable', isStage2 ? 'false' : 'true');
  reviewerInput.classList.toggle('readonly', isStage2);
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


breakdownContentEl.addEventListener('input', (e) => {
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


breakdownContentEl.addEventListener('click', (e) => {
  const tableFor = e.target?.dataset?.stage2InsertTable;
  if (tableFor) {
    const rows = Number(prompt('Rows?', '3') || 3);
    const cols = Number(prompt('Columns?', '3') || 3);
    if (!rows || !cols) return;
    const header = `| ${Array.from({ length: cols }).map((_, i) => `H${i + 1}`).join(' | ')} |`;
    const divider = `| ${Array.from({ length: cols }).map(() => '---').join(' | ')} |`;
    const body = Array.from({ length: rows - 1 })
      .map(() => `| ${Array.from({ length: cols }).map(() => ' ').join(' | ')} |`)
      .join('\n');
    const tableMd = `${header}\n${divider}${body ? `\n${body}` : ''}`;
    const map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
    map[tableFor].assets.push({ type: 'table', content: tableMd });
    state.stage2Replies[state.activeReviewerIdx] = map;
    queueStateSync();
    renderBreakdownPanel();
    return;
  }

  const formulaFor = e.target?.dataset?.stage2InsertFormula;
  if (formulaFor) {
    const formula = prompt('Paste OpenReview formula (LaTeX), e.g. $$E=mc^2$$', '$$E=mc^2$$');
    if (!formula) return;
    const map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
    map[formulaFor].assets.push({ type: 'formula', content: formula });
    state.stage2Replies[state.activeReviewerIdx] = map;
    queueStateSync();
    renderBreakdownPanel();
    return;
  }

  const assetInsert = e.target?.dataset?.assetInsert;
  const assetIndex = Number(e.target?.dataset?.assetIndex);
  if (assetInsert && Number.isInteger(assetIndex)) {
    const map = getStage2ResponsesForReviewer(state.activeReviewerIdx);
    const asset = map[assetInsert]?.assets?.[assetIndex];
    if (!asset) return;
    const cur = map[assetInsert].outline || '';
    map[assetInsert].outline = `${cur}${cur ? '\n\n' : ''}${asset.content}`;
    state.stage2Replies[state.activeReviewerIdx] = map;
    queueStateSync();
    renderBreakdownPanel();
  }
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

init();
