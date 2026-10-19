/* Detail page gallery — thumbnail switching (main image swap). */
(function () {
  'use strict';

  var gallery = document.querySelector('[data-detail-gallery]');
  if (!gallery) return;

  var mainWrap = gallery.querySelector('[data-gallery-main]');
  var mainImg = mainWrap && mainWrap.querySelector('img');
  var thumbs = gallery.querySelectorAll('[data-gallery-thumb]');
  if (!mainImg || !thumbs.length) return;

  function select(btn) {
    var full = btn.getAttribute('data-full');
    var img = btn.querySelector('img');
    if (full) mainImg.src = full;
    if (img) {
      mainImg.alt = img.getAttribute('alt') || '';
      if (!full) mainImg.src = img.currentSrc || img.src;
    }
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
