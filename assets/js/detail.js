/* Detail page gallery — thumbnail switching (main image swap). */
(function () {
  'use strict';

  var gallery = document.querySelector('[data-detail-gallery]');
  if (!gallery) return;

  var mainImg = gallery.querySelector('img[data-gallery-main]');
  if (!mainImg) {
    var wrap = gallery.querySelector('[data-gallery-main]');
    if (wrap) mainImg = wrap.tagName === 'IMG' ? wrap : wrap.querySelector('img');
  }
  if (!mainImg) mainImg = gallery.querySelector('.detail-gallery__main img');

  var thumbs = gallery.querySelectorAll('[data-gallery-thumb]');
  if (!mainImg || !thumbs.length) return;

  function swap(full, thumbImg) {
    mainImg.removeAttribute('srcset');
    mainImg.removeAttribute('sizes');
    if (full) mainImg.src = full;
    else if (thumbImg) mainImg.src = thumbImg.currentSrc || thumbImg.src;
    if (thumbImg && thumbImg.alt) mainImg.alt = thumbImg.alt;
  }

  function select(btn) {
    var full = btn.getAttribute('data-full');
    var img = btn.querySelector('img');
    swap(full, img);
    for (var i = 0; i < thumbs.length; i++) {
      thumbs[i].setAttribute('aria-pressed', String(thumbs[i] === btn));
    }
  }

  gallery.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-gallery-thumb]');
    if (!btn) return;
    select(btn);
  });

  gallery.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var list = Array.prototype.slice.call(thumbs);
    var current = document.activeElement;
    var idx = list.indexOf(current);
    if (idx === -1) return;
    e.preventDefault();
    var next = e.key === 'ArrowRight' ? (idx + 1) % list.length : (idx - 1 + list.length) % list.length;
    list[next].focus();
    select(list[next]);
  });
})();
