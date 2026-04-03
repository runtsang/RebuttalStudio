/* ────────────────────────────────────────────────────────────
   i18n — Lightweight internationalization for Rebuttal Studio

   Zero-intrusion design:
     - Self-contained module, does NOT modify app.js or index.html structure
     - Uses CSS selectors (dom-map.js) to translate static HTML elements
     - Reads locale data from window.I18N_LOCALES (locales.js), no fetch()
     - Auto-injects a language toggle button into the topbar
     - MutationObserver re-applies translations instantly via rAF
     - To fully revert: remove i18n/ folder + 3 <script> tags in index.html
   ──────────────────────────────────────────────────────────── */

const I18n = (() => {
  const STORAGE_KEY = 'rs-locale';
  const SUPPORTED  = ['en', 'zh'];

  let _locale    = localStorage.getItem(STORAGE_KEY) || 'en';
  const _messages  = (window.I18N_LOCALES) || {};
  const _callbacks = [];

  /* ── Core translate function ─────────────────────────────── */

  function t(key, vars) {
    let msg = (_messages[_locale]?.[key])
           ?? (_messages['en']?.[key])
           ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        msg = msg.replaceAll(`{{${k}}}`, v);
      }
    }
    return msg;
  }

  /* ── Apply DOM-map translations ──────────────────────────── */

  function _setFirstTextNode(el, val) {
    // For elements with child elements (e.g. <span>Rating<span class="tooltip-badge">?</span></span>)
    // only replace the first text node, preserving child elements.
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        if (node.textContent.trim() !== val.trim()) {
          node.textContent = val;
        }
        return;
      }
    }
    // Fallback: no text node found, prepend one
    el.insertBefore(document.createTextNode(val), el.firstChild);
  }

  function applyAll() {
    if (!window.I18N_DOM_MAP) return;
    for (const entry of window.I18N_DOM_MAP) {
      try {
        const els = document.querySelectorAll(entry.selector);
        const val = t(entry.key);
        els.forEach(el => {
          switch (entry.prop) {
            case 'text':
              if (el.childElementCount === 0) {
                // Leaf node: simple textContent
                if (el.textContent !== val) el.textContent = val;
              } else {
                // Has child elements: only replace first text node
                _setFirstTextNode(el, val);
              }
              break;
            case 'placeholder':
              if (el.placeholder !== val) el.placeholder = val;
              break;
            case 'title':
              if (el.title !== val) el.title = val;
              break;
            case 'aria-label':
              if (el.getAttribute('aria-label') !== val) el.setAttribute('aria-label', val);
              break;
            case 'html':
              if (el.innerHTML !== val) el.innerHTML = val;
              break;
            case 'data-placeholder':
              if (el.getAttribute('data-placeholder') !== val) el.setAttribute('data-placeholder', val);
              break;
          }
        });
      } catch (_) { /* skip invalid selectors */ }
    }
  }

  /* ── Locale switching ────────────────────────────────────── */

  function setLocale(loc) {
    if (!SUPPORTED.includes(loc)) return;
    _locale = loc;
    localStorage.setItem(STORAGE_KEY, loc);
    document.documentElement.setAttribute('lang', loc === 'zh' ? 'zh-CN' : 'en');
    applyAll();
    _callbacks.forEach(cb => cb(loc));
    _updateToggleUI();
  }

  function getLocale()  { return _locale; }
  function onChange(cb)  { _callbacks.push(cb); }

  /* ── Auto-inject language toggle into topbar ─────────────── */

  function _injectToggle() {
    const topbarRight = document.querySelector('.topbar-right');
    if (!topbarRight || document.querySelector('.i18n-lang-switch')) return;

    const wrap = document.createElement('div');
    wrap.className = 'i18n-lang-switch';
    wrap.setAttribute('aria-label', 'Switch language');
    wrap.innerHTML =
      '<button class="i18n-lang-btn" type="button" data-lang="en">EN</button>' +
      '<span class="i18n-lang-divider" aria-hidden="true">|</span>' +
      '<button class="i18n-lang-btn" type="button" data-lang="zh">\u4e2d</button>';

    const actionsGroup = topbarRight.querySelector('.topbar-actions-group');
    topbarRight.insertBefore(wrap, actionsGroup || null);

    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-lang]');
      if (btn) setLocale(btn.dataset.lang);
    });
    _updateToggleUI();
  }

  function _updateToggleUI() {
    document.querySelectorAll('.i18n-lang-btn').forEach(btn => {
      const active = btn.dataset.lang === _locale;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  /* ── Inject minimal CSS for the toggle ───────────────────── */

  function _injectStyles() {
    if (document.getElementById('i18n-styles')) return;
    const style = document.createElement('style');
    style.id = 'i18n-styles';
    style.textContent = `
      .i18n-lang-switch {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        margin-right: 8px;
        user-select: none;
      }
      .i18n-lang-btn {
        background: none;
        border: none;
        color: var(--text-muted, #888);
        font-size: 0.78rem;
        font-family: var(--font-mono, 'IBM Plex Mono', monospace);
        padding: 2px 5px;
        border-radius: 4px;
        cursor: pointer;
        transition: color 0.15s, background 0.15s;
        line-height: 1;
      }
      .i18n-lang-btn:hover {
        color: var(--text, #fff);
      }
      .i18n-lang-btn.active {
        color: var(--text, #fff);
        background: var(--border, #333);
      }
      .i18n-lang-divider {
        color: var(--text-muted, #555);
        font-size: 0.75rem;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── MutationObserver: instant re-apply via rAF ──────────── */

  let _rafPending = false;

  function _scheduleApply() {
    if (_rafPending) return;
    _rafPending = true;
    requestAnimationFrame(() => {
      _rafPending = false;
      if (_locale !== 'en') applyAll();
    });
  }

  function _startObserver() {
    const observer = new MutationObserver(_scheduleApply);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false,
      attributes: false,
    });
  }

  /* ── Initialization (synchronous — no fetch needed) ──────── */

  function init() {
    _injectStyles();
    _injectToggle();
    document.documentElement.setAttribute('lang', _locale === 'zh' ? 'zh-CN' : 'en');
    if (_locale !== 'en') applyAll();
    _startObserver();
  }

  return { init, t, getLocale, setLocale, onChange, applyAll };
})();

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => I18n.init());
} else {
  I18n.init();
}
