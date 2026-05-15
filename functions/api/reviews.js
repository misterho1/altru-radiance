// ============================================================
// Cloudflare Pages Function — /api/reviews
//
// Proxies Google Places API to fetch live rating + review count
// for Altru Radiance's Google Business Profile, then caches the
// response at Cloudflare's edge for 6 hours.
//
// The function reads two env vars set in the Cloudflare Pages
// project (Settings → Environment variables):
//
//   GOOGLE_PLACES_API_KEY   ← your Google Maps API key with the
//                             Places API enabled
//   GOOGLE_PLACES_PLACE_ID  ← Altru Radiance's Google Place ID
//
// If either is missing, the endpoint returns 503 and the homepage
// quietly falls back to the hardcoded rating + count baked into
// the trust-bridge HTML.
//
// Setup steps (one-time, ~10 minutes):
//
//   1. Get a Google Maps API key
//      https://console.cloud.google.com/google/maps-apis/
//      → Enable the "Places API"
//      → Create an API key and restrict it to:
//         - HTTP referrers: *.altruradiance.com/*, altru-radiance.pages.dev/*
//         - API: Places API only
//
//   2. Find your Place ID
//      https://developers.google.com/maps/documentation/places/web-service/place-id
//      → Search "Altru Radiance" → copy the Place ID
//
//   3. In Cloudflare Pages dashboard:
//      → Workers & Pages → altru-radiance project → Settings
//      → Environment variables → add (Production):
//          GOOGLE_PLACES_API_KEY = <your-api-key>
//          GOOGLE_PLACES_PLACE_ID = <your-place-id>
//      → Redeploy
//
//   4. The trust-bridge on the homepage will then show live
//      values; if the Places API throttles or errors, it falls
//      back gracefully to the hardcoded baseline values in HTML.
// ============================================================

export async function onRequestGet({ env, request }) {
  const apiKey = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACES_PLACE_ID;

  // Not configured: return 503 with a JSON body so the client knows to
  // keep the static fallback values.
  if (!apiKey || !placeId) {
    return new Response(
      JSON.stringify({ error: "not_configured", message: "Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACES_PLACE_ID in Pages env vars." }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
        },
      },
    );
  }

  // Field mask keeps the API call cheap (we only bill for fields we request).
  const fields = "name,rating,user_ratings_total,reviews,url";
  const apiUrl =
    "https://maps.googleapis.com/maps/api/place/details/json" +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=${encodeURIComponent(fields)}` +
    `&key=${encodeURIComponent(apiKey)}`;

  try {
    const resp = await fetch(apiUrl, {
      // Cloudflare's cache layer will store this so we don't hit Places API
      // on every request. 6 hours is plenty fresh for review counts.
      cf: { cacheTtl: 21600, cacheEverything: true },
    });

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "upstream_error", status: resp.status }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    const data = await resp.json();

    if (data.status !== "OK") {
      return new Response(
        JSON.stringify({ error: "places_api_status", status: data.status, message: data.error_message || null }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    const result = data.result || {};
    const payload = {
      rating: result.rating ?? null,
      total: result.user_ratings_total ?? null,
      placeUrl: result.url ?? null,
      reviews: (result.reviews || []).slice(0, 5).map((r) => ({
        author: r.author_name,
        profilePhoto: r.profile_photo_url,
        rating: r.rating,
        relativeTime: r.relative_time_description,
        text: r.text,
        time: r.time,
      })),
      cachedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Browser cache for 1 hour; CDN edge cache for 6 hours.
        // Stale-while-revalidate lets a cached response serve while a fresh
        // fetch happens in the background — so users never wait on Places API.
        "Cache-Control": "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "fetch_failed", message: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}
