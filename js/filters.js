/* Yagya Krishi Udhyog — catalogue filters.
   Owns the three filtered index pages (livestock, animal feed, crops):
   search, sort, category/availability selects, chip groups, result counts,
   empty state and URL query-state synchronisation. */
(function () {
  'use strict';

  var U = window.YK_UTIL;
  var type = '';
  var state = { q: '', sort: 'featured', category: '', availability: '', season: '' };
  var els = {};
  var searchTimer = null;

  function t(key, vars) { return U.t(key, vars); }

  function collectionType() {
    if (type === 'feed') return 'feed';
    if (type === 'crops') return 'crops';
    return 'livestock';
  }

  function cardKind() {
    if (type === 'feed') return 'feed';
    if (type === 'crops') return 'crops';
    return 'livestock';
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
    } catch (e) { /* file:// may reject replaceState */ }
  }

  /* ---------------------------------------------------------------- chips */

  function chipGroups() {
    var hosts = document.querySelectorAll('[data-chips]');
    var groups = [];
    for (var i = 0; i < hosts.length; i++) {
      groups.push({ host: hosts[i], kind: hosts[i].getAttribute('data-chips') });
    }
    return groups;
  }

  function chipValues(kind) {
    var values = [{ key: '', label: t('filters.all'), dict: true }];
    var src = kind === 'season' ? (window.YK_SEASONS || []) : (window.YK_FEED_CATEGORIES || []);
    for (var i = 0; i < src.length; i++) {
      values.push({ key: src[i].key, label: U.bi(src[i].label), dict: false });
    }
    return values;
  }

  function stateFor(kind) {
    return kind === 'season' ? state.season : state.category;
  }

  function setStateFor(kind, value) {
    if (kind === 'season') state.season = value;
    else state.category = value;
  }

  function buildChips() {
    var groups = chipGroups();
    for (var g = 0; g < groups.length; g++) {
      var host = groups[g].host;
      var values = chipValues(groups[g].kind);
      var current = stateFor(groups[g].kind);
      var html = '';
      for (var i = 0; i < values.length; i++) {
        var v = values[i];
        html +=
          '<button class="chip" type="button" data-value="' + U.esc(v.key) + '"' +
          ' aria-pressed="' + (current === v.key) + '"' +
          (v.dict ? ' data-i18n="filters.all"' : '') + '>' +
          U.esc(v.label) + '</button>';
      }
      host.innerHTML = html;
    }
  }

  function syncChipStates() {
    var groups = chipGroups();
    for (var g = 0; g < groups.length; g++) {
      var current = stateFor(groups[g].kind);
      var buttons = groups[g].host.querySelectorAll('.chip');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-value') === current));
      }
    }
  }

  /* -------------------------------------------------------------- filtering */

  function haystack(item) {
    var parts = [
      item.name && item.name.en, item.name && item.name.ne,
      item.category && item.category.en, item.category && item.category.ne,
      item.short && item.short.en, item.short && item.short.ne,
      item.description && item.description.en, item.description && item.description.ne,
      item.productType && item.productType.en, item.productType && item.productType.ne
    ];
    return parts.join(' ').toLowerCase();
  }

  function filtered() {
    var list = window.YK_CATALOGUE.collection(collectionType());
    var out = [];
    var q = state.q.trim().toLowerCase();
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (q && haystack(item).indexOf(q) === -1) continue;
      if (state.category && item.categoryKey !== state.category) continue;
      if (state.availability && item.availability !== state.availability) continue;
      if (state.season && (item.seasons || []).indexOf(state.season) === -1) continue;
      out.push(item);
    }
    var locale = U.lang() === 'ne' ? 'ne' : 'en';
    if (state.sort === 'az') {
      out.sort(function (a, b) {
        return U.bi(a.name).localeCompare(U.bi(b.name), locale, { sensitivity: 'base' });
      });
    } else if (state.sort === 'za') {
      out.sort(function (a, b) {
        return U.bi(b.name).localeCompare(U.bi(a.name), locale, { sensitivity: 'base' });
      });
    }
    return out;
  }

  function apply(options) {
    options = options || {};
    if (!els.grid || !window.YK_CATALOGUE) return;

    var items = filtered();
    window.YK_CATALOGUE.renderCards(els.grid, items, cardKind());

    var total = window.YK_CATALOGUE.collection(collectionType()).length;
    var active = !!(state.q || state.category || state.availability || state.season);
    if (els.results) {
      els.results.textContent = active
        ? t('filters.showing', { shown: String(items.length), total: String(total) })
        : t('filters.results_all');
    }

    var none = items.length === 0;
    if (els.empty) els.empty.classList.toggle('is-visible', none);

    if (options.sync !== false) syncURL();
  }

  function reset() {
    state.q = '';
    state.sort = 'featured';
    state.category = '';
    state.availability = '';
    state.season = '';
    if (els.search) els.search.value = '';
    if (els.sort) els.sort.value = 'featured';
    if (els.category) els.category.value = '';
    if (els.availability) els.availability.value = '';
    buildChips();
    apply();
  }

  /* ----------------------------------------------------------------- wiring */

  function wire() {
    if (els.search) {
      els.search.addEventListener('input', function () {
        clearTimeout(searchTimer);
        var value = els.search.value;
        searchTimer = setTimeout(function () {
          state.q = value;
          apply();
        }, 160);
      });
      els.search.addEventListener('search', function () {
        clearTimeout(searchTimer);
        state.q = els.search.value;
        apply();
      });
    }

    if (els.sort) {
      els.sort.addEventListener('change', function () {
        state.sort = els.sort.value || 'featured';
        apply();
      });
    }

    if (els.category) {
      els.category.addEventListener('change', function () {
        state.category = els.category.value;
        syncChipStates();
        apply();
      });
    }

    if (els.availability) {
      els.availability.addEventListener('change', function () {
        state.availability = els.availability.value;
        apply();
      });
    }

    var groups = chipGroups();
    for (var i = 0; i < groups.length; i++) {
      (function (group) {
        group.host.addEventListener('click', function (e) {
          var chip = e.target.closest('.chip');
          if (!chip) return;
          setStateFor(group.kind, chip.getAttribute('data-value') || '');
          syncChipStates();
          if (group.kind === 'feed-category' && els.category) {
            els.category.value = state.category;
          }
          apply();
        });
      })(groups[i]);
    }

    if (els.clear) els.clear.addEventListener('click', reset);
  }

  function init() {
    var controls = document.querySelector('[data-controls]');
    if (!controls || !window.YK_CATALOGUE) return;
    type = controls.getAttribute('data-controls');
    els.grid = document.getElementById('catalogue-grid');
    els.search = document.getElementById('f-search');
    els.sort = document.getElementById('f-sort');
    els.category = document.getElementById('f-category');
    els.availability = document.getElementById('f-availability');
    els.results = document.getElementById('f-results');
    els.empty = document.getElementById('empty-state');
    els.clear = document.getElementById('clear-filters');
    if (!els.grid) return;
    readURL();
    buildChips();
    wire();
    apply({ sync: false });
  }

  /* Re-render labels and results after a language switch. */
  function rerender() {
    if (!type) return;
    buildChips();
    apply({ sync: false });
  }

  window.YK_FILTERS = { init: init, rerender: rerender };
})();
