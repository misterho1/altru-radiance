/* book-conversion.js — Google Ads "Booking Started" click conversion.
 *
 * Fires a Google Ads conversion when a visitor clicks through to Square to book.
 * This counts booking INTENT (the click to the booking site), NOT a completed
 * booking — the booking itself finishes on squareup.com, off our domain, where
 * we cannot place a tag. Pair this with the /thanks-* page conversions if/when
 * Square is ever configured to redirect completed bookings back to the site.
 *
 * Wiring:
 *   - Needs the Google Ads tag loaded (gtag config AW-18164308166) — present
 *     site-wide as of the Layer 2 change.
 *   - Bound to the "Booking Started" conversion action (Secondary goal) so it
 *     informs reporting without driving Maximize-Conversions bidding.
 *
 * ACTIVATION: set SEND_TO to 'AW-18164308166/<label>' from the Booking Started
 * conversion action, then bump the ?v= query on the <script> tags that load this
 * file (immutable cache — see tasks/lessons.md L8). While SEND_TO is empty this
 * file is a deliberate no-op so nothing fires with a bad/blank label.
 */
(function () {
  'use strict';

  // From the "Booking Started" action in Google Ads (account 857-072-1509).
  // EMPTY = dormant. Example once set: 'AW-18164308166/AbCdEf12345'.
  var SEND_TO = '';

  if (!SEND_TO) return;                     // dormant until the label is set
  if (typeof window.gtag !== 'function') return;  // needs the Ads gtag

  var fired = false;                        // one conversion per pageview (no multi-click inflation)

  document.addEventListener('click', function (e) {
    if (fired || !e.target || !e.target.closest) return;
    var link = e.target.closest('a[href*="squareup.com"]');
    if (!link) return;
    fired = true;
    // Links open in a new tab (target=_blank), so this page stays alive and the
    // gtag beacon completes. Capture phase ensures we fire before navigation.
    window.gtag('event', 'conversion', { send_to: SEND_TO });
  }, true);
})();
