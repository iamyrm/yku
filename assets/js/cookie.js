/* Cookie consent bar — fixed bottom, persists choice. */
(function () {
  "use strict";

  var KEY = "yk_cookie_consent";
  var BAR_ID = "cookie-bar";

  function setConsent(v) {
    try {
      localStorage.setItem(KEY, v);
    } catch (e) {}
  }

  function getConsent() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function init() {
    if (getConsent()) return;
    var bar = document.createElement("div");
    bar.id = BAR_ID;
    bar.className = "cookie-bar";
    bar.innerHTML =
      '<div class="container cookie-bar__inner">' +
      '<div class="cookie-bar__text">' +
      '<strong>We use minimal cookies.</strong> This site stores only a small preference in your browser — remembering that you have seen this notice, and any draft you type in the contact form. No tracking. See our <a href="privacy-policy.html">Privacy Policy</a>.' +
      "</div>" +
      '<div class="cookie-bar__actions">' +
      '<button class="btn btn--ghost btn--sm" type="button" data-cookie-decline>Decline</button>' +
      '<button class="btn btn--primary btn--sm" type="button" data-cookie-accept>Accept</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(bar);
    // Append outside scroll container; bar is fixed.
    setTimeout(function () {
      bar.classList.add("is-visible");
    }, 250);

    bar.addEventListener("click", function (e) {
      if (e.target.matches("[data-cookie-accept]")) {
        setConsent("accepted");
        bar.classList.remove("is-visible");
        setTimeout(function () {
          bar.remove();
        }, 500);
      } else if (e.target.matches("[data-cookie-decline]")) {
        setConsent("declined");
        bar.classList.remove("is-visible");
        setTimeout(function () {
          bar.remove();
        }, 500);
      }
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
