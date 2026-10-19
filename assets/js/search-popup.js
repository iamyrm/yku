/* Header search popup — instant filtering over the static site index.
   Falls back to the normal search.html form when JavaScript is off. */
(function () {
  'use strict';

  var popup = document.getElementById('search-popup');
  if (!popup) return;

  var panel = popup.querySelector('.search-popup__panel');
  var form = popup.querySelector('.search-popup__form');
  var input = document.getElementById('search-popup-input');
  var results = document.getElementById('search-popup-results');
  var openers = document.querySelectorAll('[data-search-open]');
  var closers = popup.querySelectorAll('[data-search-close]');
  var index = window.YK_SEARCH_INDEX || [];
  var lastFocused = null;
  var timer = null;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function highlight(text, terms) {
    var pattern = terms
      .map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); })
      .filter(Boolean)
      .join('|');
    if (!pattern) return escapeHtml(text);
    try {
      return escapeHtml(text).replace(new RegExp('(' + pattern + ')', 'gi'), '<mark>$1</mark>');
    } catch (err) {
      return escapeHtml(text);
    }
  }

  function render(query) {
    if (!results) return;
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    results.innerHTML = '';
    if (!terms.length) return;

    var matches = index.filter(function (entry) {
      var haystack = (entry.title + ' ' + entry.group).toLowerCase();
      return terms.every(function (term) { return haystack.indexOf(term) !== -1; });
    });

    if (!matches.length) {
      var empty = document.createElement('p');
      empty.className = 'search-popup__empty';
      empty.textContent = 'No pages matched “' + query + '”. Try “pig”, “feed” or “rice”.';
      results.appendChild(empty);
      return;
    }

    matches.slice(0, 8).forEach(function (entry) {
      var link = document.createElement('a');
      link.className = 'search-popup__result';
      link.href = entry.url;
      link.innerHTML =
        '<span class="search-popup__result-title">' + highlight(entry.title, terms) + '</span>' +
        '<span class="search-popup__result-group">' + escapeHtml(entry.group) + '</span>';
      results.appendChild(link);
    });
  }

  function focusables() {
    return Array.prototype.filter.call(
      panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null; }
    );
  }

  function open() {
    if (document.body.classList.contains('menu-open')) {
      var toggle = document.querySelector('.menu-toggle');
      if (toggle) toggle.click();
    }
    lastFocused = document.activeElement;
    popup.hidden = false;
    document.body.classList.add('search-open');
    if (window.YK_LOCO) window.YK_LOCO.stop();
    if (input) {
      input.value = '';
      render('');
      window.setTimeout(function () { input.focus(); }, 20);
    }
  }

  function close() {
    if (popup.hidden) return;
    popup.hidden = true;
    document.body.classList.remove('search-open');
    if (window.YK_LOCO) window.YK_LOCO.start();
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
  }

  Array.prototype.forEach.call(openers, function (btn) {
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      open();
    });
  });

  Array.prototype.forEach.call(closers, function (btn) {
    btn.addEventListener('click', function () { close(); });
  });

  if (input) {
    input.addEventListener('input', function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { render(input.value.trim()); }, 80);
    });
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      if (!input || !input.value.trim()) event.preventDefault();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (popup.hidden) return;

    if (event.key === 'Escape' || event.key === 'Esc') {
      close();
      return;
    }

    if (event.key !== 'Tab') return;
    var list = focusables();
    if (!list.length) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
