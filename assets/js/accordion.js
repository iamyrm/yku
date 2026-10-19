/* Accordion (FAQ) — CSS grid-rows transition, accessible triggers. */
(function () {
  "use strict";

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest(".accordion__trigger");
    if (!trigger) return;
    var expanded = trigger.getAttribute("aria-expanded") === "true";
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    trigger.setAttribute("aria-expanded", String(!expanded));
    if (panel) panel.classList.toggle("is-open", !expanded);
  });
})();
