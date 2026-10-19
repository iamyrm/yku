/* Catalogue filters behaviour (DOM show/hide). */
(function () {
  'use strict';

  var type;
  var state = { q: '', sort: 'featured', category: '', availability: '', season: '' };
  var els = {};
  var originalOrder = [];
  var searchTimer = null;

  function esc(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function readURL() {
    var params = new URLSearchParams(location.search);
    state.q = params.get('q') || '';
    state.sort = params.get('sort') || 'featured';
    state.category = params.get('category') || '';
    state.availability = params.get('availability') || '';
    state.season = params.get('season') || '';
    if (els.search) els.search.value = state.q;
    if (els.sort) els.sort.value = state.sort;
    if (els.category) els.category.value = state.category;
    if (els.availability) els.availability.value = state.availability;
  }

  function syncURL() {
    var params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.sort && state.sort !== 'featured') params.set('sort', state.sort);
    if (state.category) params.set('category', state.category);
    if (state.availability) params.set('availability', state.availability);
    if (state.season) params.set('season', state.season);
    var qs = params.toString();
    try {
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    } catch (e) {}
  }

  function chipsGroups() {
    var hosts = document.querySelectorAll('[data-chips]');
    var groups = [];
    for (var i = 0; i < hosts.length; i++) {
      groups.push({ host: hosts[i], kind: hosts[i].getAttribute('data-chips') });
    }
    return groups;
  }

  function stateFor(kind) { return kind === 'season' ? state.season : state.category; }
  function setStateFor(kind, v) { if (kind === 'season') state.season = v; else state.category = v; }

  function syncChipStates() {
    var groups = chipsGroups();
    for (var g = 0; g < groups.length; g++) {
      var current = stateFor(groups[g].kind);
      var buttons = groups[g].host.querySelectorAll('.chip');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-value') === current));
      }
    }
  }

  function haystack(el) {
    var parts = [el.getAttribute('data-name') || '', el.getAttribute('data-category') || '', el.getAttribute('data-meta') || ''];
    var t = el.textContent || '';
    return (parts.join(' ') + ' ' + t).toLowerCase();
  }

  function applySort() {
    if (!els.grid) return;
    var items = originalOrder.slice();
    if (state.sort === 'az' || state.sort === 'za') {
      items.sort(function (a, b) {
        var an = (a.getAttribute('data-name') || '').toLowerCase();
        var bn = (b.getAttribute('data-name') || '').toLowerCase();
        return state.sort === 'az' ? an.localeCompare(bn) : bn.localeCompare(an);
      });
    }
    for (var i = 0; i < items.length; i++) els.grid.appendChild(items[i]);
  }

  function apply() {
    applySort();
    var items = document.querySelectorAll('[data-card]');
    var shown = 0, total = items.length;
    var q = state.q.trim().toLowerCase();
    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var ok = true;
      if (q && haystack(el).indexOf(q) === -1) ok = false;
      if (state.category && el.getAttribute('data-category-key') !== state.category) ok = false;
      if (state.availability && el.getAttribute('data-availability') !== state.availability) ok = false;
      if (state.season) {
        var seasons = (el.getAttribute('data-seasons') || '').split(/\s+/);
        var has = false;
        for (var s = 0; s < seasons.length; s++) if (seasons[s] === state.season) { has = true; break; }
        if (!has) ok = false;
      }
      el.style.display = ok ? '' : 'none';
      if (ok) shown++;
    }
    if (els.results) {
      var active = !!(state.q || state.category || state.availability || state.season);
      els.results.textContent = active ? ('Showing ' + shown + ' of ' + total) : ('' + total + ' items');
    }
    if (els.empty) els.empty.classList.toggle('is-visible', shown === 0);
    syncURL();
  }

  function reset() {
    state.q = ''; state.sort = 'featured'; state.category = ''; state.availability = ''; state.season = '';
    if (els.search) els.search.value = '';
    if (els.sort) els.sort.value = 'featured';
    if (els.category) els.category.value = '';
    if (els.availability) els.availability.value = '';
    syncChipStates();
    apply();
  }

  function wire() {
    if (els.search) {
      els.search.addEventListener('input', function () {
        clearTimeout(searchTimer);
        state.q = els.search.value;
        searchTimer = setTimeout(apply, 160);
      });
    }
    if (els.sort) els.sort.addEventListener('change', function () { state.sort = els.sort.value; apply(); });
    if (els.category) els.category.addEventListener('change', function () { state.category = els.category.value; syncChipStates(); apply(); });
    if (els.availability) els.availability.addEventListener('change', function () { state.availability = els.availability.value; apply(); });
    var groups = chipsGroups();
    for (var i = 0; i < groups.length; i++) {
      (function (g) {
        g.host.addEventListener('click', function (e) {
          var chip = e.target.closest('.chip');
          if (!chip) return;
          setStateFor(g.kind, chip.getAttribute('data-value') || '');
          syncChipStates();
          if (g.kind === 'feed-category' && els.category) els.category.value = state.category;
          apply();
        });
      })(groups[i]);
    }
    if (els.clear) els.clear.addEventListener('click', reset);
  }

  function init() {
    var controls = document.querySelector('[data-controls]');
    if (!controls) return;
    type = controls.getAttribute('data-controls');
    els.grid = document.getElementById('catalogue-grid');
    els.search = document.getElementById('f-search');
    els.sort = document.getElementById('f-sort');
    els.category = document.getElementById('f-category');
    els.availability = document.getElementById('f-availability');
    els.results = document.getElementById('f-results');
    els.empty = document.getElementById('empty-state');
    els.clear = document.getElementById('clear-filters');
    if (els.grid) {
      originalOrder = Array.prototype.slice.call(els.grid.querySelectorAll('[data-card]'));
    }
    readURL();
    syncChipStates();
    wire();
    apply();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
