(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.getElementById("main-nav");
  var yearEl = document.getElementById("year");
  var contactForm = document.getElementById("contact-form");

  var serviceLabels = {
    installazione: "Installazione, montaggio e smontaggio",
    revamping: "Revamping e repowering",
    assistenza: "Assistenza e vendita materiale",
    manutenzione: "Manutenzione, pulizia e lavaggio pannelli",
    certificazione: "Progettazione e certificazione fino a 200 kW",
    altro: "Altro"
  };

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function closeNav() {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Apri menu di navigazione");
    mainNav.classList.remove("is-open");
  }

  function openNav() {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Chiudi menu di navigazione");
    mainNav.classList.add("is-open");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 768px)").matches) {
        closeNav();
      }
    });
  }

  if (header) {
    function onScroll() {
      if (window.scrollY > 8) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var revealSections = document.querySelectorAll(".section--reveal");
  if (revealSections.length && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    revealSections.forEach(function (section) {
      revealObserver.observe(section);
    });
  } else if (revealSections.length) {
    revealSections.forEach(function (section) {
      section.classList.add("is-visible");
    });
  }

  var heroVideo = document.getElementById("hero-video");
  if (heroVideo) {
    var heroSection = heroVideo.closest(".hero--cinematic");
    var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function useStaticHeroMedia() {
      if (heroSection) {
        heroSection.classList.add("hero--static-media");
      }
      heroVideo.pause();
    }

    function tryPlayHeroVideo() {
      if (reducedMotionQuery.matches) {
        useStaticHeroMedia();
        return;
      }

      heroVideo.muted = true;
      var playAttempt = heroVideo.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(function () {
          useStaticHeroMedia();
        });
      }
    }

    if (reducedMotionQuery.matches) {
      useStaticHeroMedia();
    } else {
      heroVideo.addEventListener("error", useStaticHeroMedia);
      tryPlayHeroVideo();

      if ("IntersectionObserver" in window && heroSection) {
        var heroVideoObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (heroSection.classList.contains("hero--static-media")) {
                return;
              }

              if (entry.isIntersecting) {
                tryPlayHeroVideo();
              } else {
                heroVideo.pause();
              }
            });
          },
          { threshold: 0.12 }
        );

        heroVideoObserver.observe(heroSection);
      }
    }

    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", function () {
        if (reducedMotionQuery.matches) {
          useStaticHeroMedia();
        } else if (heroSection) {
          heroSection.classList.remove("hero--static-media");
          tryPlayHeroVideo();
        }
      });
    }
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      var azienda = document.getElementById("azienda").value.trim();
      var referente = document.getElementById("referente").value.trim();
      var email = document.getElementById("email").value.trim();
      var telefono = document.getElementById("telefono").value.trim();
      var servizioKey = document.getElementById("servizio").value;
      var messaggio = document.getElementById("messaggio").value.trim();
      var servizio = serviceLabels[servizioKey] || servizioKey;

      var body = [
        "Richiesta preventivo dal sito Kilowatt",
        "",
        "Azienda: " + azienda,
        "Referente: " + referente,
        "Email: " + email,
        "Telefono: " + (telefono || "Non indicato"),
        "Servizio: " + servizio,
        "",
        "Messaggio:",
        messaggio
      ].join("\n");

      var mailto = "mailto:info@kilowattbo.com"
        + "?subject=" + encodeURIComponent("Richiesta preventivo — " + azienda)
        + "&body=" + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }
})();
