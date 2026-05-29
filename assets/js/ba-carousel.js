/* ============================================================
   Altru Radiance — ba-carousel.js
   Shared before/after slider behavior for every .ba-split panel
   on the page. Replaces each page's inline slider init blocks.

   Behavior:
   • Pointer drag updates --split (percent string for clip-path
     and divider positioning) AND --split-num (unitless mirror
     used by ba-carousel.css to drive label fade).
   • Handle is outline-only at rest; gains .is-active on
     interaction for 30%-gold fill. After pointerup, lingers
     800ms before CSS transitions fade it back to outline.
   • Keyboard a11y: arrow keys nudge the split position,
     Home/End jump to 0/100.
   • First-paint affordance hint: the first .ba-split's handle
     briefly flashes active 3× so visitors learn the drag
     affordance. Skipped under prefers-reduced-motion.

   Idempotent: a data-ba-initialized attribute prevents
   double-binding if this script is included multiple times or
   if any leftover inline init also runs.
   ============================================================ */

(function () {
  'use strict';

  var LINGER_MS = 800;
  var DRAG_THRESHOLD = 4;

  function initBASlider(panel) {
    var handle = panel.querySelector('.ba-handle');
    if (!handle) return;

    var dragging = false;
    var startX = 0, startY = 0;
    var lingerTimer = null;

    function activateHandle() {
      if (lingerTimer) { clearTimeout(lingerTimer); lingerTimer = null; }
      handle.classList.add('is-active');
      panel.classList.add('is-active');
    }
    function scheduleDeactivate() {
      if (lingerTimer) clearTimeout(lingerTimer);
      lingerTimer = setTimeout(function () {
        handle.classList.remove('is-active');
        panel.classList.remove('is-active');
      }, LINGER_MS);
    }

    function setSplit(pct) {
      var clamped = Math.min(Math.max(pct, 5), 95);
      panel.style.setProperty('--split', clamped + '%');
      // Unitless mirror so CSS calc() in ba-carousel.css can
      // drive label opacity from the same source of truth.
      panel.style.setProperty('--split-num', clamped);
      var before = panel.querySelector('.ba-before');
      if (before) before.style.clipPath = 'inset(0 ' + (100 - clamped) + '% 0 0)';
      var divider = panel.querySelector('.ba-divider');
      if (divider) divider.style.left = clamped + '%';
      handle.setAttribute('aria-valuenow', Math.round(clamped));
    }

    function getPercent(e) {
      var rect = panel.getBoundingClientRect();
      return ((e.clientX - rect.left) / rect.width) * 100;
    }

    panel.addEventListener('pointerdown', function (e) {
      startX = e.clientX;
      startY = e.clientY;
      dragging = false;
      try { panel.setPointerCapture(e.pointerId); } catch (err) {}
      activateHandle();
    });
    panel.addEventListener('pointermove', function (e) {
      var dx = Math.abs(e.clientX - startX);
      var dy = Math.abs(e.clientY - startY);
      if (!dragging && dx > DRAG_THRESHOLD && dx > dy) dragging = true;
      if (dragging) {
        e.preventDefault();
        setSplit(getPercent(e));
        activateHandle();
      }
    });
    panel.addEventListener('pointerup', function () {
      dragging = false;
      scheduleDeactivate();
    });
    panel.addEventListener('pointercancel', function () {
      dragging = false;
      scheduleDeactivate();
    });
    panel.addEventListener('click', function (e) {
      if (!dragging) {
        setSplit(getPercent(e));
        activateHandle();
        scheduleDeactivate();
      }
    });

    // a11y — keyboard support on the handle
    if (!handle.getAttribute('role')) handle.setAttribute('role', 'slider');
    if (!handle.hasAttribute('tabindex')) handle.setAttribute('tabindex', '0');
    if (!handle.hasAttribute('aria-label')) {
      handle.setAttribute('aria-label', 'Before and after split position');
    }
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    handle.setAttribute('aria-valuenow', '50');
    handle.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 1;
      var current = parseInt(handle.getAttribute('aria-valuenow') || '50', 10);
      var next = current;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = current - step;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = current + step;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = 100;
      else return;
      e.preventDefault();
      setSplit(Math.min(Math.max(next, 0), 100));
      activateHandle();
      scheduleDeactivate();
    });

    setSplit(50);
  }

  function attachAll() {
    var panels = document.querySelectorAll('.ba-split');
    panels.forEach(function (panel) {
      if (panel.dataset.baInitialized === '1') return;
      panel.dataset.baInitialized = '1';
      initBASlider(panel);
    });

    // First-paint affordance hint on the first .ba-split panel.
    var firstPanel = document.querySelector('.ba-split');
    if (!firstPanel) return;
    var firstHandle = firstPanel.querySelector('.ba-handle');
    if (!firstHandle) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var blips = 0;
    var maxBlips = 3;
    function blip() {
      if (blips >= maxBlips) return;
      firstHandle.classList.add('is-active');
      firstPanel.classList.add('is-active');
      setTimeout(function () {
        firstHandle.classList.remove('is-active');
        firstPanel.classList.remove('is-active');
        blips++;
        if (blips < maxBlips) setTimeout(blip, 700);
      }, 550);
    }
    setTimeout(blip, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachAll);
  } else {
    attachAll();
  }
})();
