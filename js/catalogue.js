/* Yagya Krishi Udhyog — catalogue rendering.
   Builds home previews, index grids, feed category cards and detail pages from
   data/livestock.js, data/animal-feed.js and data/crops.js. Filtered pages are
   re-rendered by js/filters.js through YK_CATALOGUE.renderCards(). */
(function () {
  'use strict';

  var U = window.YK_UTIL;
  var CFG = window.YK_CONFIG || {};

  var FEED_CAT_IMAGES = {
    pig: 'assets/images/animal-feed/pig-feed.svg',
    cattle: 'assets/images/animal-feed/cattle-feed.svg',
    poultry: 'assets/images/animal-feed/poultry-feed.svg',
    goat: 'assets/images/animal-feed/goat-feed.svg',
    other: 'assets/images/animal-feed/other-feed.svg'
  };

  function t(key, vars) { return U.t(key, vars); }
  function bi(obj) { return U.bi(obj); }
  function esc(value) { return U.esc(value); }
  function href(path) { return U.href(path); }

  function collection(type) {
    if (type === 'livestock' || type === 'ls') return window.YK_LIVESTOCK || [];
    if (type === 'feed' || type === 'feed-products') return window.YK_FEED || [];
    if (type === 'crops') return window.YK_CROPS || [];
    return [];
  }

  function bySlug(type, slug) {
    var list = collection(type);
    for (var i = 0; i < list.length; i++) {
      if (list[i].slug === slug) return list[i];
    }
    return null;
  }

  function detailPath(type, slug) {
    if (type === 'livestock' || type === 'ls') return 'livestock/' + slug + '/index.html';
    if (type === 'feed' || type === 'feed-products') return 'animal-feed/' + slug + '/index.html';
    return 'crops/' + slug + '/index.html';
  }

  function indexPath(type) {
    if (type === 'livestock' || type === 'ls') return 'livestock/index.html';
    if (type === 'feed' || type === 'feed-products') return 'animal-feed/index.html';
    return 'crops/index.html';
  }

  function interestFor(type) {
    if (type === 'livestock' || type === 'ls') return 'livestock';
    if (type === 'feed' || type === 'feed-products') return 'feed';
    return 'crops';
  }

  function enquireHref(type, itemName) {
    return href('contact/index.html?interest=' + interestFor(type) +
      '&item=' + encodeURIComponent(itemName || ''));
  }

  function firstSentence(text) {
    var s = String(text || '');
    var m = s.match(/^[^.।!?]+[.।!?]/);
    return (m ? m[0] : s).trim();
  }

  function truncate(text, max) {
    var s = String(text || '');
    if (s.length <= max) return s;
    var cut = s.slice(0, max);
    var space = cut.lastIndexOf(' ');
    return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[,;:\-– ]+$/, '') + '…';
  }

  function badge(availability) {
    var key = availability || 'available';
    return '<span class="badge badge--' + esc(key) + '" data-i18n="avail.' + esc(key) + '">' +
      esc(t('avail.' + key)) + '</span>';
  }

  /* --------------------------------------------------------------- cards */

  function catCard(item, type, options) {
    options = options || {};
    var name = bi(item.name);
    var meta = '';
    if (type === 'livestock' || type === 'ls') {
      meta = '<span>' + esc(bi(item.category)) + '</span>';
    } else if (type === 'crops') {
      var seasons = [];
      var list = item.seasons || [];
      var defs = window.YK_SEASONS || [];
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < defs.length; j++) {
          if (defs[j].key === list[i]) seasons.push(bi(defs[j].label));
        }
      }
      meta = '<span>' + esc(bi(item.category)) + '</span>';
      if (seasons.length) meta += '<span>' + esc(seasons.join(' · ')) + '</span>';
    } else {
      meta = '<span>' + esc(bi(item.category)) + '</span>';
      if (item.productType) meta += '<span>' + esc(bi(item.productType)) + '</span>';
    }

    var desc = type === 'livestock' || type === 'ls'
      ? bi(item.short)
      : truncate(bi(item.description), 150);

    return (
      '<article class="cat-item' + (options.lead ? ' cat-item--lead' : '') + '">' +
      '<div class="cat-item__media">' +
      '<span class="cat-item__badge">' + badge(item.availability) + '</span>' +
      '<img src="' + esc(href(item.image || '')) + '" alt="" width="640" height="480" loading="lazy" decoding="async">' +
      '</div>' +
      '<div class="cat-item__body">' +
      '<p class="cat-item__meta">' + meta + '</p>' +
      '<h3 class="cat-item__title"><a href="' + esc(href(detailPath(type, item.slug))) + '">' +
      esc(name) + '</a></h3>' +
      '<p class="cat-item__desc">' + esc(desc) + '</p>' +
      '<div class="cat-item__actions">' +
      '<a class="btn btn--ghost btn--sm" href="' + esc(href(detailPath(type, item.slug))) + '" data-i18n="ui.view_details">' +
      esc(t('ui.view_details')) + '</a>' +
      '<a class="link" href="' + esc(enquireHref(type, name)) + '" data-i18n="ui.enquire">' +
      esc(t('ui.enquire')) + '</a>' +
      '</div></div></article>'
    );
  }

  function feedRow(item) {
    var name = bi(item.name);
    var meta = '<span>' + esc(bi(item.category)) + '</span>';
    if (item.productType) meta += '<span>' + esc(bi(item.productType)) + '</span>';
    if (item.packageSize) meta += '<span>' + esc(bi(item.packageSize)) + '</span>';
    return (
      '<a class="feed-row" href="' + esc(href(detailPath('feed', item.slug))) + '">' +
      '<span class="feed-row__thumb">' +
      '<img src="' + esc(href(item.image || '')) + '" alt="" width="110" height="82" loading="lazy" decoding="async">' +
      '</span>' +
      '<span class="feed-row__body">' +
      '<span class="feed-row__top">' +
      '<span class="feed-row__name">' + esc(name) + '</span>' + badge(item.availability) +
      '</span>' +
      '<span class="feed-row__meta">' + meta + '</span>' +
      '</span></a>'
    );
  }

  /* Renders an array of items into a container. kind: livestock | crops | feed */
  function renderCards(container, items, kind, options) {
    options = options || {};
    var lead = options.lead && items.length > 1;
    var html = '';
    if (kind === 'feed' && options.style === 'rows') {
      for (var k = 0; k < items.length; k++) html += feedRow(items[k]);
    } else {
      for (var i = 0; i < items.length; i++) {
        html += catCard(items[i], kind, { lead: lead && i === 0 });
      }
    }
    container.innerHTML = html;
  }

  /* ------------------------------------------------------- home previews */

  function renderHomeLists() {
    var nodes = document.querySelectorAll('[data-home-list]');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var kind = node.getAttribute('data-home-list');
      var limit = parseInt(node.getAttribute('data-limit'), 10);
      var items = collection(kind).slice(0, isNaN(limit) ? 6 : limit);
      if (kind === 'feed') {
        renderCards(node, items, 'feed', { style: 'rows' });
      } else if (kind === 'livestock') {
        renderCards(node, items, 'livestock', { lead: true });
      } else {
        renderCards(node, items, kind);
      }
    }
  }

  /* ------------------------------------------------- feed category cards */

  function renderFeedCategories() {
    var node = document.querySelector('[data-catalogue="feed-categories"]');
    if (!node) return;
    var cats = window.YK_FEED_CATEGORIES || [];
    var products = window.YK_FEED || [];
    var html = '';
    for (var i = 0; i < cats.length; i++) {
      var cat = cats[i];
      var count = 0;
      for (var j = 0; j < products.length; j++) {
        if (products[j].categoryKey === cat.key) count++;
      }
      var target = href('animal-feed/index.html?category=' + cat.key + '#products');
      html +=
        '<article class="cat-item">' +
        '<div class="cat-item__media">' +
        '<img src="' + esc(href(FEED_CAT_IMAGES[cat.key] || 'assets/images/animal-feed/feed-bags.svg')) + '"' +
        ' alt="" width="640" height="480" loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="cat-item__body">' +
        '<p class="cat-item__meta"><span data-feed-count="' + esc(cat.key) + '">' +
        esc(t('feed.count_products', { count: String(count) })) + '</span></p>' +
        '<h3 class="cat-item__title"><a href="' + esc(target) + '">' + esc(bi(cat.label)) + '</a></h3>' +
        '<div class="cat-item__actions">' +
        '<a class="btn btn--ghost btn--sm" href="' + esc(target) + '" data-i18n="ui.view_all">' +
        esc(t('ui.view_all')) + '</a></div>' +
        '</div></article>';
    }
    node.innerHTML = html;
  }

  /* ------------------------------------------------------------ detail */

  function specRow(labelKey, valueHTML) {
    return '<tr><th scope="row" data-i18n="' + labelKey + '">' + esc(t(labelKey)) +
      '</th><td>' + valueHTML + '</td></tr>';
  }

  function specRowText(label, valueHTML) {
    return '<tr><th scope="row">' + esc(label) + '</th><td>' + valueHTML + '</td></tr>';
  }

  function specTable(item, type) {
    var rows = '';
    if (type === 'livestock' || type === 'ls') {
      rows += specRow('detail.category', esc(bi(item.category)));
      rows += specRow('detail.availability', badge(item.availability));
      if (item.notes) rows += specRow('ui.notes', esc(bi(item.notes)));
    } else if (type === 'feed' || type === 'feed-products') {
      rows += specRow('detail.category', esc(bi(item.category)));
      if (item.productType) rows += specRow('ui.feed_type', esc(bi(item.productType)));
      rows += specRow('detail.brand', esc(item.brand ? bi(item.brand) : t('ui.not_specified')));
      rows += specRow('detail.package', esc(item.packageSize ? bi(item.packageSize) : t('ui.not_specified')));
      if (item.suitableFor) rows += specRow('ui.suitable_for', esc(bi(item.suitableFor)));
      rows += specRow('detail.availability', badge(item.availability));
      if (item.price) rows += specRow('detail.price', esc(bi(item.price)));
    } else {
      rows += specRow('detail.category', esc(bi(item.category)));
      var seasonDefs = window.YK_SEASONS || [];
      var labels = [];
      var keys = item.seasons || [];
      for (var i = 0; i < keys.length; i++) {
        for (var j = 0; j < seasonDefs.length; j++) {
          if (seasonDefs[j].key === keys[i]) labels.push(bi(seasonDefs[j].label));
        }
      }
      if (labels.length) rows += specRowText(t('detail.seasons'), esc(labels.join(', ')));
      if (item.plantingPeriod) rows += specRow('detail.planting', esc(bi(item.plantingPeriod)));
      if (item.harvestPeriod) rows += specRow('detail.harvest', esc(bi(item.harvestPeriod)));
      rows += specRow('detail.availability', badge(item.availability));
    }
    return '<table class="spec-table"><tbody>' + rows + '</tbody></table>';
  }

  function noticeKeys(type) {
    if (type === 'feed' || type === 'feed-products') return ['notice.dealer', 'notice.price'];
    if (type === 'crops') return ['notice.dates'];
    return ['notice.advice'];
  }

  function detailGallery(item) {
    var gallery = (item.gallery && item.gallery.length) ? item.gallery : [item.image];
    var name = bi(item.name);
    var main =
      '<div class="detail-gallery__main">' +
      '<img id="dg-main" src="' + esc(href(gallery[0])) + '" alt="' + esc(name) + '" width="800" height="600" decoding="async">' +
      '</div>';
    var thumbs = '';
    if (gallery.length > 1) {
      thumbs = '<div class="detail-gallery__thumbs" role="group" aria-label="' +
        esc(t('ui.images')) + '" data-i18n-aria="ui.images">';
      for (var i = 0; i < gallery.length; i++) {
        thumbs +=
          '<button type="button" aria-pressed="' + (i === 0) + '" data-thumb="' + esc(href(gallery[i])) + '"' +
          ' aria-label="' + esc(name + ' — ' + (i + 1) + '/' + gallery.length) + '">' +
          '<img src="' + esc(href(gallery[i])) + '" alt="" loading="lazy" decoding="async"></button>';
      }
      thumbs += '</div>';
    }
    return '<div class="detail-gallery">' + main + thumbs + '</div>';
  }

  function detailActions(item, type) {
    var name = bi(item.name);
    var backKey = 'detail.back_livestock';
    if (type === 'feed' || type === 'feed-products') backKey = 'detail.back_feed';
    else if (type === 'crops') backKey = 'detail.back_crops';
    var waMsg = t('wa.greeting') + '\n' + t('wa.product_prefix') + ' ' + name +
      '\n' + t('wa.product_suffix');
    return (
      '<div class="detail-actions">' +
      '<a class="btn btn--primary" href="' + esc(enquireHref(type, name)) + '" data-i18n="detail.enquire">' +
      esc(t('detail.enquire')) + '</a>' +
      '<a class="btn btn--outline" href="' + esc(U.waUrl(waMsg)) + '" target="_blank" rel="noopener"' +
      ' data-wa-link data-wa-message="' + esc(waMsg) + '">' + esc(t('cta.whatsapp')) +
      ' <span class="visually-hidden">' + esc(name) + '</span></a>' +
      '<a class="btn btn--ghost" href="' + esc(href(indexPath(type))) + '">' +
      esc(t(backKey)) + '</a>' +
      '</div>'
    );
  }

  function relatedBlock(item, type) {
    var all = collection(type);
    var others = [];
    var sameFirst = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].slug === item.slug) continue;
      if (all[i].categoryKey === item.categoryKey) sameFirst.push(all[i]);
      else others.push(all[i]);
    }
    var picks = sameFirst.concat(others).slice(0, 3);
    if (!picks.length) return '';
    var cards = '';
    for (var j = 0; j < picks.length; j++) {
      cards += catCard(picks[j], type);
    }
    var heading = 'detail.related_livestock';
    if (type === 'feed' || type === 'feed-products') heading = 'detail.related_feed';
    else if (type === 'crops') heading = 'detail.related_crops';
    return (
      '<div class="related">' +
      '<header class="section-head"><div>' +
      '<h2 class="h-3" data-i18n="' + heading + '">' + esc(t(heading)) + '</h2>' +
      '</div></header>' +
      '<div class="grid grid--3">' + cards + '</div>' +
      '</div>'
    );
  }

  function setDetailMeta(item, type) {
    var seo = item.seo || {};
    var title = bi(seo.title) || (bi(item.name) + ' | Yagya Krishi Udhyog');
    var desc = bi(seo.description) || truncate(bi(item.description) || bi(item.short), 170);
    document.title = title;
    var m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', desc);
    var ot = document.querySelector('meta[property="og:title"]');
    if (ot) ot.setAttribute('content', title);
    var od = document.querySelector('meta[property="og:description"]');
    if (od) od.setAttribute('content', desc);
    if (CFG.siteDomain) {
      var path = location.pathname.replace(/index\.html$/, '');
      var ou = document.querySelector('meta[property="og:url"]');
      if (ou) ou.setAttribute('content', CFG.siteDomain + path);
      var canon = document.querySelector('link[rel="canonical"]');
      if (canon) canon.setAttribute('href', CFG.siteDomain + path);
    }
  }

  function renderDetail() {
    var root = document.querySelector('[data-detail-type]');
    if (!root) return;
    var type = root.getAttribute('data-detail-type');
    var slug = root.getAttribute('data-detail-slug');
    var item = bySlug(type, slug);
    var crumbs = document.getElementById('detail-crumbs');

    if (!item) {
      root.innerHTML =
        '<div class="empty-state is-visible" style="grid-column:1/-1;">' +
        '<h3>' + esc(t('empty.title')) + '</h3>' +
        '<p>' + esc(t('empty.text')) + '</p>' +
        '<p><a class="btn btn--ghost" href="' + esc(href('index.html')) + '" data-i18n="error.404.home">' +
        esc(t('error.404.home')) + '</a></p></div>';
      var relatedMissing = document.getElementById('detail-related');
      var relatedMissingRoot = document.getElementById('related-root');
      if (relatedMissingRoot) relatedMissingRoot.innerHTML = '';
      if (relatedMissing) relatedMissing.hidden = true;
      return;
    }

    var name = bi(item.name);
    var sectionKey = 'nav.livestock';
    if (type === 'feed' || type === 'feed-products') sectionKey = 'nav.animal_feed';
    else if (type === 'crops') sectionKey = 'nav.crops';

    if (crumbs) {
      crumbs.innerHTML =
        '<li><a href="' + esc(href('index.html')) + '" data-i18n="crumb.home">' + esc(t('crumb.home')) + '</a></li>' +
        '<li><a href="' + esc(href(indexPath(type))) + '" data-i18n="' + sectionKey + '">' +
        esc(t(sectionKey)) + '</a></li>' +
        '<li><span aria-current="page">' + esc(name) + '</span></li>';
    }

    var lead = (type === 'livestock' || type === 'ls')
      ? bi(item.short)
      : firstSentence(bi(item.description));

    var notices = '';
    var keys = noticeKeys(type);
    keys.push('notice.detail');
    for (var i = 0; i < keys.length; i++) {
      notices += '<div class="note" role="note"><span data-i18n="' + keys[i] + '">' +
        esc(t(keys[i])) + '</span></div>';
    }

    root.innerHTML =
      detailGallery(item) +
      '<div class="detail-info">' +
      '<p class="eyebrow">' + esc(bi(item.category)) + '</p>' +
      '<h1>' + esc(name) + '</h1>' +
      '<p>' + badge(item.availability) + '</p>' +
      '<p class="lead">' + esc(lead) + '</p>' +
      specTable(item, type) +
      notices +
      detailActions(item, type) +
      '</div>';

    var related = document.getElementById('detail-related');
    var relatedRoot = document.getElementById('related-root');
    if (related && relatedRoot) {
      var block = relatedBlock(item, type);
      if (block) {
        relatedRoot.innerHTML = block;
        related.hidden = false;
      } else {
        relatedRoot.innerHTML = '';
        related.hidden = true;
      }
    }

    setDetailMeta(item, type);
  }

  /* Catalogue grids that are NOT owned by filters.js (none on index pages,
     but kept for robustness if a grid exists without a controls block). */
  function renderStandaloneCatalogues() {
    if (document.querySelector('[data-controls]')) return;
    var nodes = document.querySelectorAll('[data-catalogue]:not([data-catalogue="feed-categories"])');
    for (var i = 0; i < nodes.length; i++) {
      var type = nodes[i].getAttribute('data-catalogue');
      renderCards(nodes[i], collection(type), type === 'feed-products' ? 'feed' : type);
    }
  }

  function onThumbClick(e) {
    var btn = e.target.closest('[data-thumb]');
    if (!btn) return;
    var main = document.getElementById('dg-main');
    if (main) {
      main.src = btn.getAttribute('data-thumb');
      var img = btn.querySelector('img');
      if (img && img.alt) main.alt = img.alt;
    }
    var group = btn.parentNode;
    var buttons = group.querySelectorAll('[data-thumb]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i] === btn));
    }
  }

  function renderAll() {
    renderHomeLists();
    renderFeedCategories();
    renderStandaloneCatalogues();
    renderDetail();
  }

  function init() {
    renderAll();
    var root = document.querySelector('[data-detail-type]');
    if (root) root.addEventListener('click', onThumbClick);
  }

  window.YK_CATALOGUE = {
    init: init,
    renderAll: renderAll,
    renderCards: renderCards,
    collection: collection,
    bySlug: bySlug,
    detailPath: detailPath,
    indexPath: indexPath
  };
})();
