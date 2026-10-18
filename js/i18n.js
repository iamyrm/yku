/* Yagya Krishi Udhyog — i18n core (EN default + NE, localStorage persistence) */
(function () {
  'use strict';

  var CFG = window.YK_CONFIG || window.siteConfig || {};
  var STORE_KEY = CFG.storageKey || 'yk_lang';
  var DICT = window.YK_TRANSLATIONS || window.translations || { en: {}, ne: {} };
  var EN = DICT.en || {};
  var NE = DICT.ne || {};
  var current = 'en';

  function detect() {
    var saved = null;
    try { saved = window.localStorage.getItem(STORE_KEY); } catch (e) { saved = null; }
    if (saved === 'en' || saved === 'ne') return saved;
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('ne') === 0 ? 'ne' : 'en';
  }

  function dictFor(lang) { return lang === 'ne' ? NE : EN; }

  /* Interpolate {placeholders} using vars, with a {fallback} default. */
  function interpolate(str, vars) {
    if (typeof str !== 'string') return str;
    return str.replace(/\{(\w+)\}/g, function (m, name) {
      if (vars && vars[name] !== undefined && vars[name] !== null) return String(vars[name]);
      return m;
    });
  }

  function t(key, vars) {
    var d = dictFor(current);
    var val = d[key];
    if (val === undefined || val === null || val === '') val = EN[key];
    if (val === undefined || val === null || val === '') return key;
    return interpolate(val, vars);
  }

  function has(key) { return EN[key] !== undefined; }

  function applyText(el, text) {
    if (el.hasAttribute('data-i18n-html')) { el.innerHTML = text; return; }
    el.textContent = text;
  }

  /* Translate one element according to its data-i18n-* attributes. */
  function applyElement(el) {
    if (el.hasAttribute('data-i18n')) applyText(el, t(el.getAttribute('data-i18n')));
    if (el.hasAttribute('data-i18n-content')) el.setAttribute('content', t(el.getAttribute('data-i18n-content')));
    if (el.hasAttribute('data-i18n-ph')) el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
    if (el.hasAttribute('data-i18n-alt')) el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    if (el.hasAttribute('data-i18n-aria')) el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    if (el.hasAttribute('data-i18n-title')) el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  }

  function applyAll(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-i18n],[data-i18n-content],[data-i18n-ph],[data-i18n-alt],[data-i18n-aria],[data-i18n-title]');
    for (var i = 0; i < nodes.length; i++) applyElement(nodes[i]);
  }

  function applyDocumentMeta() {
    document.documentElement.lang = current === 'ne' ? 'ne' : 'en';
    if (document.title) {
      var titleEl = document.querySelector('head title');
      if (titleEl && titleEl.hasAttribute('data-i18n-content')) {
        document.title = t(titleEl.getAttribute('data-i18n-content'));
      }
    }
    // Extension meta updates (description + OG tags driven by translation keys).
    var metas = document.querySelectorAll('meta[data-i18n-content]');
    for (var i = 0; i < metas.length; i++) {
      metas[i].setAttribute('content', t(metas[i].getAttribute('data-i18n-content')));
    }
  }

  function save(lang) {
    try { window.localStorage.setItem(STORE_KEY, lang); } catch (e) { /* storage may be blocked */ }
  }

  function set(lang, options) {
    if (lang !== 'en' && lang !== 'ne') lang = 'en';
    var changed = lang !== current;
    current = lang;
    save(lang);
    applyDocumentMeta();
    applyAll(document);
    document.dispatchEvent(new CustomEvent('yk:langchange', { detail: { lang: lang, changed: changed } }));
    if (options && options.announce) {
      var live = document.getElementById('lang-live');
      if (live) live.textContent = lang === 'ne' ? 'भाषा नेपालीमा बदलियो' : 'Language changed to English';
    }
  }

  function get() { return current; }

  function boot() {
    current = detect();
    save(current);
    applyDocumentMeta();
    applyAll(document);
    document.dispatchEvent(new CustomEvent('yk:langchange', { detail: { lang: current, changed: false } }));
  }

  window.Lang = { get: get, set: set, t: t, has: has, applyAll: applyAll, applyElement: applyElement, boot: boot };
  window.t = t;
  window.L = function (root) { applyAll(root || document); };
})();
