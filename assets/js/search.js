/* ------------------------------------------------------------------
   search.js — client-side filtering of the static search index
   The index itself lives in the markup (search.html > #search-index)
   so the page works without JavaScript too; this only adds live
   filtering, keyboard navigation and URL sync (?q=...).
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var status = document.getElementById('search-status');
  var index = document.getElementById('search-index');
  if (!input || !results || !index) return;

  /* Build the index from the static markup (no data in JS) */
  var entries = Array.prototype.map.call(index.querySelectorAll('li'), function (li) {
    return {
      title: li.getAttribute('data-title') || '',
      url: li.getAttribute('data-url') || '#',
      group: li.getAttribute('data-group') || '',
      text: (li.textContent || '').toLowerCase().replace(/\s+/g, ' ').trim()
    };
  });
  index.parentNode.removeChild(index);

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function highlight(text, terms) {
    var escaped = terms
      .map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); })
      .filter(Boolean)
      .join('|');
    if (!escaped) return escapeHtml(text);
    try {
      return escapeHtml(text).replace(new RegExp('(' + escaped + ')', 'gi'), '<mark>$1</mark>');
    } catch (err) {
      return escapeHtml(text);
    }
  }

  function render(query) {
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    results.innerHTML = '';

    if (!terms.length) {
      status.textContent = 'Type to search ' + entries.length + ' pages — livestock, feed, crops, guides and legal pages.';
      return;
    }

    var matches = entries.filter(function (entry) {
      return terms.every(function (term) { return entry.text.indexOf(term) !== -1; });
    });

    if (!matches.length) {
      status.textContent = 'No pages matched “' + query + '”. Try “pig”, “feed”, “rice” or “loan”.';
      return;
    }

    status.textContent = matches.length + (matches.length === 1 ? ' page' : ' pages') + ' found.';

    matches.slice(0, 40).forEach(function (entry) {
      var wrap = document.createElement('div');
      wrap.className = 'search-result';
      wrap.innerHTML =
        '<a href="' + escapeHtml(entry.url) + '">' +
        '<span class="search-result__title">' + highlight(entry.title, terms) + '</span>' +
        '<span class="search-result__section">' + escapeHtml(entry.group) + '</span>' +
        '<span>' + highlight(entry.text.slice(0, 160), terms) + '…</span>' +
        '</a>';
      results.appendChild(wrap);
    });
  }

  var timer = null;
  input.addEventListener('input', function () {
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      render(input.value.trim());
      try {
        var url = new URL(window.location.href);
        if (input.value.trim()) url.searchParams.set('q', input.value.trim());
        else url.searchParams.delete('q');
        window.history.replaceState(null, '', url);
      } catch (err) {}
    }, 120);
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      render(input.value.trim());
      var first = results.querySelector('.search-result a');
      if (first && !event.metaKey && !event.ctrlKey && input.value.trim()) first.click();
    }
  });

  /* Restore state from ?q=... */
  var initial = '';
  try { initial = new URL(window.location.href).searchParams.get('q') || ''; } catch (err) {}
  if (initial) {
    input.value = initial;
    render(initial);
  } else {
    render('');
  }
  input.focus();
})();
