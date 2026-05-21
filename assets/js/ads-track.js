/* ============================================================
   Altru Radiance — ads-track.js
   Click-to-book conversion tracking for Google Ads.

   WHY THIS EXISTS:
   Square Appointments hosts the booking confirmation page on
   book.squareup.com (not on our domain), so the standard
   "install gtag on the thank-you page" pattern cannot fire.
   Instead, we fire the conversion event on the OUTBOUND CLICK
   from our landing page to Square. Customer flow:

     Google Ad click  →  altru-radiance landing page
                       →  user clicks "Reserve" button
                       →  THIS SCRIPT fires gtag conversion
                       →  customer goes to Square to book

   Trade-off: a click is not a guaranteed booking (some users
   abandon Square's form). Reported conversions will run ~20-30%
   higher than actual bookings. For cold-start learning, this is
   the correct trade-off — Google Ads needs signal more than
   precision in week one.

   Once we have steady volume (30+ conversions), we can layer in
   server-side offline conversion uploads via Square webhooks
   for true revenue attribution.
   ============================================================ */

(function () {
  'use strict';

  var CONVERSION_ID = 'AW-18164308166';

  // Maps the data-service prefix → { label, value, name }
  // data-service is set on each booking CTA, format "service-location"
  // (e.g. "restorative-facial-hero", "aqua-peel-cta", "lymphatic-nav").
  // We match on prefix so any number of buttons per service all route
  // to the same conversion label.
  var SERVICES = {
    'restorative': {
      label: '6K3vCLilu60cENbwutVD',
      value: 250,
      name: 'Restorative Facial + Buccal'
    },
    'lymphatic': {
      label: 'gQrHCK77va0cENbwutVD',
      value: 250,
      name: 'Soothe Lymphatic Drainage'
    },
    'aqua-peel': {
      label: '5U1PCLTCpK0cENbwutVD',
      value: 300,
      name: 'Korean Aqua Peel'
    }
  };

  // Default for buttons whose data-service doesn't match any known
  // prefix (or has no data-service at all). Falls back to Restorative
  // since it's the signature service and primary ad campaign target.
  var DEFAULT_SERVICE = SERVICES['restorative'];

  function resolveService(dataService) {
    if (!dataService) return DEFAULT_SERVICE;
    var key = dataService.toLowerCase();
    for (var prefix in SERVICES) {
      if (key.indexOf(prefix) === 0) return SERVICES[prefix];
    }
    return DEFAULT_SERVICE;
  }

  function fireBookConversion(dataService) {
    if (typeof window.gtag !== 'function') return;
    var svc = resolveService(dataService);

    // GA4 event — useful for Looker/GA4 reporting separate from Ads
    window.gtag('event', 'book_now_click', {
      event_category: 'conversion',
      event_label: svc.name,
      value: svc.value,
      currency: 'USD',
      transport_type: 'beacon'
    });

    // Google Ads conversion — the one that actually feeds bidding
    window.gtag('event', 'conversion', {
      send_to: CONVERSION_ID + '/' + svc.label,
      value: svc.value,
      currency: 'USD',
      transaction_id: ''  // empty = let Google dedupe by click ID
    });
  }

  // Auto-wire every element with data-book-cta. Page authors add the
  // attribute (and optionally data-service="...") to their existing
  // Reserve anchors — no per-page wiring required.
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
