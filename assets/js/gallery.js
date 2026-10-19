/* Swiper <768 + lightbox reuse. Minimal static copy. */
(function () {
  'use strict';
  var gallery = null, swiper = null, lb = null, lbIndex = 0, lastFocus = null, mq = null, resizeTimer = null;

  function esc(v){ return String(v||'').replace(/&/g,'&amp;'); }
  function isCompact(){ return window.matchMedia('(max-width: 767px)').matches; }

  function slides(){
    var out=[]; if(!gallery)return out;
    var nodes=gallery.querySelectorAll('.gallery__slide');
    for(var i=0;i<nodes.length;i++){
      var btn=nodes[i], img=btn.querySelector('img');
      out.push({el:btn, full:btn.getAttribute('data-full')||(img?(img.currentSrc||img.src):''), alt:img?img.getAttribute('alt'):''});
    }
    return out;
  }

  function buildSwiper(){
    if(!gallery||swiper||typeof Swiper==='undefined')return;
    var prev=document.querySelector('[data-gallery-prev]'), next=document.querySelector('[data-gallery-next]');
    gallery.classList.add('is-carousel');
    swiper=new Swiper(gallery,{slidesPerView:1.08,spaceBetween:16,grabCursor:true,watchOverflow:true,preventClicks:false,keyboard:{enabled:true},navigation:prev&&next?{prevEl:prev,nextEl:next}:undefined,breakpoints:{560:{slidesPerView:1.6},700:{slidesPerView:2.1}}});
    var nav=document.querySelector('.gallery-nav'); if(nav)nav.hidden=false;
  }
  function destroySwiper(){
    if(swiper){ try{swiper.destroy(true,true);}catch(e){} swiper=null; }
    if(gallery)gallery.classList.remove('is-carousel');
    var nav=document.querySelector('.gallery-nav'); if(nav)nav.hidden=true;
  }

  function buildLightbox(){
    if(lb)return; lb=document.createElement('div'); lb.className='lightbox'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
    lb.innerHTML='<button class="lightbox__btn lightbox__btn--close" type="button" data-lb-close aria-label="Close image viewer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><button class="lightbox__btn lightbox__btn--prev" type="button" data-lb-prev aria-label="Previous image"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button><button class="lightbox__btn lightbox__btn--next" type="button" data-lb-next aria-label="Next image"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></button><figure class="lightbox__figure"><img alt="" decoding="async"><figcaption data-lb-caption></figcaption></figure>';
    lb.addEventListener('click',onLb); document.body.appendChild(lb);
  }
  function renderLightbox(){
    if(!lb)return; var list=slides(); if(!list.length)return;
    if(lbIndex<0)lbIndex=list.length-1; if(lbIndex>=list.length)lbIndex=0;
    var item=list[lbIndex], img=lb.querySelector('img'), cap=lb.querySelector('[data-lb-caption]');
    if(img){ img.src=item.full; img.alt=item.alt||''; }
    if(cap)cap.textContent=item.alt||'';
  }
  function openLb(i){ buildLightbox(); lbIndex=i; renderLightbox(); lastFocus=document.activeElement; lb.classList.add('is-open'); document.body.classList.add('menu-open'); if(window.YK_LOCO)window.YK_LOCO.stop(); var c=lb.querySelector('[data-lb-close]'); if(c)c.focus(); }
  function closeLb(){ if(!lb||!lb.classList.contains('is-open'))return; lb.classList.remove('is-open'); document.body.classList.remove('menu-open'); if(window.YK_LOCO)window.YK_LOCO.start(); if(lastFocus&&lastFocus.focus)lastFocus.focus(); lastFocus=null; }
  function stepLb(d){ var list=slides(); if(!list.length)return; lbIndex=(lbIndex+d+list.length)%list.length; renderLightbox(); }
  function onLb(e){ if(e.target.closest('[data-lb-close]')){e.preventDefault();closeLb();return;} if(e.target.closest('[data-lb-prev]')){e.preventDefault();stepLb(-1);return;} if(e.target.closest('[data-lb-next]')){e.preventDefault();stepLb(1);return;} if(e.target===lb){closeLb();} }
  function onClick(e){ var n=e.target.closest('.gallery__slide'); if(!n)return; var list=slides(); for(var i=0;i<list.length;i++)if(list[i].el===n){openLb(i);return;} }
  function onKey(e){ if(!lb||!lb.classList.contains('is-open'))return; if(e.key==='Escape'||e.key==='Esc'){e.preventDefault();closeLb();return;} if(e.key==='ArrowLeft'){e.preventDefault();stepLb(-1);return;} if(e.key==='ArrowRight'){e.preventDefault();stepLb(1);return;} if(e.key==='Tab'){ var f=lb.querySelectorAll('button'); if(!f.length)return; var a=f[0], b=f[f.length-1]; if(e.shiftKey&&document.activeElement===a){e.preventDefault();b.focus();} else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a.focus();} } }
  function onBp(){ clearTimeout(resizeTimer); resizeTimer=setTimeout(function(){ if(isCompact())buildSwiper(); else destroySwiper(); },180); }
  function init(){ gallery=document.querySelector('[data-gallery]'); if(!gallery)return; buildLightbox(); if(isCompact())buildSwiper(); gallery.addEventListener('click',onClick); document.addEventListener('keydown',onKey); mq=window.matchMedia('(max-width: 767px)'); if(mq.addEventListener)mq.addEventListener('change',onBp); else if(mq.addListener)mq.addListener(onBp); }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init); else init();
})();
