/* Yagya Krishi Udhyog — static navigation behaviour (no data injection).
   Handles drawer, dropdowns, header shadow, skip-link, and basic keyboard. */
(function () {
  "use strict";

  var lastFocused = null;

  function drawer() {
    return document.getElementById("mobile-drawer");
  }
  function toggleBtn() {
    return document.querySelector(".menu-toggle");
  }

  function drawerOpen() {
    var d = drawer();
    return d && d.classList.contains("is-open");
  }

  function setDrawer(open) {
    var d = drawer();
    var btn = toggleBtn();
    if (!d || !btn) return;
    d.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    var close = btn.getAttribute("data-close-label") || "Close menu";
    var openLbl = btn.getAttribute("data-open-label") || "Open menu";
    btn.setAttribute("aria-label", open ? close : openLbl);
    document.body.classList.toggle("menu-open", open);
    if (window.YK_LOCO) {
      if (open) window.YK_LOCO.stop();
      else window.YK_LOCO.start();
    }
    if (open) {
      lastFocused = document.activeElement;
      var first = d.querySelector("a, button");
      if (first) first.focus();
    } else if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
      lastFocused = null;
    }
    if (!open) {
      var groups = d.querySelectorAll(
        '.mobile-nav__group[aria-expanded="true"]',
      );
      for (var i = 0; i < groups.length; i++) {
        groups[i].setAttribute("aria-expanded", "false");
        var sub = document.getElementById(
          groups[i].getAttribute("aria-controls"),
        );
        if (sub) sub.style.display = "none";
      }
    }
  }

  function closeDropdowns(except) {
    var btns = document.querySelectorAll(
      '[data-dropdown][aria-expanded="true"]',
    );
    for (var i = 0; i < btns.length; i++) {
      if (except && btns[i] === except) continue;
      btns[i].setAttribute("aria-expanded", "false");
      var menu = btns[i].nextElementSibling;
      if (menu) menu.classList.remove("is-open");
    }
  }

  function onHostClick(e) {
    var el;

    if (e.target.closest(".menu-toggle")) {
      e.preventDefault();
      setDrawer(!drawerOpen());
      return;
    }

    el = e.target.closest("[data-dropdown]");
    if (el) {
      var willOpen = el.getAttribute("aria-expanded") !== "true";
      closeDropdowns(el);
      el.setAttribute("aria-expanded", String(willOpen));
      var menu = el.nextElementSibling;
      if (menu) menu.classList.toggle("is-open", willOpen);
      return;
    }

    el = e.target.closest(".mobile-nav__group");
    if (el) {
      var expanded = el.getAttribute("aria-expanded") === "true";
      el.setAttribute("aria-expanded", String(!expanded));
      var sub = document.getElementById(el.getAttribute("aria-controls"));
      if (sub) sub.style.display = expanded ? "none" : "";
      return;
    }

    if (e.target.closest(".mobile-drawer a")) {
      setDrawer(false);
    }
  }

  function focusablesIn(root) {
    return Array.prototype.filter.call(
      root.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
      function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      },
    );
  }

  function onKeydown(e) {
    if (e.key === "Escape" || e.key === "Esc") {
      if (drawerOpen()) {
        setDrawer(false);
        return;
      }
      closeDropdowns(null);
      return;
    }

    if (e.key !== "Tab" || !drawerOpen()) return;

    var d = drawer();
    var btn = toggleBtn();
    var list = [];
    if (btn) list.push(btn);
    list = list.concat(focusablesIn(d));
    if (!list.length) return;

    var first = list[0];
    var last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (list.indexOf(document.activeElement) === -1) {
      e.preventDefault();
      first.focus();
    }
  }

  function onDocumentClick(e) {
    if (!e.target.closest(".nav-item")) closeDropdowns(null);
  }

  function onScroll() {
    var head = document.querySelector(".site-header");
    if (head) head.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function init() {
    var host = document.getElementById("site-header");
    if (host) host.addEventListener("click", onHostClick);
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("click", onDocumentClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
