/**
 * Optimized tooltip system with RAF batching and single mousemove handler
 * Replaces 4 separate handlers with consolidated approach
 */

// Single mousemove handler with RAF batching for all tooltips
let rafId = null;
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  // Only schedule RAF update if not already scheduled
  if (!rafId) {
    rafId = requestAnimationFrame(() => {
      // Find any visible tooltip and update its position
      const visibleTooltip = document.querySelector('.tooltip[style*="display: block"]');
      if (visibleTooltip) {
        visibleTooltip.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
      rafId = null;
    });
  }
});

/**
 * Setup tooltip show/hide for a specific trigger class
 * @param {string} triggerClass - CSS class for elements that trigger the tooltip
 * @param {string} tooltipId - ID of the tooltip element to show/hide
 */
function setupTooltip(triggerClass, tooltipId) {
  const tooltip = document.getElementById(tooltipId);
  if (!tooltip) return;

  // Initialize tooltip position styles
  tooltip.style.position = 'fixed';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.left = '0';
  tooltip.style.top = '0';

  const triggerElements = document.querySelectorAll(`.${triggerClass}`);

  triggerElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      tooltip.style.display = "block";
    });

    element.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
  });
}

// Setup all tooltips when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  setupTooltip("information", "information-tooltip");
  setupTooltip("discord", "discord-tooltip");
  setupTooltip("banditos", "banditos-tooltip");
  setupTooltip("dema", "dema-tooltip");
});
