/* Yagya Krishi Udhyog — farm gallery.
   Progressive enhancement: without JavaScript the gallery stays a CSS grid of
   buttons. With JavaScript a Swiper carousel is used on small screens and a
   keyboard-accessible lightbox is available everywhere. */
(function () {
  'use strict';

  var U = window.YK_UTIL;

  var gallery = null;
  var swiper = null;
  var lb = null;
  var lbIndex = 0;
  var lastFocus = null;
  var mq = null;
  var resizeTimer = null;

  function t(key, vars) { return U.t(key, vars); }
  function esc(value) { return U.esc(value); }

  function isCompact() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  function slides() {
    var out = [];
    if (!gallery) return out;
    var nodes = gallery.querySelectorAll('.gallery__slide');
    for (var i = 0; i < nodes.length; i++) {
      var btn = nodes[i];
      var img = btn.querySelector('img');
      out.push({
        el: btn,
        full: btn.getAttribute('data-full') || (img ? (img.currentSrc || img.src) : ''),
        key: btn.getAttribute('data-caption-i18n'),
        alt: img ? (img.getAttribute('alt') || '') : ''
      });
    }
    return out;
  }

  function captionFor(item) {
    if (item.key && window.Lang && window.Lang.has(item.key)) return t(item.key);
    return item.alt || '';
  }

  /* ------------------------------------------------------------- carousel */

  function buildSwiper() {
    if (!gallery || swiper || !window.Swiper) return;
    var prev = document.querySelector('[data-gallery-prev]');
    var next = document.querySelector('[data-gallery-next]');
    gallery.classList.add('is-carousel');
    swiper = new window.Swiper(gallery, {
      slidesPerView: 1.08,
      spaceBetween: 16,
      grabCursor: true,
      watchOverflow: true,
      preventClicks: false,
      keyboard: { enabled: true },
      navigation: prev && next ? { prevEl: prev, nextEl: next } : undefined,
      breakpoints: {
        560: { slidesPerView: 1.6 },
        700: { slidesPerView: 2.1 }
      }
    });
    var nav = document.querySelector('.gallery-nav');
    if (nav) nav.hidden = false;
  }

  function destroySwiper() {
    if (swiper) {
      try { swiper.destroy(true, true); } catch (e) { /* ignore */ }
      swiper = null;
    }
    if (gallery) gallery.classList.remove('is-carousel');
    var nav = document.querySelector('.gallery-nav');
    if (nav) nav.hidden = true;
  }

  /* ------------------------------------------------------------- lightbox */

  function buildLightbox() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button class="lightbox__btn lightbox__btn--close" type="button" data-lb-close aria-label="' +
      esc(t('ui.lightbox_close')) + '">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lightbox__btn lightbox__btn--prev" type="button" data-lb-prev aria-label="' +
      esc(t('ui.lightbox_prev')) + '">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<button class="lightbox__btn lightbox__btn--next" type="button" data-lb-next aria-label="' +
      esc(t('ui.lightbox_next')) + '">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></button>' +
      '<figure class="lightbox__figure"><img alt="" decoding="async">' +
      '<figcaption data-lb-caption></figcaption></figure>';
    lb.addEventListener('click', onLightboxClick);
    document.body.appendChild(lb);
  }

  function renderLightbox() {
    if (!lb) return;
    var list = slides();
    if (!list.length) return;
    if (lbIndex < 0) lbIndex = list.length - 1;
    if (lbIndex >= list.length) lbIndex = 0;
    var item = list[lbIndex];
    var img = lb.querySelector('img');
    var cap = lb.querySelector('[data-lb-caption]');
    if (img) {
      img.src = item.full;
      img.alt = item.alt || captionFor(item);
    }
    if (cap) cap.textContent = captionFor(item);
  }

  function openLightbox(index) {
    buildLightbox();
    if (!lb) return;
    lbIndex = index;
    renderLightbox();
    lastFocus = document.activeElement;
    lb.classList.add('is-open');
    document.body.classList.add('menu-open');
    var close = lb.querySelector('[data-lb-close]');
    if (close) close.focus();
  }

  function closeLightbox() {
    if (!lb || !lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    lastFocus = null;
  }

  function stepLightbox(delta) {
    var list = slides();
    if (!list.length) return;
    lbIndex = (lbIndex + delta + list.length) % list.length;
    renderLightbox();
  }

  function onLightboxClick(e) {
    if (e.target.closest('[data-lb-close]')) {
      closeLightbox();
      return;
    }
    if (e.target.closest('[data-lb-prev]')) {
      stepLightbox(-1);
      return;
    }
    if (e.target.closest('[data-lb-next]')) {
      stepLightbox(1);
      return;
    }
    if (e.target === lb) closeLightbox();
  }

  /* -------------------------------------------------------------- events */

  function onGalleryClick(e) {
    var node = e.target.closest('.gallery__slide');
    if (!node) return;
    var list = slides();
    for (var i = 0; i < list.length; i++) {
      if (list[i].el === node) {
        openLightbox(i);
        return;
      }
    }
  }

  function onKeydown(e) {
    if (!lb || !lb.classList.contains('is-open')) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      closeLightbox();
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepLightbox(-1);
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepLightbox(1);
      return;
    }
    if (e.key === 'Tab') {
      var focusables = lb.querySelectorAll('button');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function onBreakpoint() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (isCompact()) buildSwiper();
      else destroySwiper();
    }, 180);
  }

  function refresh() {
    if (!lb) return;
    var close = lb.querySelector('[data-lb-close]');
    var prev = lb.querySelector('[data-lb-prev]');
    var next = lb.querySelector('[data-lb-next]');
    if (close) close.setAttribute('aria-label', t('ui.lightbox_close'));
    if (prev) prev.setAttribute('aria-label', t('ui.lightbox_prev'));
    if (next) next.setAttribute('aria-label', t('ui.lightbox_next'));
    if (lb.classList.contains('is-open')) renderLightbox();
  }

  function init() {
    gallery = document.querySelector('[data-gallery]');
    if (!gallery) return;
    buildLightbox();
    if (isCompact()) buildSwiper();
    gallery.addEventListener('click', onGalleryClick);
    document.addEventListener('keydown', onKeydown);
    mq = window.matchMedia('(max-width: 767px)');
    if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
    else if (mq.addListener) mq.addListener(onBreakpoint);
    refresh();
  }

  window.YK_GALLERY = { init: init, refresh: refresh };
})();
