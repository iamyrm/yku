/* Yagya Krishi Udhyog — shared helpers, header/footer injection and navigation behaviour.
   The header/footer live as empty #site-header / #site-footer mounts in every page;
   this module builds them from the data-* depth of the current body element. */
(function () {
  'use strict';

  var CFG = window.YK_CONFIG || {};

  /* ---------------------------------------------------------------- helpers */

  function lang() {
    return window.Lang ? window.Lang.get() : (CFG.defaultLang || 'en');
  }

  function t(key, vars) {
    return window.Lang ? window.Lang.t(key, vars) : key;
  }

  /* Bilingual value helper: data files store {en, ne} objects. */
  function bi(obj) {
    if (!obj) return '';
    return obj[lang()] || obj.en || '';
  }

  function esc(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function base() {
    return document.body.getAttribute('data-base') || '';
  }

  function pageId() {
    return document.body.getAttribute('data-page') || '';
  }

  function href(path) {
    return base() + path;
  }

  function waUrl(message) {
    var number = CFG.whatsappNumber || '9779804331857';
    var text = typeof message === 'string' ? message : t('wa.general');
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);
  }

  window.YK_UTIL = {
    lang: lang,
    t: t,
    bi: bi,
    esc: esc,
    base: base,
    pageId: pageId,
    href: href,
    waUrl: waUrl
  };

  /* ------------------------------------------------------------- fragments */

  var CARET =
    '<svg class="caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M6 9l6 6 6-6"/></svg>';

  var ICON_MENU =
    '<svg class="menu-toggle__open" width="20" height="20" viewBox="0 0 24 24" fill="none"' +
    ' stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
    '<path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
    '<svg class="menu-toggle__close" width="20" height="20" viewBox="0 0 24 24" fill="none"' +
    ' stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
    '<path d="M6 6l12 12M18 6L6 18"/></svg>';

  var ICON_PHONE =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
    ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6' +
    ' 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11' +
    'L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';

  var ICON_WHATSAPP =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
    ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7' +
    'a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

  var ICON_PIN =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
    ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  /* ------------------------------------------------------- section mapping */

  function sectionKey() {
    var page = pageId();
    if (page === 'home') return 'home';
    if (page === 'livestock-index' || page === 'livestock-detail') return 'livestock';
    if (page === 'feed-index' || page === 'feed-detail') return 'feed';
    if (page === 'crops-index' || page === 'crops-detail') return 'crops';
    if (page === 'practices') return 'practices';
    if (page === 'about') return 'about';
    if (page === 'contact') return 'contact';
    return '';
  }

  /* ---------------------------------------------------------- link builders */

  function plainLink(path, key, isActive) {
    return (
      '<li class="nav-item' + (isActive ? ' nav-item--active' : '') + '">' +
      '<a class="nav-link" href="' + esc(href(path)) + '"' +
      (isActive ? ' aria-current="page"' : '') +
      ' data-i18n="' + key + '">' + esc(t(key)) + '</a></li>'
    );
  }

  function livestockLinks() {
    var out = '';
    var list = window.YK_LIVESTOCK || [];
    for (var i = 0; i < list.length; i++) {
      out +=
        '<a href="' + esc(href('livestock/' + list[i].slug + '/index.html')) + '">' +
        esc(bi(list[i].name)) + '</a>';
    }
    return out;
  }

  function feedCategoryLinks() {
    var out = '';
    var cats = window.YK_FEED_CATEGORIES || [];
    for (var i = 0; i < cats.length; i++) {
      out +=
        '<a href="' + esc(href('animal-feed/index.html?category=' + cats[i].key + '#products')) + '">' +
        esc(bi(cats[i].label)) + '</a>';
    }
    return out;
  }

  function dropdown(key, allKey, hintKey, allPath, children, isActive) {
    return (
      '<li class="nav-item' + (isActive ? ' nav-item--active' : '') + '">' +
      '<button class="nav-link" type="button" aria-expanded="false" data-dropdown>' +
      '<span data-i18n="' + key + '">' + esc(t(key)) + '</span>' + CARET +
      '</button>' +
      '<div class="nav-dropdown">' +
      '<a href="' + esc(href(allPath)) + '"' + (isActive ? ' aria-current="page"' : '') + '>' +
      '<strong data-i18n="' + allKey + '">' + esc(t(allKey)) + '</strong>' +
      '<span data-i18n="' + hintKey + '">' + esc(t(hintKey)) + '</span></a>' +
      children +
      '</div></li>'
    );
  }

  /* --------------------------------------------------------------- header */

  function brand() {
    var name = CFG.businessName || { en: 'Yagya Krishi Udhyog', ne: 'यज्ञ कृषि उद्योग' };
    return (
      '<a class="brand" href="' + esc(href('index.html')) + '">' +
      '<img src="' + esc(href('assets/images/logo/logo.png')) + '" alt="" width="42" height="42">' +
      '<span class="brand-text"><strong>' + esc(bi(name)) + '</strong>' +
      '<small data-i18n="home.hero.eyebrow">' + esc(t('home.hero.eyebrow')) + '</small></span></a>'
    );
  }

  function primaryNav(sec) {
    var items = plainLink('index.html', 'nav.home', sec === 'home');
    items += dropdown(
      'nav.livestock', 'nav.livestock_all', 'nav.dropdown_hint_livestock',
      'livestock/index.html', livestockLinks(), sec === 'livestock'
    );
    items += dropdown(
      'nav.animal_feed', 'nav.feed_all', 'nav.dropdown_hint_feed',
      'animal-feed/index.html', feedCategoryLinks(), sec === 'feed'
    );
    items += plainLink('crops/index.html', 'nav.crops', sec === 'crops');
    items += plainLink('farming-practices/index.html', 'nav.practices', sec === 'practices');
    items += plainLink('about/index.html', 'nav.about', sec === 'about');
    items += plainLink('contact/index.html', 'nav.contact', sec === 'contact');
    return (
      '<nav class="primary-nav" aria-label="' + esc(t('nav.primary_aria')) + '" data-i18n-aria="nav.primary_aria">' +
      '<ul class="nav-list">' + items + '</ul></nav>'
    );
  }

  function langSwitch() {
    var cur = lang();
    return (
      '<div class="lang-switch" role="group" aria-label="' + esc(t('lang.aria')) + '" data-i18n-aria="lang.aria">' +
      '<button type="button" data-lang="en" aria-pressed="' + (cur === 'en') + '"' +
      ' aria-label="' + esc(t('lang.en_aria')) + '" data-i18n-aria="lang.en_aria">EN</button>' +
      '<span class="lang-switch__divider" aria-hidden="true"></span>' +
      '<button type="button" data-lang="ne" aria-pressed="' + (cur === 'ne') + '"' +
      ' aria-label="' + esc(t('lang.ne_aria')) + '" data-i18n-aria="lang.ne_aria">ने</button>' +
      '</div>'
    );
  }

  function menuToggle() {
    return (
      '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-drawer"' +
      ' aria-label="' + esc(t('header.menu')) + '" data-i18n-aria="header.menu">' +
      ICON_MENU + '</button>'
    );
  }

  function mobileGroup(id, key, children, isActive) {
    return (
      '<li' + (isActive ? ' class="is-active" style="color:var(--c-primary)"' : '') + '>' +
      '<button class="mobile-nav__group" type="button" aria-expanded="false"' +
      ' aria-controls="m-sub-' + id + '"' + (isActive ? ' aria-current="page"' : '') + '>' +
      '<span data-i18n="' + key + '">' + esc(t(key)) + '</span>' + CARET + '</button>' +
      '<div class="mobile-subnav" id="m-sub-' + id + '" style="display:none">' + children + '</div>' +
      '</li>'
    );
  }

  function mobileLink(path, key, isActive) {
    return (
      '<li><a href="' + esc(href(path)) + '"' +
      (isActive ? ' aria-current="page"' : '') +
      ' data-i18n="' + key + '">' + esc(t(key)) + '</a></li>'
    );
  }

  function mobileDrawer(sec) {
    var items = mobileLink('index.html', 'nav.home', sec === 'home');
    items += mobileGroup(
      'livestock', 'nav.livestock',
      '<a href="' + esc(href('livestock/index.html')) + '" data-i18n="nav.livestock_all">' +
      esc(t('nav.livestock_all')) + '</a>' + livestockLinks(),
      sec === 'livestock'
    );
    items += mobileGroup(
      'feed', 'nav.animal_feed',
      '<a href="' + esc(href('animal-feed/index.html')) + '" data-i18n="nav.feed_all">' +
      esc(t('nav.feed_all')) + '</a>' + feedCategoryLinks(),
      sec === 'feed'
    );
    items += mobileLink('crops/index.html', 'nav.crops', sec === 'crops');
    items += mobileLink('farming-practices/index.html', 'nav.practices', sec === 'practices');
    items += mobileLink('about/index.html', 'nav.about', sec === 'about');
    items += mobileLink('contact/index.html', 'nav.contact', sec === 'contact');

    return (
      '<div class="mobile-drawer" id="mobile-drawer">' +
      '<div class="container"><ul class="mobile-nav">' + items + '</ul>' +
      '<div class="mobile-drawer__actions">' +
      '<a class="btn btn--primary" href="' + esc(href('contact/index.html')) + '" data-i18n="cta.contact">' +
      esc(t('cta.contact')) + '</a>' +
      '<a class="btn btn--outline" href="' + esc(waUrl()) + '" target="_blank" rel="noopener"' +
      ' data-wa-link data-i18n="cta.whatsapp">' + esc(t('cta.whatsapp')) + '</a>' +
      '<a class="mobile-drawer__phone" href="tel:' + esc(CFG.phoneTel || '+9779804331857') + '">' +
      esc(CFG.phoneDisplay || '') + '</a>' +
      '</div></div></div>'
    );
  }

  function renderHeader() {
    var host = document.getElementById('site-header');
    if (!host) return;
    var sec = sectionKey();
    host.innerHTML =
      '<header class="site-header">' +
      '<div class="container header-inner">' +
      brand() +
      primaryNav(sec) +
      '<div class="header-actions">' +
      langSwitch() +
      '<a class="btn btn--outline btn--sm header-whatsapp" href="' + esc(waUrl()) + '"' +
      ' target="_blank" rel="noopener" data-wa-link data-i18n="header.whatsapp">' +
      esc(t('header.whatsapp')) + '</a>' +
      menuToggle() +
      '</div></div>' +
      mobileDrawer(sec) +
      '</header>' +
      '<p id="lang-live" class="visually-hidden" aria-live="polite"></p>';
  }

  /* --------------------------------------------------------------- footer */

  function footerNavLinks() {
    var out = '';
    out += '<li><a href="' + esc(href('index.html')) + '" data-i18n="nav.home">' + esc(t('nav.home')) + '</a></li>';
    out += '<li><a href="' + esc(href('about/index.html')) + '" data-i18n="nav.about">' + esc(t('nav.about')) + '</a></li>';
    out += '<li><a href="' + esc(href('livestock/index.html')) + '" data-i18n="nav.livestock">' + esc(t('nav.livestock')) + '</a></li>';
    out += '<li><a href="' + esc(href('animal-feed/index.html')) + '" data-i18n="nav.animal_feed">' + esc(t('nav.animal_feed')) + '</a></li>';
    out += '<li><a href="' + esc(href('crops/index.html')) + '" data-i18n="nav.crops">' + esc(t('nav.crops')) + '</a></li>';
    out += '<li><a href="' + esc(href('farming-practices/index.html')) + '" data-i18n="nav.practices">' + esc(t('nav.practices')) + '</a></li>';
    out += '<li><a href="' + esc(href('contact/index.html')) + '" data-i18n="nav.contact">' + esc(t('nav.contact')) + '</a></li>';
    return out;
  }

  function renderFooter() {
    var host = document.getElementById('site-footer');
    if (!host) return;
    var name = CFG.businessName || { en: 'Yagya Krishi Udhyog', ne: 'यज्ञ कृषि उद्योग' };
    var phone = CFG.phoneDisplay || '+977-980-433-1857';

    host.innerHTML =
      '<footer class="site-footer">' +
      '<div class="container">' +
      '<div class="footer-grid">' +

      '<div class="footer-brand">' +
      '<a class="brand" href="' + esc(href('index.html')) + '">' +
      '<img src="' + esc(href('assets/images/logo/logo.png')) + '" alt="" width="42" height="42">' +
      '<span class="brand-text"><strong>' + esc(bi(name)) + '</strong>' +
      '<small data-i18n="home.hero.eyebrow">' + esc(t('home.hero.eyebrow')) + '</small></span></a>' +
      '<p data-i18n="footer.about_desc">' + esc(t('footer.about_desc')) + '</p>' +
      '</div>' +

      '<div class="footer-col">' +
      '<h3 data-i18n="footer.nav_title">' + esc(t('footer.nav_title')) + '</h3>' +
      '<ul>' + footerNavLinks() + '</ul>' +
      '</div>' +

      '<div class="footer-col">' +
      '<h3 data-i18n="footer.livestock_title">' + esc(t('footer.livestock_title')) + '</h3>' +
      '<ul>' +
      '<li><a href="' + esc(href('livestock/index.html')) + '" data-i18n="nav.livestock_all">' +
      esc(t('nav.livestock_all')) + '</a></li>' + livestockLinks() +
      '</ul>' +
      '<h3 style="margin-top: var(--s-5);" data-i18n="footer.feed_title">' + esc(t('footer.feed_title')) + '</h3>' +
      '<ul>' +
      '<li><a href="' + esc(href('animal-feed/index.html')) + '" data-i18n="nav.feed_all">' +
      esc(t('nav.feed_all')) + '</a></li>' + feedCategoryLinks() +
      '</ul>' +
      '</div>' +

      '<div class="footer-col footer-contact-col">' +
      '<h3 data-i18n="footer.contact_title">' + esc(t('footer.contact_title')) + '</h3>' +
      '<div class="footer-contact">' +
      '<a href="tel:' + esc(CFG.phoneTel || '+9779804331857') + '">' + ICON_PHONE +
      '<span><span data-i18n="footer.phone_label">' + esc(t('footer.phone_label')) + '</span>: ' +
      esc(phone) + '</span></a>' +
      '<a href="' + esc(waUrl()) + '" target="_blank" rel="noopener" data-wa-link>' + ICON_WHATSAPP +
      '<span data-i18n="footer.whatsapp_label">' + esc(t('footer.whatsapp_label')) + '</span></a>' +
      '<p style="display:inline-flex; align-items:center; gap:0.55rem; font-size: var(--fs-sm);">' +
      ICON_PIN + '<span data-i18n="footer.location">' + esc(t('footer.location')) + '</span></p>' +
      '</div></div>' +

      '</div>' +

      '<div class="footer-bottom">' +
      '<p data-footer-copyright>' + esc(t('footer.copyright', { year: String(new Date().getFullYear()) })) + '</p>' +
      '<nav aria-label="' + esc(t('a11y.breadcrumb')) + '">' +
      '<a href="' + esc(href('privacy-policy/index.html')) + '" data-i18n="footer.privacy">' +
      esc(t('footer.privacy')) + '</a>' +
      '<a href="' + esc(href('terms-and-conditions/index.html')) + '" data-i18n="footer.terms">' +
      esc(t('footer.terms')) + '</a>' +
      '</nav></div>' +

      '</div></footer>';
  }

  /* ------------------------------------------------------------ behaviour */

  var lastFocused = null;

  function drawer() { return document.getElementById('mobile-drawer'); }
  function toggleBtn() { return document.querySelector('.menu-toggle'); }

  function drawerOpen() {
    var d = drawer();
    return d && d.classList.contains('is-open');
  }

  function setDrawer(open) {
    var d = drawer();
    var btn = toggleBtn();
    if (!d || !btn) return;
    d.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('data-i18n-aria', open ? 'header.menu_close' : 'header.menu');
    btn.setAttribute('aria-label', t(open ? 'header.menu_close' : 'header.menu'));
    document.body.classList.toggle('menu-open', open);
    if (open) {
      lastFocused = document.activeElement;
      var first = d.querySelector('a, button');
      if (first) first.focus();
    } else if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
      lastFocused = null;
    }
    // collapse any expanded sub-groups when closing
    if (!open) {
      var groups = d.querySelectorAll('.mobile-nav__group[aria-expanded="true"]');
      for (var i = 0; i < groups.length; i++) {
        groups[i].setAttribute('aria-expanded', 'false');
        var sub = document.getElementById(groups[i].getAttribute('aria-controls'));
        if (sub) sub.style.display = 'none';
      }
    }
  }

  function closeDropdowns(except) {
    var btns = document.querySelectorAll('[data-dropdown][aria-expanded="true"]');
    for (var i = 0; i < btns.length; i++) {
      if (except && btns[i] === except) continue;
      btns[i].setAttribute('aria-expanded', 'false');
      var menu = btns[i].nextElementSibling;
      if (menu) menu.classList.remove('is-open');
    }
  }

  function onHostClick(e) {
    var el;

    // Language switch
    el = e.target.closest('[data-lang]');
    if (el) {
      e.preventDefault();
      window.Lang.set(el.getAttribute('data-lang'), { announce: true });
      return;
    }

    // Mobile menu toggle
    if (e.target.closest('.menu-toggle')) {
      e.preventDefault();
      setDrawer(!drawerOpen());
      return;
    }

    // Desktop dropdown trigger
    el = e.target.closest('[data-dropdown]');
    if (el) {
      var willOpen = el.getAttribute('aria-expanded') !== 'true';
      closeDropdowns(el);
      el.setAttribute('aria-expanded', String(willOpen));
      var menu = el.nextElementSibling;
      if (menu) menu.classList.toggle('is-open', willOpen);
      return;
    }

    // Mobile sub-group trigger
    el = e.target.closest('.mobile-nav__group');
    if (el) {
      var expanded = el.getAttribute('aria-expanded') === 'true';
      el.setAttribute('aria-expanded', String(!expanded));
      var sub = document.getElementById(el.getAttribute('aria-controls'));
      if (sub) sub.style.display = expanded ? 'none' : '';
      return;
    }

    // Following a link inside the drawer should close it
    if (e.target.closest('.mobile-drawer a')) {
      setDrawer(false);
    }
  }

  function focusablesIn(root) {
    return Array.prototype.filter.call(
      root.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null || el === document.activeElement; }
    );
  }

  function onKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (drawerOpen()) {
        setDrawer(false);
        return;
      }
      closeDropdowns(null);
      return;
    }

    if (e.key !== 'Tab' || !drawerOpen()) return;

    var d = drawer();
    var btn = toggleBtn();
    var list = [];
    if (btn) list.push(btn);
    list = list.concat(focusablesIn(d));
    if (!list.length) return;

    var first = list[0];
    var last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (list.indexOf(document.activeElement) === -1) {
      e.preventDefault();
      first.focus();
    }
  }

  function onDocumentClick(e) {
    if (!e.target.closest('.nav-item')) closeDropdowns(null);
  }

  function onScroll() {
    var head = document.querySelector('.site-header');
    if (head) head.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  function render() {
    renderHeader();
    renderFooter();
    onScroll();
  }

  function init() {
    render();
    var host = document.getElementById('site-header');
    if (host) host.addEventListener('click', onHostClick);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onDocumentClick);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  window.YK_NAV = { init: init, render: render };
})();
