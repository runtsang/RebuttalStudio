/* ────────────────────────────────────────────────────────────
   DOM Map — CSS selector → i18n key mapping

   This file maps existing HTML elements to translation keys
   using CSS selectors, so index.html stays untouched.

   Each entry: { selector, key, prop }
     prop: 'text' | 'placeholder' | 'title' | 'aria-label' | 'html' | 'data-placeholder'
   ──────────────────────────────────────────────────────────── */

window.I18N_DOM_MAP = [

  /* ── Sidebar: Project mode ───────────────────────────────── */
  // "New Projects" button
  { selector: '[data-new-project-open] > span:last-child', key: 'nav.newProjects', prop: 'text' },
  // "Document" button
  { selector: '#openDocsReaderBtn > span', key: 'nav.document', prop: 'text' },
  // "Skills" button
  { selector: '#skillsNavBtn > span', key: 'nav.skills', prop: 'text' },
  // "Projects" title (sidebar project mode)
  { selector: '#sidebarProjects .sidebar-section-header .sidebar-title', key: 'nav.projects', prop: 'text' },
  // "Projects" title (drawer)
  { selector: '.drawer-panel .sidebar-title', key: 'nav.projects', prop: 'text' },
  // Settings button (project mode)
  { selector: '#settingsBtn > span', key: 'nav.settings', prop: 'text' },
  // Search projects input
  { selector: '#projectSearch', key: 'nav.searchProjects', prop: 'placeholder' },

  // Sort popup
  { selector: '#sortProjectsPopup .sort-popup-section:first-child', key: 'sort.alphabetical', prop: 'text' },
  { selector: '[data-sort="az"]', key: 'sort.az', prop: 'text' },
  { selector: '[data-sort="za"]', key: 'sort.za', prop: 'text' },
  { selector: '#sortProjectsPopup .sort-popup-section:nth-child(4)', key: 'sort.creationTime', prop: 'text' },
  { selector: '[data-sort="date-desc"]', key: 'sort.newestFirst', prop: 'text' },
  { selector: '[data-sort="date-asc"]', key: 'sort.oldestFirst', prop: 'text' },

  /* ── Sidebar: Stage mode ─────────────────────────────────── */
  { selector: '.stages-header .sidebar-title', key: 'nav.stages', prop: 'text' },
  { selector: '#nextStageBtn', key: 'nav.nextStage', prop: 'text' },
  { selector: '#settingsBtnStage > span', key: 'nav.settings', prop: 'text' },

  /* ── Sidebar: Dynamic stage list (rendered by app.js renderSidebarStages) ── */
  // Stage titles
  { selector: '[data-stage-key="stage1"] .sidebar-stage-title', key: 'stage.breakdown', prop: 'text' },
  { selector: '[data-stage-key="stage2"] .sidebar-stage-title', key: 'stage.reply', prop: 'text' },
  { selector: '[data-stage-key="stage3"] .sidebar-stage-title', key: 'stage.firstRound', prop: 'text' },
  { selector: '[data-stage-key="stage4"] .sidebar-stage-title', key: 'stage.multiRounds', prop: 'text' },
  { selector: '[data-stage-key="stage5"] .sidebar-stage-title', key: 'stage.finalRemarks', prop: 'text' },
  // Stage descriptions
  { selector: '[data-stage-key="stage1"] .sidebar-stage-desc', key: 'stage.breakdownDesc', prop: 'text' },
  { selector: '[data-stage-key="stage2"] .sidebar-stage-desc', key: 'stage.replyDesc', prop: 'text' },
  { selector: '[data-stage-key="stage3"] .sidebar-stage-desc', key: 'stage.firstRoundDesc', prop: 'text' },
  { selector: '[data-stage-key="stage4"] .sidebar-stage-desc', key: 'stage.multiRoundsDesc', prop: 'text' },
  { selector: '[data-stage-key="stage5"] .sidebar-stage-desc', key: 'stage.finalRemarksDesc', prop: 'text' },
  // Document Memory trigger
  { selector: '.sidebar-memory-trigger .sidebar-memory-text', key: 'docMemory.sidebarLabel', prop: 'text' },
  // Documents trigger
  { selector: '[data-docs-open] .sidebar-template-text', key: 'docMemory.sidebarDocuments', prop: 'text' },
  // Template trigger
  { selector: '[data-template-open] .sidebar-template-text', key: 'docMemory.sidebarTemplate', prop: 'text' },

  /* ── Topbar ──────────────────────────────────────────────── */
  { selector: '#apiOpenBtn', key: 'topbar.apiSettings', prop: 'text' },
  { selector: '#undoBtn', key: 'topbar.undo', prop: 'title' },
  { selector: '#redoBtn', key: 'topbar.redo', prop: 'title' },
  { selector: '#tokenUsageBadge', key: 'topbar.tokenUsage', prop: 'title' },

  /* ── Create New Project panel ────────────────────────────── */
  { selector: '#namingPanel > h3', key: 'create.title', prop: 'text' },
  { selector: 'label[for="projectNameInput"]', key: 'create.projectName', prop: 'text' },
  { selector: '#projectNameInput', key: 'create.projectNamePlaceholder', prop: 'placeholder' },
  { selector: 'label[for="conferenceSelect"]', key: 'create.conference', prop: 'text' },
  { selector: '#namingPanel .create-form-group:nth-child(3) > label', key: 'create.documentMemory', prop: 'text' },
  { selector: '#projectDocumentPickBtn', key: 'create.chooseDocument', prop: 'text' },
  { selector: '#projectDocumentClearBtn', key: 'create.clear', prop: 'text' },
  { selector: '#projectDocumentSelected', key: 'create.noDocument', prop: 'text' },
  { selector: '.document-memory-helper-intro', key: 'create.documentHelperIntro', prop: 'text' },
  { selector: '.document-memory-helper-list li:nth-child(1)', key: 'create.documentHelperTip1', prop: 'text' },
  { selector: '.document-memory-helper-list li:nth-child(2)', key: 'create.documentHelperTip2', prop: 'text' },
  { selector: '.document-memory-helper-list li:nth-child(3)', key: 'create.documentHelperTip3', prop: 'text' },
  { selector: '.document-memory-helper-list li:nth-child(4)', key: 'create.documentHelperTip4', prop: 'text' },
  { selector: '.document-memory-helper-footnote', key: 'create.documentHelperFootnote', prop: 'text' },
  { selector: '#cancelProjectBtn', key: 'create.cancel', prop: 'text' },
  { selector: '#confirmProjectBtn', key: 'create.createProject', prop: 'text' },

  /* ── Workspace: Convert buttons ──────────────────────────── */
  { selector: '#convertBtn .convert-label', key: 'workspace.breakDown', prop: 'text' },
  { selector: '#convertBtn', key: 'workspace.convertToBreakdown', prop: 'title' },
  { selector: '#stage3AdjustStyleBtn .convert-label', key: 'workspace.style', prop: 'text' },
  { selector: '#stage2DirectTransferBtn .convert-label', key: 'workspace.transfer', prop: 'text' },
  { selector: '#stage2AutoFitBtn .convert-label', key: 'workspace.autoFit', prop: 'text' },

  /* ── Workspace: Breakdown panel ──────────────────────────── */
  { selector: '.breakdown-heading', key: 'workspace.structuredBreakdown', prop: 'text' },
  { selector: '#reviewerInput', key: 'workspace.reviewerInputPlaceholder', prop: 'data-placeholder' },

  /* ── Breakdown scores (dynamic, rendered by app.js renderBreakdownPanel) ── */
  // Uses data-score-key attribute which app.js always renders
  // ICLR scores
  { selector: '[data-score-key="rating"] .score-label', key: 'score.rating', prop: 'text' },
  { selector: '[data-score-key="confidence"] .score-label', key: 'score.confidence', prop: 'text' },
  // ICLR metrics
  { selector: '[data-score-key="soundness"] .score-label', key: 'score.soundness', prop: 'text' },
  { selector: '[data-score-key="presentation"] .score-label', key: 'score.presentation', prop: 'text' },
  { selector: '[data-score-key="contribution"] .score-label', key: 'score.contribution', prop: 'text' },
  // ICML extra metrics
  { selector: '[data-score-key="significance"] .score-label', key: 'score.significance', prop: 'text' },
  { selector: '[data-score-key="originality"] .score-label', key: 'score.originality', prop: 'text' },
  // NeurIPS extra metrics
  { selector: '[data-score-key="quality"] .score-label', key: 'score.quality', prop: 'text' },
  { selector: '[data-score-key="clarity"] .score-label', key: 'score.clarity', prop: 'text' },
  // ARR scores
  { selector: '[data-score-key="assessment"] .score-label', key: 'score.assessment', prop: 'text' },
  { selector: '[data-score-key="excitement"] .score-label', key: 'score.excitement', prop: 'text' },
  { selector: '[data-score-key="reproducibility"] .score-label', key: 'score.reproducibility', prop: 'text' },

  /* ── Breakdown section titles (dynamic, rendered by app.js) ── */
  // Uses section_<key> id which app.js always renders
  { selector: '#section_summary .breakdown-section-title, [id="section_summary"]', key: 'section.summaryPlaceholder', prop: 'data-placeholder' },
  { selector: '#section_strength .breakdown-section-title, [id="section_strength"]', key: 'section.strengthPlaceholder', prop: 'data-placeholder' },
  { selector: '#section_weakness .breakdown-section-title, [id="section_weakness"]', key: 'section.weaknessPlaceholder', prop: 'data-placeholder' },
  { selector: '#section_questions .breakdown-section-title, [id="section_questions"]', key: 'section.questionsPlaceholder', prop: 'data-placeholder' },
  { selector: '#section_suggestion .breakdown-section-title, [id="section_suggestion"]', key: 'section.suggestionPlaceholder', prop: 'data-placeholder' },
  // Section heading h4 titles (dynamic parent of breakdown-section-body)
  { selector: '#section_summary', key: 'section.summary', prop: 'title' },
  { selector: '#section_strength', key: 'section.strength', prop: 'title' },

  /* ── Breakdown sections (static HTML fallback) ──────────── */
  { selector: '#sectionSummary .breakdown-placeholder', key: 'section.summaryPlaceholder', prop: 'text' },
  { selector: '#sectionStrength .breakdown-placeholder', key: 'section.strengthPlaceholder', prop: 'text' },
  { selector: '#sectionWeakness .breakdown-placeholder', key: 'section.weaknessPlaceholder', prop: 'text' },
  { selector: '#sectionQuestions .breakdown-placeholder', key: 'section.questionsPlaceholder', prop: 'text' },

  /* ── Dynamic breakdown section titles (h4 elements) ─────── */
  { selector: '.breakdown-section:has(#section_summary) .breakdown-section-title', key: 'section.summary', prop: 'text' },
  { selector: '.breakdown-section:has(#section_strength) .breakdown-section-title', key: 'section.strength', prop: 'text' },
  { selector: '.breakdown-section:has(#section_weakness) .breakdown-section-title', key: 'section.weakness', prop: 'text' },
  { selector: '.breakdown-section:has(#section_questions) .breakdown-section-title', key: 'section.questions', prop: 'text' },
  { selector: '.breakdown-section:has(#section_suggestion) .breakdown-section-title', key: 'section.suggestion', prop: 'text' },

  /* ── Skills panel ────────────────────────────────────────── */
  { selector: '.skills-panel-title', key: 'skills.title', prop: 'text' },
  { selector: '.skills-panel-subtitle', key: 'skills.subtitle', prop: 'text' },

  /* ── Docs panel ──────────────────────────────────────────── */
  { selector: '#docsCloseBtn', key: 'docs.close', prop: 'text' },

  /* ── Document Memory panel ───────────────────────────────── */
  { selector: '.document-memory-title', key: 'docMemory.title', prop: 'text' },
  { selector: '.document-memory-subtitle', key: 'docMemory.subtitle', prop: 'text' },
  { selector: '#documentMemoryCloseBtn', key: 'docs.close', prop: 'text' },

  /* ── Home / Empty state ──────────────────────────────────── */
  { selector: '.feedback-logo-studio', key: 'home.studio', prop: 'text' },
  { selector: '#homeFeedbackInput', key: 'home.feedbackPlaceholder', prop: 'placeholder' },
  { selector: '#homeHowToBtn', key: 'home.howToUse', prop: 'text' },
  { selector: '#homeBehindBtn', key: 'home.howWeDo', prop: 'text' },
  { selector: '#homeStartBtn', key: 'home.startNow', prop: 'text' },

  /* ── API Settings Modal ──────────────────────────────────── */
  { selector: '#apiModalTitle', key: 'api.title', prop: 'text' },
  { selector: 'label[for="apiProviderSelect"]', key: 'api.provider', prop: 'text' },
  { selector: 'label[for="apiBaseUrlInput"]', key: 'api.baseUrl', prop: 'text' },
  { selector: 'label[for="apiModelInput"]', key: 'api.model', prop: 'text' },
  { selector: '#apiModelSelect option[value=""]', key: 'api.selectModel', prop: 'text' },
  { selector: '#detectModelsBtn', key: 'api.detectModels', prop: 'text' },
  { selector: 'label[for="apiInput"]', key: 'api.apiKey', prop: 'text' },
  { selector: '#apiInput', key: 'api.apiKeyPlaceholder', prop: 'placeholder' },
  { selector: '#apiToggleVisibilityBtn', key: 'api.showApiKey', prop: 'aria-label' },
  { selector: '#apiToggleVisibilityBtn', key: 'api.showApiKey', prop: 'title' },
  { selector: '#apiModal .modal .muted:last-of-type', key: 'api.tip', prop: 'text' },
  { selector: '#cancelApiBtn', key: 'api.cancel', prop: 'text' },
  { selector: '#saveApiBtn', key: 'api.save', prop: 'text' },

  /* ── API Error Modal ─────────────────────────────────────── */
  { selector: '#apiErrorTitle', key: 'apiError.title', prop: 'text' },
  { selector: '#apiErrorSummary', key: 'apiError.summary', prop: 'text' },
  { selector: '#apiErrorModal .modal .muted', key: 'apiError.hint', prop: 'text' },
  { selector: 'label[for="apiErrorReport"]', key: 'apiError.fullReport', prop: 'text' },
  { selector: '#apiErrorViewBtn', key: 'apiError.viewFull', prop: 'text' },
  { selector: '#apiErrorReportBtn', key: 'apiError.reportError', prop: 'text' },
  { selector: '#apiErrorOkBtn', key: 'apiError.ok', prop: 'text' },

  /* ── Settings Modal ──────────────────────────────────────── */
  { selector: '#settingsTitle', key: 'settings.title', prop: 'text' },
  { selector: '#settingsModal label:first-of-type', key: 'settings.theme', prop: 'text' },
  { selector: '#themeDarkBtn', key: 'settings.dark', prop: 'text' },
  { selector: '#themeLightBtn', key: 'settings.light', prop: 'text' },
  { selector: 'label[for="autosaveInput"]', key: 'settings.autosaveLabel', prop: 'text' },
  { selector: '#settingsModal .settings-group:nth-child(2) .muted', key: 'settings.autosaveHint', prop: 'text' },
  { selector: '#saveNowBtn', key: 'settings.saveNow', prop: 'text' },
  { selector: '#closeSettingsBtn', key: 'settings.apply', prop: 'text' },

  /* ── Stage Advance Modal ─────────────────────────────────── */
  { selector: '#stageAdvanceTitle', key: 'stageAdvance.title', prop: 'text' },
  { selector: '#stageAdvanceMsg', key: 'stageAdvance.message', prop: 'text' },
  { selector: '#cancelAdvanceBtn', key: 'stageAdvance.cancel', prop: 'text' },
  { selector: '#confirmAdvanceBtn', key: 'stageAdvance.confirm', prop: 'text' },

  /* ── Reviewer Name Modal ─────────────────────────────────── */
  { selector: '#reviewerNameTitle', key: 'reviewerName.title', prop: 'text' },
  { selector: 'label[for="reviewerNameInput"]', key: 'reviewerName.label', prop: 'text' },
  { selector: '.reviewer-name-prefix', key: 'reviewerName.prefix', prop: 'text' },
  { selector: '#reviewerNameInput', key: 'reviewerName.placeholder', prop: 'placeholder' },
  { selector: '#cancelReviewerNameBtn', key: 'reviewerName.cancel', prop: 'text' },
  { selector: '#confirmReviewerNameBtn', key: 'reviewerName.confirm', prop: 'text' },

  /* ── Project Rename Modal ────────────────────────────────── */
  { selector: '#projectRenameTitle', key: 'projectRename.title', prop: 'text' },
  { selector: 'label[for="projectRenameInput"]', key: 'projectRename.label', prop: 'text' },
  { selector: '#projectRenameInput', key: 'projectRename.placeholder', prop: 'placeholder' },
  { selector: '#cancelProjectRenameBtn', key: 'projectRename.cancel', prop: 'text' },
  { selector: '#confirmProjectRenameBtn', key: 'projectRename.confirm', prop: 'text' },

  /* ── Snapshots Modal ─────────────────────────────────────── */
  { selector: '#projectSnapshotsTitle', key: 'snapshots.title', prop: 'text' },
  { selector: '#projectSnapshotsHint', key: 'snapshots.hint', prop: 'text' },
  { selector: '#closeProjectSnapshotsBtn', key: 'snapshots.close', prop: 'text' },

  /* ── Context Menus ───────────────────────────────────────── */
  { selector: '#reviewerContextMenu [data-action="rename"]', key: 'context.rename', prop: 'text' },
  { selector: '#projectContextMenu [data-action="rename"]', key: 'context.projectRename', prop: 'text' },
  { selector: '#projectContextMenu [data-action="copy"]', key: 'context.copy', prop: 'text' },
  { selector: '#projectContextMenu [data-action="snapshot-create"]', key: 'context.addSnapshot', prop: 'text' },
  { selector: '#projectContextMenu [data-action="snapshot-restore"]', key: 'context.restoreSnapshot', prop: 'text' },
  { selector: '#projectContextMenu [data-action="delete"]', key: 'context.delete', prop: 'text' },

  /* ── Add Response Modal ──────────────────────────────────── */
  { selector: '#addResponseTitle', key: 'addResponse.title', prop: 'text' },
  { selector: 'label[for="addResponseTypeInput"]', key: 'addResponse.type', prop: 'text' },
  { selector: '#addResponseTypeInput option[value="weakness"]', key: 'addResponse.typeWeakness', prop: 'text' },
  { selector: '#addResponseTypeInput option[value="question"]', key: 'addResponse.typeQuestion', prop: 'text' },
  { selector: 'label[for="addResponseTitleInput"]', key: 'addResponse.titleLabel', prop: 'text' },
  { selector: '#addResponseTitleInput', key: 'addResponse.titlePlaceholder', prop: 'placeholder' },
  { selector: 'label[for="addResponseContentInput"]', key: 'addResponse.content', prop: 'text' },
  { selector: '#addResponseContentInput', key: 'addResponse.contentPlaceholder', prop: 'placeholder' },
  { selector: '#cancelAddResponseBtn', key: 'addResponse.cancel', prop: 'text' },
  { selector: '#confirmAddResponseBtn', key: 'addResponse.confirm', prop: 'text' },

  /* ── Split Response Modal ────────────────────────────────── */
  { selector: '#splitResponseTitle', key: 'splitResponse.title', prop: 'text' },
  { selector: '#splitResponseModal .modal > p.muted', key: 'splitResponse.hint', prop: 'html' },
  { selector: 'label[for="splitResponseContentInput"]', key: 'splitResponse.label', prop: 'text' },
  { selector: '#splitResponseContentInput', key: 'splitResponse.placeholder', prop: 'placeholder' },
  { selector: '#cancelSplitResponseBtn', key: 'splitResponse.cancel', prop: 'text' },
  { selector: '#confirmSplitResponseBtn', key: 'splitResponse.confirm', prop: 'text' },

  /* ── Stage3 Style Modal ──────────────────────────────────── */
  { selector: '#stage3StyleTitle', key: 'stage3Style.title', prop: 'text' },
  { selector: 'label[for="stage3StyleSelect"]', key: 'stage3Style.styleLabel', prop: 'text' },
  { selector: '#stage3ColorSection > label', key: 'stage3Style.themeColor', prop: 'text' },
  { selector: '.stage3-custom-color-row > .muted', key: 'stage3Style.customHex', prop: 'text' },
  { selector: '#stage3StyleConfirmBtn', key: 'stage3Style.apply', prop: 'text' },

  /* ── Stage5 Template Modal ───────────────────────────────── */
  { selector: '#stage5TemplateTitle', key: 'stage5Template.title', prop: 'text' },
  { selector: 'label[for="stage5TemplateSelect"]', key: 'stage5Template.label', prop: 'text' },
  { selector: '#stage5TemplateModal .modal > p.muted', key: 'stage5Template.hint', prop: 'text' },
  { selector: '#stage5TemplateCancelBtn', key: 'stage5Template.cancel', prop: 'text' },
  { selector: '#stage5TemplateApplyBtn', key: 'stage5Template.apply', prop: 'text' },

  /* ── Stage3 Breakdown Modal ──────────────────────────────── */
  { selector: '#stage3BreakdownTitle', key: 'stage3Breakdown.title', prop: 'text' },
  { selector: 'label[for="stage3BreakdownLengthInput"]', key: 'stage3Breakdown.label', prop: 'text' },
  { selector: '#stage3BreakdownCancelBtn', key: 'stage3Breakdown.cancel', prop: 'text' },
  { selector: '#stage3BreakdownConfirmBtn', key: 'stage3Breakdown.confirm', prop: 'text' },

  /* ── Stage3 Breakdown Result Modal ───────────────────────── */
  { selector: '#stage3BreakdownResultTitle', key: 'stage3BreakdownResult.title', prop: 'text' },
  { selector: '#stage3BreakdownResultCloseBtn', key: 'stage3BreakdownResult.close', prop: 'text' },

  /* ── Insert Table Modal ──────────────────────────────────── */
  { selector: '#stage2TableModalTitle', key: 'insertTable.title', prop: 'text' },
  { selector: 'label[for="stage2TableRowsInput"]', key: 'insertTable.rows', prop: 'text' },
  { selector: 'label[for="stage2TableColsInput"]', key: 'insertTable.columns', prop: 'text' },
  { selector: '#stage2TableBuildBtn', key: 'insertTable.buildGrid', prop: 'text' },
  { selector: '#stage2TableCancelBtn', key: 'insertTable.cancel', prop: 'text' },
  { selector: '#stage2TableConfirmBtn', key: 'insertTable.insert', prop: 'text' },

  /* ── Insert Code Modal ───────────────────────────────────── */
  { selector: '#stage2CodeModalTitle', key: 'insertCode.title', prop: 'text' },
  { selector: 'label[for="stage2CodeLanguageInput"]', key: 'insertCode.language', prop: 'text' },
  { selector: '#stage2CodeLanguageInput', key: 'insertCode.languagePlaceholder', prop: 'placeholder' },
  { selector: 'label[for="stage2CodeContentInput"]', key: 'insertCode.code', prop: 'text' },
  { selector: '#stage2CodeContentInput', key: 'insertCode.codePlaceholder', prop: 'placeholder' },
  { selector: '#stage2CodeCancelBtn', key: 'insertCode.cancel', prop: 'text' },
  { selector: '#stage2CodeConfirmBtn', key: 'insertCode.insert', prop: 'text' },

  /* ── Template Center Modal ───────────────────────────────── */
  { selector: '#templateModalTitle', key: 'template.title', prop: 'text' },
  { selector: '#templatePreviewTitle', key: 'template.previewTitle', prop: 'text' },
  { selector: '#templateRenderCopyBtn', key: 'template.renderCopy', prop: 'text' },
  { selector: '.polish-btn-label', key: 'template.polish', prop: 'text' },
  { selector: '#templateRenderedOutput', key: 'template.outputPlaceholder', prop: 'placeholder' },
  { selector: '#closeTemplateBtn', key: 'template.close', prop: 'text' },

  /* ── Stage4 Copy Popup ───────────────────────────────────── */
  { selector: '.stage4-copy-popup-title', key: 'stage4Popup.ready', prop: 'text' },
  { selector: '#stage4CopyPopupCopyBtn', key: 'stage4Popup.copy', prop: 'text' },
  { selector: '#stage4CopyPopupCloseBtn', key: 'stage4Popup.close', prop: 'text' },

  /* ── Skill Modal ─────────────────────────────────────────── */
  { selector: '#skillModalTitle', key: 'skill.title', prop: 'text' },

  /* ── Export Popup ────────────────────────────────────────── */
  { selector: '#exportProjectPopupTitle', key: 'export.title', prop: 'text' },
  { selector: '[data-export-type="md"]', key: 'export.markdown', prop: 'text' },
];
