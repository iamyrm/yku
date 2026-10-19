/* ------------------------------------------------------------------
   animations.js — smooth scrolling (Locomotive Scroll) + GSAP motion
   ------------------------------------------------------------------
   Everything degrades gracefully: if Locomotive or GSAP fails to load,
   or the visitor prefers reduced motion, the site behaves like a plain
   static document with no animations and normal browser scrolling.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var container = document.querySelector('[data-scroll-container]');

  /* ---------------- Locomotive Scroll ---------------- */
  var loco = null;

  function initLoco() {
    if (reducedMotion || !container || typeof window.LocomotiveScroll !== 'function') return null;
    try {
      var instance = new window.LocomotiveScroll({
        el: container,
        smooth: true,
        multiplier: 1,
        smartphone: { smooth: false },
        tablet: { smooth: false },
        reloadOnContextChange: true
      });
      document.documentElement.classList.add('has-locomotive');
      window.YK_LOCO = {
        stop: function () { if (instance) instance.stop(); },
        start: function () { if (instance) instance.start(); },
        resize: function () { if (instance) instance.resize(); }
      };
      return instance;
    } catch (err) {
      return null;
    }
  }

  loco = initLoco();

  /* Deep links (e.g. animal-feed.html?category=pig#products) must land
     on the right spot inside the transformed container. */
  if (loco && window.location.hash) {
    window.addEventListener('load', function () {
      try {
        var target = document.querySelector(window.location.hash);
        if (target) window.setTimeout(function () { loco.scrollTo(target); }, 120);
      } catch (err) {}
    });
  }

  /* Header shadow + "is-scrolled" state follows the real scroll position */
  var header = document.querySelector('.site-header');
  function updateHeader(y) {
    if (!header) return;
    header.classList.toggle('is-scrolled', y > 10);
  }
  if (loco) {
    loco.on('scroll', function (args) { updateHeader(args.scroll.y); });
  } else {
    window.addEventListener('scroll', function () { updateHeader(window.scrollY || 0); }, { passive: true });
  }
  updateHeader(loco && loco.scroll ? loco.scroll.y : (window.scrollY || 0));

  /* ---------------- GSAP + ScrollTrigger ---------------- */
  if (!window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  var ScrollTrigger = window.ScrollTrigger;

  if (loco) {
    /* Keep ScrollTrigger in sync with Locomotive's transform-based scroll */
    loco.on('scroll', ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(container, {
      scrollTop: function (value) {
        if (arguments.length) loco.scrollTo(value, 0, 0);
        return loco.scroll.y;
      },
      getBoundingClientRect: function () {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: container.style.transform ? 'transform' : 'fixed'
    });
  }

  if (reducedMotion) { ScrollTrigger.refresh(); return; }

  /* Hero entrance */
  var heroItems = document.querySelectorAll('.hero__text > *');
  if (heroItems.length) {
    gsap.from(heroItems, {
      y: 28, autoAlpha: 0, duration: 0.9, ease: 'power2.out', stagger: 0.09, delay: 0.1
    });
  }
  var heroMedia = document.querySelectorAll('.hero__media, .hero__inset, .page-hero__media');
  if (heroMedia.length) {
    gsap.from(heroMedia, { y: 24, autoAlpha: 0, duration: 1, ease: 'power2.out', delay: 0.35 });
  }

  /* Section-level reveals */
  document.querySelectorAll('[data-animate="section"]').forEach(function (section) {
    var targets = section.querySelectorAll('[data-animate="up"]');
    if (!targets.length) targets = section.querySelectorAll('.container');
    if (!targets.length) targets = [section];
    gsap.from(targets, {
      y: 34, autoAlpha: 0, duration: 0.85, ease: 'power2.out', stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        scroller: loco ? container : undefined
      }
    });
  });

  /* Cards and rows */
  document.querySelectorAll('[data-animate="cards"]').forEach(function (wrap) {
    gsap.from(wrap.children, {
      y: 26, autoAlpha: 0, duration: 0.7, ease: 'power2.out', stagger: 0.07,
      scrollTrigger: {
        trigger: wrap,
        start: 'top 85%',
        scroller: loco ? container : undefined
      }
    });
  });

  /* Section headings with a rule line */
  document.querySelectorAll('[data-animate="heading"]').forEach(function (heading) {
    gsap.from(heading, {
      y: 18, autoAlpha: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 88%',
        scroller: loco ? container : undefined
      }
    });
  });

  /* Parallax hero images (desktop only) */
  if (window.matchMedia('(min-width: 768px)').matches) {
    document.querySelectorAll('[data-parallax]').forEach(function (media) {
      var depth = parseFloat(media.getAttribute('data-parallax')) || 8;
      gsap.to(media.querySelector('img') || media, {
        yPercent: depth,
        ease: 'none',
        scrollTrigger: {
          trigger: media,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          scroller: loco ? container : undefined
        }
      });
    });
  }

  /* Images may swap the page height once loaded */
  window.addEventListener('load', function () {
    if (loco) loco.resize();
    ScrollTrigger.refresh();
  });
})();
