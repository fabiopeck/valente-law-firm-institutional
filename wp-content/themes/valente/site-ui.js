(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initReveal() {
    var selectors = [
      ".bt_bb_headline",
      ".bt_bb_text",
      ".bt_bb_service",
      ".bt_bb_button",
      ".bt_bb_progress_bar",
      ".equipe-foto",
      ".consulta-form",
      ".innerPageMap",
      ".bt_bb_image",
      ".mapaAntesFooter"
    ];
    var nodes = document.querySelectorAll(selectors.join(","));
    nodes.forEach(function (el, i) {
      el.classList.add("js-reveal");
      el.style.setProperty("--reveal-delay", (i % 8) * 70 + "ms");
    });
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  function initWhatsApp() {
    if (document.querySelector(".waFloat")) return;
    var a = document.createElement("a");
    a.className = "waFloat";
    a.href =
      "https://wa.me/550800238458424?text=" +
      encodeURIComponent("Olá, gostaria de uma consulta com a Valente & Associados.");
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", "Abrir WhatsApp");
    a.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
    document.body.appendChild(a);
  }

  function saveCookies(choice) {
    try {
      localStorage.setItem(
        "valente-cookies",
        JSON.stringify({ choice: choice, at: new Date().toISOString() })
      );
    } catch (e) {}
  }

  function showSavedOverlay() {
    var og = document.getElementById("cookieSavedOverlay");
    if (!og) return;
    og.classList.add("is-open");
    document.body.classList.add("cookie-lock");
    setTimeout(function () {
      og.classList.remove("is-open");
      document.body.classList.remove("cookie-lock");
    }, 1000);
  }

  function hideBanner() {
    var bar = document.getElementById("cookieBar");
    if (bar) bar.classList.add("is-hidden");
  }

  function isHomePage() {
    var path = (window.location.pathname || "/").replace(/\\/g, "/");
    var file = path.split("/").pop();
    return path === "/" || path === "" || file === "" || /^index\.html?$/i.test(file);
  }

  function initCookies() {
    if (!isHomePage()) return;
    if (document.getElementById("cookieBar")) return;

    var bar = document.createElement("div");
    bar.id = "cookieBar";
    bar.className = "cookieBar";
    bar.innerHTML =
      '<div class="cookieBarInner">' +
      "<p>Usamos cookies para melhorar sua experiência no site da Valente &amp; Associados.</p>" +
      '<div class="cookieBarActions">' +
      '<button type="button" data-cookie="aceitar">Aceitar</button>' +
      '<button type="button" data-cookie="recusar">Recusar</button>' +
      '<button type="button" class="is-ghost" data-cookie="configurar">Configurar cookies</button>' +
      "</div></div>";

    var overlay = document.createElement("div");
    overlay.id = "cookieSavedOverlay";
    overlay.className = "cookieSavedOverlay";
    overlay.innerHTML =
      '<div class="cookieSavedBox" role="dialog" aria-modal="true" aria-labelledby="cookieSavedTitle">' +
      '<h2 id="cookieSavedTitle">Cookies salvos</h2>' +
      "</div>";

    document.body.appendChild(bar);
    document.body.appendChild(overlay);

    function onChoice(choice) {
      saveCookies(choice);
      hideBanner();
      showSavedOverlay();
    }

    bar.querySelectorAll("[data-cookie]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        onChoice(btn.getAttribute("data-cookie"));
      });
    });

  }

  function isEditable(el) {
    if (!el) return false;
    if (el.closest && el.closest("input, textarea, select, [contenteditable='true']")) {
      return true;
    }
    var tag = (el.tagName || "").toUpperCase();
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
  }

  function initContentGuard() {
    document.documentElement.classList.add("no-copy");

    document.addEventListener("contextmenu", function (e) {
      if (isEditable(e.target)) return;
      e.preventDefault();
    });

    document.addEventListener("copy", function (e) {
      if (isEditable(e.target)) return;
      e.preventDefault();
      if (e.clipboardData) e.clipboardData.setData("text/plain", "");
    });

    document.addEventListener("cut", function (e) {
      if (isEditable(e.target)) return;
      e.preventDefault();
    });

    document.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });

    document.addEventListener("selectstart", function (e) {
      if (isEditable(e.target)) return;
      e.preventDefault();
    });

    document.addEventListener("keydown", function (e) {
      var key = (e.key || "").toLowerCase();
      var combo = e.ctrlKey || e.metaKey;
      if (!combo) return;
      if (isEditable(e.target) && (key === "c" || key === "v" || key === "x" || key === "a")) {
        return;
      }
      if (
        key === "c" ||
        key === "x" ||
        key === "a" ||
        key === "s" ||
        key === "u" ||
        key === "p"
      ) {
        e.preventDefault();
      }
    });
  }

  ready(function () {
    initContentGuard();
    initReveal();
    initWhatsApp();
    initCookies();
  });
})();
