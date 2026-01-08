/**
 * Era management system for I-/ page
 * Handles cookie-based era selection, theme colors, and exit functionality
 */

(function () {
  "use strict";

  const COOKIE_NAME = "eastisup_era";

  function clearEraCookie() {
    document.cookie = `${COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
  }

  const ERA_COPY = {
    breach: { title: "HELLO CLANCY" },
    sai: { title: "GOOD DAY DEMA" },
    trench: { title: "EAST IS UP" },
    blurryface: { title: "THE FEW, THE PROUD AND THE EMOTIONAL" },
    vessel: { title: "islands of violence" }
  };

  const ERA_THEME = {
    breach: "#E03C31",
    sai: "#53B6CB",
    trench: "#FCE300",
    blurryface: "#E03C31",
    vessel: "#C2D2DF"
  };

  const ERA_TAPES = {
    breach: {
      tl: "/img/tape/breach-top.webp",
      br: "/img/tape/breach-bottom.webp"
    },
    sai: { tl: "/img/tape/sai-top.webp", br: "/img/tape/sai-bottom.webp" },
    trench: {
      tl: "/img/tape/trench-top.webp",
      br: "/img/tape/trench-bottom.webp"
    },
    blurryface: {
      tl: "/img/tape/blurryface-top.webp",
      br: "/img/tape/blurryface-bottom.webp"
    },
    vessel: {
      tl: "/img/tape/vessel-top.webp",
      br: "/img/tape/vessel-bottom.webp"
    }
  };

  // Get current era from cookie
  const cookieMatch = document.cookie.match(/(?:^|;\s*)eastisup_era=([^;]+)/);
  const era = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;

  if (era) {
    // Update page title
    const h1 = document.getElementById("eraTitle");
    const titleText = (ERA_COPY[era] && ERA_COPY[era].title) || "East is Up";
    if (h1) h1.textContent = titleText;

    // Update theme color meta tag
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && ERA_THEME[era]) {
      meta.setAttribute("content", ERA_THEME[era]);
    }

    // Update tape images
    const tapeMap = ERA_TAPES[era];
    if (tapeMap) {
      const tapeImages = document.querySelectorAll("img.tape");
      if (tapeImages[0]) tapeImages[0].src = tapeMap.tl;
      if (tapeImages[1]) tapeImages[1].src = tapeMap.br;
    }
  }

  // Exit tape hold-to-leave functionality
  function initExitTape() {
    const el = document.getElementById("exitTape");
    if (!el) return;

    const holdMs = 1100;
    let rafId = 0;
    let startTime = 0;
    let leaving = false;

    function update(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / holdMs, 1);
      el.style.setProperty("--p", progress.toFixed(3));

      if (progress >= 1 && !leaving) {
        leaving = true;
        clearEraCookie();
        window.location.replace("/");
        return;
      }

      rafId = requestAnimationFrame(update);
    }

    function startHold(e) {
      e.preventDefault();
      if (leaving) return;

      el.classList.add("holding");
      startTime = performance.now();
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    function cancelHold() {
      if (leaving) return;

      el.classList.remove("holding");
      el.style.setProperty("--p", "0");
      cancelAnimationFrame(rafId);
    }

    // Mouse/touch events
    el.addEventListener("pointerdown", startHold);
    window.addEventListener("pointerup", cancelHold);
    window.addEventListener("pointercancel", cancelHold);
    window.addEventListener("blur", cancelHold);

    // Keyboard events
    el.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") startHold(e);
    });
    el.addEventListener("keyup", cancelHold);
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExitTape);
  } else {
    initExitTape();
  }
})();
