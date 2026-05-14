/* ============================================================
   Altru Radiance — ads-track.js
   Shared conversion tracking helper. Wires every Book Now click
   on a landing page to (a) a GA4 event and (b) a Google Ads
   conversion event. Loaded with `defer` so it never blocks
   rendering.

   ── To activate Google Ads conversion tracking ──
   1. In Google Ads → Tools & Settings → Conversions, create a
      conversion action named "Book Now Click" (category: Submit
      lead form, count: One, value: a dollar value if you can
      attribute one).
   2. Copy the resulting Conversion ID and Conversion Label.
   3. Replace the placeholder string below.
   4. Deploy. New clicks start reporting within ~24 hours.

   Until the placeholder is replaced, GA4 events still fire so
   you can verify clicks in Google Analytics from day one.
   ============================================================ */

(function () {
  'use strict';

  // ── REPLACE THIS PLACEHOLDER WHEN YOU CREATE THE GOOGLE ADS CONVERSION ──
  // Format: 'AW-1234567890/AbCdEfGhIjK_LmNoPqR'
  // Until this is set, only GA4 events fire (which is fine for measurement —
  // Google Ads optimization just won't start until the real ID is in place).
  var GOOGLE_ADS_SEND_TO = 'AW-CONVERSION_ID/CONVERSION_LABEL';

  function fireBookConversion(serviceName) {
    if (typeof window.gtag !== 'function') return;

    // GA4 event — always fires
    window.gtag('event', 'book_now_click', {
      event_category: 'conversion',
      event_label: serviceName || document.title,
      transport_type: 'beacon'
    });

    // Google Ads conversion — only fires if the placeholder has been replaced
    if (GOOGLE_ADS_SEND_TO.indexOf('CONVERSION_ID') === -1) {
      window.gtag('event', 'conversion', {
        send_to: GOOGLE_ADS_SEND_TO,
        event_callback: function () { /* no-op */ }
      });
    }
  }

  // Auto-wire any element with data-book-cta on the page.
  // Page authors don't need to add onclick handlers — they just
  // add the attribute (and optionally data-service="…") to their
  // existing Book Now anchors.
  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('[data-book-cta]');
    buttons.forEach(function (el) {
      el.addEventListener('click', function () {
        fireBookConversion(el.getAttribute('data-service') || '');
      });
    });
  });

  // Expose for any in-page handlers that prefer onclick=trackBookClick(...)
  window.trackBookClick = fireBookConversion;
})();
