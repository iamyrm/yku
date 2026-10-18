/* Yagya Krishi Udhyog — boot sequence.
   Order matters: the dictionary is applied first, then the header/footer are
   built, then the data-driven modules render into their mounts. All scripts
   are loaded with `defer`, so the DOM is already parsed here. */
(function () {
  'use strict';

  function initAccordions() {
    var lists = document.querySelectorAll('[data-accordion]');
    for (var i = 0; i < lists.length; i++) {
      (function (list) {
        list.addEventListener('click', function (e) {
          var trigger = e.target.closest('.accordion__trigger');
          if (!trigger || !list.contains(trigger)) return;
          var panel = document.getElementById(trigger.getAttribute('aria-controls'));
          if (!panel) return;
          var open = trigger.getAttribute('aria-expanded') === 'true';
          trigger.setAttribute('aria-expanded', String(!open));
          panel.classList.toggle('is-open', !open);
        });
      })(lists[i]);
    }
  }

  function onLanguageChange(e) {
    if (e && e.detail && e.detail.changed === false) return;
    if (window.YK_NAV) window.YK_NAV.render();
    if (window.YK_CATALOGUE) window.YK_CATALOGUE.renderAll();
    if (window.YK_FILTERS) window.YK_FILTERS.rerender();
    if (window.YK_CONTACT) window.YK_CONTACT.refresh();
    if (window.YK_GALLERY) window.YK_GALLERY.refresh();
    if (window.Lang) window.Lang.applyAll(document);
  }

  function boot() {
    if (window.Lang) window.Lang.boot();

    if (window.YK_NAV) window.YK_NAV.init();
    if (window.YK_CATALOGUE) window.YK_CATALOGUE.init();
    if (window.YK_FILTERS) window.YK_FILTERS.init();
    if (window.YK_CONTACT) window.YK_CONTACT.init();
    if (window.YK_GALLERY) window.YK_GALLERY.init();

    initAccordions();

    if (window.YK_ANIM) window.YK_ANIM.init();

    document.addEventListener('yk:langchange', onLanguageChange);
  }

  boot();
})();
