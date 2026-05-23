# Square Appointments — Per-Service Redirect Setup

> **TEMPORARY URL STATE (2026-05-15 → DNS migration day).** While DNS is still pointed at the old host, all URLs in this walkthrough use `altru-radiance.pages.dev` — the Cloudflare Pages deployment URL. The moment the custom domain DNS flips to Cloudflare, swap every `altru-radiance.pages.dev` in Square's redirect settings back to `altruradiance.com`. The thank-you pages and conversion tags are identical on both domains; only the hostname changes.

Walkthrough for Mechelle. Configures Square Appointments to send each customer to the correct thank-you page after they book, so Google Ads can attribute conversions to the right service and the right campaign.

This document is self-contained. You should be able to do the entire setup from this file without asking anyone for help.

---

## Why we are doing this

Three services on altru-radiance.pages.dev each have their own thank-you page with its own Google Ads conversion tag:

| Service | Price | Duration | Thank-you URL |
|---|---|---|---|
| Restorative Facial + Buccal Release | 250 | 110 min | https://altru-radiance.pages.dev/thanks-restorative |
| Soothe Lymphatic Drainage | 250 | 110 min | https://altru-radiance.pages.dev/thanks-soothe |
| Procell Microchanneling | 300 | 100 min | https://altru-radiance.pages.dev/thanks-procell |

When a customer finishes booking on Square, Square needs to send their browser to the correct one of those three URLs. The thank-you page loads, the Google Ads tag fires, and the conversion is recorded against the correct service and campaign.

If we send every booking to a single thank-you URL, every campaign looks equally effective and we cannot tell which ad is producing which kind of booking. This wastes ad budget.

---

## Before you start

You will need:

1. The Square Dashboard login for Altru Radiance (the email and password Mechelle uses to manage Square Appointments).
2. A laptop or desktop computer. Do not attempt this on a phone — Square's web settings are difficult to navigate on mobile.
3. Google Chrome installed.
4. The Google Tag Assistant Chrome extension installed. Install link: https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk — if that link is dead, search the Chrome Web Store for "Tag Assistant Companion" by Google.
5. About 30 minutes of uninterrupted time. Do this when no customers are in the room.

You do NOT need a developer. Every step in this document is something Mechelle can do herself.

---

## Step 1 — Confirm you are in Square Appointments (not Square POS or Square Online)

Square sells several products that share a dashboard but behave differently. We are working with **Square Appointments** specifically. Square Online is the e-commerce storefront product. Square POS is the in-person point-of-sale product. The redirect setting we need exists only inside Square Appointments.

1. Go to https://squareup.com/login and sign in with the Altru Radiance Square account.
2. After login you land on the Square Dashboard. Look at the left-hand navigation sidebar.
3. You should see an item called **Appointments** in the sidebar. If you see it, you have Square Appointments enabled and you can proceed.
4. If you do NOT see **Appointments** in the sidebar, click your business name in the top-right, then click **Account & Settings**, then look under **Business** → **Locations** to confirm that the Altru Radiance location has Appointments enabled. If it does not, you are on the wrong Square product and need to enable Square Appointments first. Contact Square support before continuing.

---

## Step 2 — Find your current Square Appointments plan

The redirect-after-booking feature is available on some Square Appointments plans and not others. We need to know which plan you are on before we know which path to take.

1. From the Square Dashboard, click your business name or the gear icon in the top-right corner.
2. Click **Account & Settings**.
3. In the left submenu, click **Pricing & Subscriptions** (sometimes labeled **Subscriptions & Billing**).
4. Look at the **Square Appointments** row. The plan name will be one of:
   - **Free**
   - **Plus**
   - **Premium**
5. Write down which plan you are on. You will need this in Step 3.

As of 2026, the per-service custom redirect URL feature is only available on **Plus** and **Premium** tiers. The **Free** tier does not expose this setting, so we will use the fallback JavaScript method in that case.

If your plan does not show up at all, or if Square has renamed the tiers (Square has rebranded its plans more than once), look for the row that mentions **custom booking flow**, **custom confirmation page**, or **redirect URL** in the features list. If any of those words appear in your plan's feature list, you have the feature.

---

## Step 3 — Choose your path

There are two paths through the rest of this walkthrough. Use the table below to pick yours.

| Your situation | Go to |
|---|---|
| Plan is Plus or Premium and you see a redirect option in Square's online booking settings | **Path A — Per-Service Redirect (preferred)** |
| Plan is Free, OR you cannot find any redirect setting in Square's UI | **Path B — Single Redirect + JavaScript Fallback** |

If you are not sure yet, start with Path A. If you cannot find the setting Path A asks you to find, jump to Path B.

---

# Path A — Per-Service Redirect (preferred)

This is the cleanest setup. Each of the three services gets its own redirect URL configured inside Square. After a customer books a specific service, Square sends them straight to that service's thank-you page.

## A1. Open the Online Booking settings

1. From the Square Dashboard, click **Appointments** in the left sidebar.
2. In the Appointments submenu, click **Settings**.
3. In the Settings page, find the section called **Online Booking** (sometimes shown as **Online Booking Site** or **Booking Site Settings**). Click into it.
4. You should now see a settings page for your customer-facing booking site. The URL of this page will include `/appointments/settings/online-booking` or similar.

If you cannot find **Online Booking** under Appointments → Settings, try these alternate paths Square has used in the past:

- **Square Dashboard → Online → Online Booking → Settings**
- **Square Dashboard → Appointments → Online Booking → Customer Settings**
- **Square Dashboard → Settings → Booking Site**

If none of these reveal a booking-site settings page, your plan likely does not expose this and you should go to **Path B**.

## A2. Find the After-Booking Redirect setting

Inside the Online Booking settings page, look for any of the following section headings:

- **Receipts & Communications**
- **Confirmation Page**
- **After Booking**
- **Booking Confirmation**
- **Post-Booking Redirect**
- **Custom Confirmation URL**

The setting we want is a text field that accepts a full URL (it must start with `https://`) and is described as "where to send the customer after they book" or similar wording.

1. Click into the section that contains this setting.
2. If the setting is at the **booking-site level** (one URL for all bookings, not per service), note that — we will still use it, but the URL needs to be a single page that handles all three services. In that case, jump to **Path B**.
3. If the setting is at the **per-service level** (each service has its own URL field), continue to A3.

Square shows this setting in different places depending on plan and account age. If you find a single global redirect setting but not a per-service one, the per-service version may still exist further down inside the individual service editor (next step).

## A3. Open the first service for editing

1. Go back to **Appointments** in the left sidebar.
2. Click **Services** (sometimes labeled **Service Library** or **Services & Categories**).
3. You should see a list of all the services Altru Radiance offers. Find **Restorative Facial + Buccal Release** and click on its name to open the service editor.

## A4. Set the redirect for Restorative Facial

Inside the service editor for Restorative Facial + Buccal Release:

1. Scroll down through the service's settings (Name, Description, Duration, Price, Staff, etc.).
2. Look for a section called **Online Booking** or **Booking Settings** or **Advanced** within this service's editor.
3. Inside that section, look for a field labeled one of:
   - **Custom Confirmation URL**
   - **After-Booking Redirect URL**
   - **Redirect after booking**
   - **Post-booking URL**
4. Paste this exact URL into that field, with no extra spaces:

   ```
   https://altru-radiance.pages.dev/thanks-restorative
   ```

5. Click **Save** at the bottom of the service editor.

If you scroll the entire service editor and there is no redirect field inside it (only a global one at the booking-site level), Square's per-service redirect is not exposed on your plan. Stop Path A and go to **Path B**.

## A5. Set the redirect for Soothe Lymphatic Drainage

1. Return to **Appointments → Services**.
2. Click **Soothe Lymphatic Drainage** to open it.
3. Find the same redirect URL field you used in A4.
4. Paste this exact URL:

   ```
   https://altru-radiance.pages.dev/thanks-soothe
   ```

5. Click **Save**.

## A6. Set the redirect for Procell Microchanneling

1. Return to **Appointments → Services**.
2. Click **Procell Microchanneling** to open it.
3. Find the redirect URL field.
4. Paste this exact URL:

   ```
   https://altru-radiance.pages.dev/thanks-procell
   ```

5. Click **Save**.

## A7. Verify per-service redirects work

This is the most important part. Do not skip it.

1. Open a brand-new Chrome window in **Incognito mode** (Ctrl+Shift+N). This makes sure you are not signed in as the business owner — Square sometimes shows different flows to logged-in admins.
2. Click the Tag Assistant icon in the Chrome toolbar (top-right of Chrome) and click **Enable**. If you do not see the icon, click the puzzle-piece icon in Chrome's toolbar, find Tag Assistant in the list, and pin it.
3. Go to your live booking site URL. This is typically `https://book.squareup.com/...` with your business slug, or whatever URL is shown at the top of **Appointments → Online Booking** in your dashboard.
4. Book **Restorative Facial + Buccal Release** end-to-end as a test customer. Use your own email and any future appointment slot.
5. After you complete the booking, your browser should automatically redirect to:

   ```
   https://altru-radiance.pages.dev/thanks-restorative
   ```

   Confirm the URL bar shows exactly that. If it shows a Square confirmation page instead, the redirect is not configured and you should re-check A4.
6. On the thank-you page, click the Tag Assistant icon. Tag Assistant should show a green icon and list the Google Ads conversion tag for the Restorative service. If it shows yellow or red, the conversion tag is misfiring — see the Troubleshooting section.
7. Cancel the test appointment from your Square Dashboard so it does not block a real customer slot.
8. Repeat steps 4–7 for **Soothe Lymphatic Drainage**. Expected redirect URL: `https://altru-radiance.pages.dev/thanks-soothe`.
9. Repeat steps 4–7 for **Procell Microchanneling**. Expected redirect URL: `https://altru-radiance.pages.dev/thanks-procell`.

If all three services redirect correctly and Tag Assistant shows green on each thank-you page, you are done. You can stop reading here.

If any test fails, continue to **Path B** below as a fallback — it works regardless of plan tier.

---

# Path B — Single Redirect + JavaScript Fallback

Use this path if any of the following are true:

- Your Square plan does not expose a per-service redirect URL field.
- Square only allows one global redirect URL for the whole booking site.
- You followed Path A and the test bookings did not redirect to the right pages.

In Path B, every booking redirects to a single page (`/thanks`) with a query parameter that names the service. JavaScript on that page reads the parameter and fires the matching Google Ads conversion tag.

**Important honesty check:** Square's standard booking flow does NOT let you append a custom query parameter that varies by service. If your Square plan gives you a single global redirect field with no per-service control, you have two sub-options:

- **B-Option-1:** Configure the global redirect to send to `https://altru-radiance.pages.dev/thanks` and have JavaScript on that page detect which service was booked by reading the page that Square's confirmation token resolves to (rarely workable — Square does not pass service info in the redirect by default).
- **B-Option-2 (recommended):** Configure the global redirect to `https://altru-radiance.pages.dev/thanks` and fire a **single combined conversion event** in Google Ads, then separate the services using **Google Ads campaign attribution** (each service has its own campaign, so the conversion is attributed by which ad the user clicked, not by which service they booked).

We will set up **B-Option-2** below. It is the cleanest practical solution when per-service redirect is unavailable.

If your Square plan does allow you to append a query parameter to the redirect URL (some Premium accounts can — look for a **redirect template** or **redirect with variables** feature), use **B-Option-3** further down, which is the truly per-service version.

## B1. Configure the global redirect in Square

1. From the Square Dashboard, go to **Appointments → Settings → Online Booking** (or whichever path from Step A1 worked for you).
2. Find the **Confirmation Page** or **After Booking** section.
3. In the redirect URL field, paste:

   ```
   https://altru-radiance.pages.dev/thanks
   ```

4. Click **Save**.

## B2. Create the /thanks page on altru-radiance.pages.dev

If the file `/thanks` does not exist yet on altru-radiance.pages.dev, create it. The page should be a standard thank-you page that contains the JavaScript snippet shown in B3.

The site is a static HTML site served from Cloudflare Pages (per the Altru Radiance project notes). The thank-you page lives in the site repo as `thanks.html` at the root, alongside `thanks-restorative.html`, `thanks-soothe.html`, and `thanks-procell.html`.

## B3. JavaScript snippet for the fallback page

Paste this into `thanks.html`, inside the `<head>` tag and before the closing `</head>`. This snippet reads the query parameter `?service=...` from the URL and fires the matching Google Ads conversion tag.

Replace `AW-XXXXXXXXX/YYYYYYYYY` placeholders with the real conversion IDs for each service from the Google Ads account. You can find each conversion ID inside Google Ads under **Tools → Conversions** — each of the three thank-you pages already has one configured.

```html
<!-- Google tag (gtag.js) base -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX');
</script>

<!-- Per-service conversion firing -->
<script>
(function () {
  // Map of service slug -> Google Ads conversion send_to ID
  var conversions = {
    restorative: 'AW-XXXXXXXXX/REST_CONV_ID',
    soothe:      'AW-XXXXXXXXX/SOOTHE_CONV_ID',
    procell:     'AW-XXXXXXXXX/PROCELL_CONV_ID'
  };

  // Service-specific conversion values (purchase price)
  var values = {
    restorative: 250,
    soothe:      250,
    procell:     300
  };

  // Read ?service= from the URL
  var params = new URLSearchParams(window.location.search);
  var service = (params.get('service') || '').toLowerCase().trim();

  if (conversions[service]) {
    gtag('event', 'conversion', {
      send_to: conversions[service],
      value: values[service],
      currency: 'USD',
      transaction_id: params.get('booking_id') || ''
    });

    // Optional: update visible thank-you copy based on service
    document.addEventListener('DOMContentLoaded', function () {
      var labels = {
        restorative: 'Restorative Facial + Buccal Release',
        soothe:      'Soothe Lymphatic Drainage',
        procell:     'Procell Microchanneling'
      };
      var el = document.getElementById('service-name');
      if (el && labels[service]) el.textContent = labels[service];
    });
  } else {
    // Fallback: no recognizable service param — fire a generic booking event
    gtag('event', 'conversion', {
      send_to: 'AW-XXXXXXXXX/GENERIC_CONV_ID',
      currency: 'USD'
    });
  }
})();
</script>
```

The snippet above does four things:

1. Loads the Google tag base library.
2. Reads the `service` URL parameter.
3. Fires the conversion tag matching that service, with the correct dollar value.
4. Falls back to a generic conversion if the parameter is missing or unknown.

## B4. Confirm Square can append a query parameter (B-Option-3)

Test whether your Square plan honors query strings in the redirect URL. Some plans strip them, some pass them through verbatim.

1. In the Square redirect URL field, replace the current value with:

   ```
   https://altru-radiance.pages.dev/thanks?service=restorative
   ```

2. Save.
3. Run a test booking for the Restorative service.
4. After booking, check the URL bar on the thank-you page.
   - If it shows `https://altru-radiance.pages.dev/thanks?service=restorative`, Square preserved the query string. You can use a separate hard-coded URL for each service. **Skip to B5.**
   - If it shows just `https://altru-radiance.pages.dev/thanks` (the `?service=` part was stripped), Square is rewriting the URL and you must use **B-Option-2** instead. **Skip to B6.**

## B5. Per-service redirect with query strings (if B4 passed)

If Square preserved the query string in B4, set each service's redirect URL inside Square individually:

| Service | Redirect URL |
|---|---|
| Restorative Facial + Buccal Release | `https://altru-radiance.pages.dev/thanks?service=restorative` |
| Soothe Lymphatic Drainage | `https://altru-radiance.pages.dev/thanks?service=soothe` |
| Procell Microchanneling | `https://altru-radiance.pages.dev/thanks?service=procell` |

Steps:

1. Open **Appointments → Services → Restorative Facial + Buccal Release**.
2. Set the after-booking redirect to `https://altru-radiance.pages.dev/thanks?service=restorative`.
3. Save.
4. Repeat for **Soothe Lymphatic Drainage** with `?service=soothe`.
5. Repeat for **Procell Microchanneling** with `?service=procell`.
6. Go to **B7 — Verification** below.

If the per-service redirect field is not available in your plan, but the query string is preserved at the global level, you have a problem: the global redirect is one fixed URL and cannot vary by service. In that case use **B6**.

## B6. Campaign-level attribution (if no per-service control)

If Square only supports a single global redirect URL and no query parameter manipulation, set the global redirect to:

```
https://altru-radiance.pages.dev/thanks
```

Fire a single "booking completed" conversion on that page. Inside Google Ads, you already have three campaigns (one per service). Because Google Ads attributes the conversion to the campaign that delivered the click that led to the booking, you can still see which campaign produced which booking, even though the website tag itself is generic.

The trade-off: if someone clicks two different campaigns before booking, Google Ads' default last-click attribution may credit the wrong service campaign. For Altru Radiance's volume this is acceptable.

Steps:

1. Make `thanks.html` fire a single generic conversion tag (you can remove the per-service mapping from the snippet in B3 and replace it with one simple `gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/GENERIC_CONV_ID' })` call).
2. In Google Ads, make sure each of the three service campaigns is set to use this single conversion as its primary conversion action.
3. Use the **Campaign** column in Google Ads reporting (not the **Conversion Action** column) to see which campaign produced bookings.

## B7. Verification (Path B)

Same verification process as Path A, but for the fallback flow:

1. Open Chrome Incognito (Ctrl+Shift+N) and enable Tag Assistant.
2. Visit your live Square booking page.
3. Book the **Restorative** service end-to-end.
4. After booking, confirm you land at `https://altru-radiance.pages.dev/thanks?service=restorative` (or `/thanks` if you went with B6).
5. Tag Assistant should show green and list the conversion tag firing.
6. If you used B5: also confirm the page text (via the `#service-name` element in the snippet) shows the correct service name. If you used B6: confirm the generic conversion fires.
7. Cancel the test booking.
8. Repeat for Soothe and Procell.

---

## Step 4 — Sanity check the Google Ads side

After Square redirects are working and Tag Assistant shows green on each thank-you page, do one final check inside Google Ads to confirm conversions are being recorded server-side.

1. Wait at least 3 hours after your test bookings — Google Ads delays new conversion reporting.
2. Sign in to Google Ads.
3. Go to **Tools → Conversions**.
4. For each of the three conversions (Restorative, Soothe, Procell), check the **Last Recorded Conversion** column. You should see your test booking time there.
5. If a conversion shows no recorded activity, the tag is not firing in production. Re-run the test booking and watch Tag Assistant carefully — the green status must persist for at least 3 seconds after page load.

---

## Step 5 — Lock it in

Once everything is verified:

1. In Square, mark a private note on each service inside its description (only visible to staff, not customers) saying "Custom redirect configured to /thanks-[service]". This way if Square's UI ever shows a warning that the redirect is "unset", future Mechelle remembers it was intentional.
2. In Google Ads, screenshot the **Conversions** page showing each service's last-recorded conversion timestamp. Save the screenshot to the Altru Radiance ops folder with today's date. This is your proof the system worked on the day you set it up — useful later when you wonder if a sudden dip in conversions is real or a tag breakage.
3. Note the setup date on the Altru Radiance ops checklist.

---

## Troubleshooting

### "I cannot find the redirect URL setting anywhere in Square"

This means your plan does not expose it. Two options:

1. **Upgrade your Square Appointments plan** to Plus or Premium (check current pricing at squareup.com/us/en/appointments/pricing). The redirect feature plus several other useful booking customizations come with the upgrade. The monthly cost is usually less than one Restorative Facial appointment, so it pays for itself quickly.
2. **Use Path B with B6 (single global redirect)** and accept campaign-level attribution. This works on the Free tier as long as Square exposes any redirect field at all. If even the Free tier does not show a redirect field, you cannot do this through Square's settings and would need to switch booking platforms or upgrade.

### "The redirect works but the URL bar shows extra Square parameters appended"

Square sometimes appends booking-confirmation tokens to the redirect URL, ending up with something like `https://altru-radiance.pages.dev/thanks-restorative?bookingId=ABC123`. This is harmless. The conversion tag on the thank-you page does not care about extra parameters. Leave it alone.

### "Tag Assistant shows yellow or red on the thank-you page"

1. Open Chrome DevTools (F12), go to the **Network** tab, filter by `google` or `gtag`, and reload the page.
2. Look for the request to `googleads.g.doubleclick.net` or `google-analytics.com/g/collect`. It should return status 200 or 204. If it shows blocked or red, check Cloudflare's settings — sometimes a security rule strips the request.
3. If the request never happens at all, the gtag base script did not load. Check that the `<script async src="...gtag/js?id=AW-XXXXXXXXX">` line is in the page's `<head>` and that the AW-XXXXXXXXX placeholder is replaced with your real ID.
4. If the request happens but Google Ads still does not record the conversion 24 hours later, the conversion's **conversion linker** may not be set up. In Google Ads, open the conversion's settings, scroll to **Tag setup**, and make sure **Use Auto-Tagging** is on.

### "I tested a booking but no redirect happened — Square just shows its own confirmation screen"

1. Verify you actually saved the redirect URL inside the service editor. Go back into the service, scroll to the redirect field, and confirm the URL is still there. Square's editor sometimes silently drops the value if Save was not clicked at the bottom (not the top).
2. Verify the URL starts with `https://`. Square rejects URLs that start with `http://` and silently falls back to its own confirmation page in some plans.
3. If you booked while logged in as the business owner, log out and try again as a real customer in Incognito mode. Square sometimes shows admin views to logged-in owners that bypass the redirect.

### "The redirect fires but lands on the wrong service's thank-you page"

You crossed wires when pasting URLs. Go back to Appointments → Services and confirm each of the three services has the correct URL:

- Restorative → `thanks-restorative`
- Soothe → `thanks-soothe`
- Procell → `thanks-procell`

Specifically check that none of them are pointing to `thanks-soothe` when they should be pointing to one of the others — that is the most common copy-paste error.

### "Multiple conversions fire for a single booking"

If Tag Assistant shows two or three conversions firing on a single thank-you page load, the snippet from B3 is being included more than once on the page, OR you accidentally also have a hard-coded `gtag('event', 'conversion', ...)` call elsewhere in the page. Open the page's HTML source, search for `gtag('event', 'conversion'`, and confirm it appears exactly once.

### "Tag Assistant says my conversion tag is configured but I have no real data after a week"

Check that your Google Ads conversion is set to **Count: One** (not **Every**) and that the **Conversion window** is at least 30 days. Also confirm the conversion's **Status** says **Recording conversions**, not **No recent conversions** or **Inactive**.

---

## Quick reference card

Print this and keep it near the booking desk.

```
Square Appointments redirects — Altru Radiance

Restorative Facial + Buccal Release   $250   →  /thanks-restorative
Soothe Lymphatic Drainage             $250   →  /thanks-soothe
Procell Microchanneling               $300   →  /thanks-procell

Test cycle:
  1. Incognito Chrome + Tag Assistant ON
  2. Book each service as a test customer
  3. Confirm redirect URL matches table above
  4. Confirm Tag Assistant shows green
  5. Cancel test bookings in Square Dashboard
  6. After 3 hours, check Google Ads → Tools → Conversions

If a redirect breaks: re-open the service in Square,
re-paste the URL, click Save at the BOTTOM of the page.
```

---

## When to redo this setup

You only need to redo this if any of the following happens:

- Square changes its UI or moves the redirect setting (check this walkthrough's accuracy every 6 months).
- You add a fourth service that needs its own conversion tracking — repeat A3–A6 for the new service.
- You rename a service in Square in a way that changes the URL slug Square uses internally (rare).
- Google Ads reports zero conversions for more than 7 consecutive days on a service that is actively running ads — re-run the verification in Step A7.

Save this file. Re-read it any time conversions look wrong. The walkthrough is the source of truth for how this is wired together.
