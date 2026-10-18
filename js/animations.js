/* Yagya Krishi Udhyog — motion layer.
   Restrained GSAP reveals only. Content is visible without JavaScript, and the
   whole module is skipped when the visitor prefers reduced motion. */
(function () {
  'use strict';

  function prefersReduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function heroIntro() {
    var bits = document.querySelectorAll(
      '.hero__text > *, .page-hero__text > *, .detail-info > *'
    );
    if (!bits.length) return;
    window.gsap.from(bits, {
      y: 18,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.06,
      clearProps: 'transform'
    });
  }

  function scrollReveals() {
    if (!window.ScrollTrigger) return;
    var targets = document.querySelectorAll(
      '.section-head, .row-list__item, .contact-card, .cat-item, .feed-row, .feature, ' +
      '.note, .controls, .accordion, .related .cat-item, .cta-band__grid > *'
    );
    for (var i = 0; i < targets.length; i++) {
      window.gsap.fromTo(
        targets[i],
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          immediateRender: false,
          clearProps: 'transform',
          scrollTrigger: {
            trigger: targets[i],
            start: 'top 92%',
            once: true
          }
        }
      );
    }
  }

  function init() {
    if (!window.gsap || prefersReduced()) return;
    try {
      if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
      heroIntro();
      scrollReveals();
    } catch (e) {
      /* Motion is decorative — never let it break the page. */
    }
  }

  window.YK_ANIM = { init: init };
})();
