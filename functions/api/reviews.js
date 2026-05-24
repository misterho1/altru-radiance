// ============================================================
// Cloudflare Pages Function — /api/reviews
//
// Proxies Google Places API to fetch live rating + review count
// (and optionally up to 5 review bodies) for Altru Radiance's
// Google Business Profile. Cached at Cloudflare's edge for 24h.
//
// Endpoints:
//   GET /api/reviews                  -> {rating, total, placeUrl, cachedAt}
//   GET /api/reviews?include=reviews  -> + {reviews[]}
//
// Reads two env vars (Cloudflare Pages → Settings → Environment variables):
//   GOOGLE_PLACES_API_KEY
//   GOOGLE_PLACES_PLACE_ID
//
// If either is missing, returns 503; client falls back to hardcoded HTML.
// ============================================================

export async function onRequestGet({ env, request }) {
  const apiKey = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACES_PLACE_ID;

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

  // Read ?include=reviews to decide whether the response payload includes
  // the reviews array. Trust-bridge callers (rating + count only) skip
  // this and get the lighter payload.
  const url = new URL(request.url);
  const includeReviews = url.searchParams.get("include") === "reviews";

  const fields = "name,rating,user_ratings_total,reviews,url";
  // The &v= param is a cache-version marker. Bump it whenever you need to
  // invalidate the Cloudflare edge cache for the upstream Places fetch
  // (e.g. after fixing billing or restricting the API key) — Cloudflare
  // keys cache by URL, so any URL change forces a cache miss.
  const apiUrl =
    "https://maps.googleapis.com/maps/api/place/details/json" +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=${encodeURIComponent(fields)}` +
    `&language=en` +
    `&v=2` +
    `&key=${encodeURIComponent(apiKey)}`;

  try {
    // We fetch WITHOUT cf.cacheTtl first so we can inspect the response body
    // before deciding whether to cache it. Google Places returns HTTP 200
    // even on app-level errors (REQUEST_DENIED, OVER_QUERY_LIMIT, etc.) with
    // the error in the JSON `status` field — if we cache blindly, we'd
    // pin the error for 24h. Instead: fetch fresh, check status, then cache
    // only OK responses via the response-side Cache-Control header.
    const resp = await fetch(apiUrl);

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "upstream_error", status: resp.status }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    const data = await resp.json();

    if (data.status !== "OK") {
      // Short browser cache (60s) so retries don't hammer Google during an
      // outage, but nowhere near the 24h success cache.
      return new Response(
        JSON.stringify({ error: "places_api_status", status: data.status, message: data.error_message || null }),
        { status: 502, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" } },
      );
    }

    const result = data.result || {};
    const payload = {
      rating: result.rating ?? null,
      total: result.user_ratings_total ?? null,
      placeUrl: result.url ?? null,
      cachedAt: new Date().toISOString(),
    };

    if (includeReviews) {
      payload.reviews = (result.reviews || []).slice(0, 5).map((r) => ({
        author: r.author_name,
        rating: r.rating,
        relativeTime: r.relative_time_description,
        text: r.text,
        time: r.time,
      }));
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Browser cache 1h; edge cache 24h; stale-while-revalidate 24h.
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "fetch_failed", message: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}
