/**
 * Optimized Carousel Component (converted from React)
 * - Pre-computed image colors (no runtime canvas operations)
 * - Proper event listener management
 * - No JSX compilation required
 */

(function () {
  "use strict";

  const COOKIE_NAME = "eastisup_era";

  function setEraCookie(era, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(era)}; Path=/; Expires=${expires}; SameSite=Lax`;
  }

  function handleEraSelect(era) {
    try {
      setEraCookie(era);
    } catch (e) {
      console.error("Failed to set cookie:", e);
    }
  }

  // Slides with pre-computed average colors (no runtime canvas extraction)
  const SLIDES = [
    {
      era: "breach",
      href: "/I-/",
      src: "/img/logos/breach-logo.png",
      alt: "Clancy - Breach",
      color: { r: 224, g: 60, b: 49 } // Pre-computed red
    },
    {
      era: "sai",
      href: "/I-/",
      src: "/img/logos/sai-logo.png",
      alt: "Scaled and Icy",
      color: { r: 83, g: 182, b: 203 } // Pre-computed cyan
    },
    {
      era: "trench",
      href: "/I-/",
      src: "/img/logos/trench-logo.png",
      alt: "Trench",
      color: { r: 252, g: 227, b: 0 } // Pre-computed yellow
    },
    {
      era: "blurryface",
      href: "/I-/",
      src: "/img/logos/blurryface-logo.png",
      alt: "Blurryface",
      color: { r: 224, g: 60, b: 49 } // Pre-computed red
    },
    {
      era: "vessel",
      href: "/I-/",
      src: "/img/logos/bglogo.png",
      alt: "Vessel",
      color: { r: 194, g: 210, b: 223 } // Pre-computed light blue
    }
  ];

  const toRGB = ({ r, g, b }) => `rgb(${r} ${g} ${b})`;
  const toRGBA = ({ r, g, b }, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

  class Carousel {
    constructor(container, slides, options = {}) {
      this.container = container;
      this.slides = slides;
      this.total = slides.length;
      this.index = 0;
      this.loop = options.loop || false;

      this.render();
      this.attachEventListeners();
      this.preloadImages();
    }

    render() {
      // Create slider structure
      const viewport = document.createElement("div");
      viewport.className = "slider-viewport";
      viewport.setAttribute("aria-roledescription", "carousel");

      const track = document.createElement("div");
      track.className = "slider-track";
      this.track = track;

      // Create slides
      this.slides.forEach((slide, i) => {
        const section = document.createElement("section");
        section.className = "slide";
        section.setAttribute("aria-roledescription", "slide");
        section.setAttribute("aria-label", `Slide ${i + 1} of ${this.total}`);

        const link = document.createElement("a");
        link.className = "slide-content";
        link.href = slide.href;

        // Handle era selection on interaction
        const selectEra = () => handleEraSelect(slide.era);
        link.addEventListener("mousedown", selectEra);
        link.addEventListener("click", selectEra);
        link.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") selectEra();
        });

        const img = document.createElement("img");
        img.src = slide.src;
        img.alt = slide.alt || `Slide ${i + 1}`;
        img.draggable = false;
        img.decoding = "async";

        // Eager load first few slides, lazy load rest
        const eager = i < 3;
        img.loading = eager ? "eager" : "lazy";
        img.fetchPriority = i < 2 ? "high" : "low";

        link.appendChild(img);
        section.appendChild(link);
        track.appendChild(section);
      });

      viewport.appendChild(track);

      // Create controls
      const controlsBar = document.createElement("div");
      controlsBar.className = "controlsBar";

      const controlsGroup = document.createElement("div");
      controlsGroup.className = "controlsGroup";
      this.controlsGroup = controlsGroup;

      // Previous button
      this.prevBtn = this.createArrowButton("prev", "Previous", () => this.prev());
      controlsGroup.appendChild(this.prevBtn);

      // Dots
      const dotsContainer = document.createElement("div");
      dotsContainer.className = "dots";
      dotsContainer.setAttribute("role", "tablist");
      dotsContainer.setAttribute("aria-label", "Slide selector");
      this.dotsContainer = dotsContainer;

      this.dots = [];
      for (let i = 0; i < this.total; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.addEventListener("click", () => this.goTo(i));
        this.dots.push(dot);
        dotsContainer.appendChild(dot);
      }

      controlsGroup.appendChild(dotsContainer);

      // Next button
      this.nextBtn = this.createArrowButton("next", "Next", () => this.next());
      controlsGroup.appendChild(this.nextBtn);

      controlsBar.appendChild(controlsGroup);

      // Add to container
      this.container.appendChild(viewport);
      this.container.appendChild(controlsBar);

      this.updateUI();
    }

    createArrowButton(dir, label, onClick) {
      const button = document.createElement("button");
      button.className = "arrow";
      button.type = "button";
      button.setAttribute("aria-label", label);
      button.addEventListener("click", onClick);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");

      const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      polyline.setAttribute("points", dir === "prev" ? "15 18 9 12 15 6" : "9 18 15 12 9 6");

      svg.appendChild(polyline);
      button.appendChild(svg);

      return button;
    }

    goTo(i) {
      if (this.loop) {
        this.index = (i + this.total) % this.total;
      } else {
        this.index = Math.max(0, Math.min(i, this.total - 1));
      }
      this.updateUI();
    }

    next() {
      this.goTo(this.index + 1);
    }

    prev() {
      this.goTo(this.index - 1);
    }

    updateUI() {
      // Update track position
      this.track.style.transform = `translate3d(-${this.index * 100}vw, 0, 0)`;

      // Update dots
      this.dots.forEach((dot, i) => {
        dot.setAttribute("aria-selected", i === this.index ? "true" : "false");
      });

      // Update button states (if not looping)
      if (!this.loop) {
        this.prevBtn.disabled = this.index === 0;
        this.nextBtn.disabled = this.index === this.total - 1;
      }

      // Update accent colors based on current slide
      const color = this.slides[this.index].color;
      const accentSolid = toRGB(color);
      const accentBorder = toRGBA(color, 0.55);
      const accentBg = toRGBA(color, 0.10);
      const accentChip = toRGBA(color, 0.16);
      const accentChipHover = toRGBA(color, 0.24);
      const accentDot = toRGBA(color, 0.30);
      const accentDotBorder = toRGBA(color, 0.45);

      this.controlsGroup.style.setProperty("--accent-solid", accentSolid);
      this.controlsGroup.style.setProperty("--accent-border", accentBorder);
      this.controlsGroup.style.setProperty("--accent-bg", accentBg);
      this.controlsGroup.style.setProperty("--accent-chip", accentChip);
      this.controlsGroup.style.setProperty("--accent-chip-hover", accentChipHover);
      this.controlsGroup.style.setProperty("--accent-dot", accentDot);
      this.controlsGroup.style.setProperty("--accent-dot-border", accentDotBorder);
    }

    attachEventListeners() {
      // Keyboard navigation (created once, uses arrow functions to maintain context)
      this.handleKeydown = (e) => {
        if (e.key === "ArrowLeft") this.prev();
        if (e.key === "ArrowRight") this.next();
      };
      window.addEventListener("keydown", this.handleKeydown);
    }

    preloadImages() {
      // Use requestIdleCallback for low-priority preloading
      const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
      idle(() => {
        this.slides.forEach((slide) => {
          const img = new Image();
          img.decoding = "async";
          img.loading = "eager";
          img.src = slide.src;
        });
      });
    }

    destroy() {
      window.removeEventListener("keydown", this.handleKeydown);
    }
  }

  // Initialize carousel when DOM is ready
  function init() {
    const container = document.getElementById("app");
    if (container) {
      new Carousel(container, SLIDES, { loop: false });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
