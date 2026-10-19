/* Share buttons on detail pages — fills network URLs and copies the page link. */
(function () {
  "use strict";

  var url = window.location.href;
  var title = document.title;

  function networkHref(network) {
    var u = encodeURIComponent(url);
    var t = encodeURIComponent(title);
    if (network === "facebook")
      return "https://www.facebook.com/sharer/sharer.php?u=" + u;
    if (network === "whatsapp") return "https://wa.me/?text=" + t + "%20" + u;
    if (network === "linkedin")
      return "https://www.linkedin.com/sharing/share-offsite/?url=" + u;
    return "#";
  }

  var links = document.querySelectorAll("[data-share]");
  Array.prototype.forEach.call(links, function (link) {
    var network = link.getAttribute("data-share");
    link.setAttribute("href", networkHref(network));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });

  function copyFallback(text) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    try {
      document.execCommand("copy");
    } catch (err) {}
    document.body.removeChild(field);
  }

  var copyButtons = document.querySelectorAll("[data-share-copy]");
  Array.prototype.forEach.call(copyButtons, function (button) {
    var label = button.getAttribute("aria-label") || "Copy link";
    button.addEventListener("click", function () {
      function done() {
        button.classList.add("is-copied");
        button.setAttribute("aria-label", "Link copied");
        window.setTimeout(function () {
          button.classList.remove("is-copied");
          button.setAttribute("aria-label", label);
        }, 2000);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () {
          copyFallback(url);
          done();
        });
      } else {
        copyFallback(url);
        done();
      }
    });
  });
})();
