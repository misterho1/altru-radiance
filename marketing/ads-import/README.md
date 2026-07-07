# Altru Radiance — Google Ads Editor Bulk Import

This directory contains a Google Ads Editor bulk-upload CSV that will create all four Search campaigns from `../ADS-PLAYBOOK.md` Section 2 in the Altru Radiance Google Ads account in seconds.

- **Account ID:** 857-072-1509 (Mechelle, mechelle@altruradiance.com)
- **Conversion ID:** AW-18164308166
- **All campaigns import paused.** Review in Editor, then post and unpause manually in the web UI when ready.

---

## Utah Master Esthetician scope compliance — read this before editing

**Rule:** Altru Radiance is a Master Esthetician practice under Utah R156-11a-102, not a massage therapy practice. The business cannot represent itself as performing "massage." Two implications for these CSV files:

1. **Ad copy (Headlines + Descriptions) NEVER contains the word "massage."** This is the business representing itself in publicly-served ad text. If you're editing Headlines or Descriptions in the RSA rows, do not introduce "massage." Use "release," "release work," "release session," "structural facial," or similar esthetics-scope language.

2. **Keyword targets CAN contain "massage."** Keywords are the search queries we want to *bid on*, not how we describe ourselves. Real Murray locals search "face massage near me" — bidding on that query lets us *capture* the intent and redirect to compliant ad copy. This is standard ads strategy: target the search, don't be the search.

**Allowed instances of "massage" in this directory:**
- `face massage salt lake city` (Phrase match keyword in the Buccal Release ad group) — targeting intent
- `massage school` (Negative Phrase keyword in the Soothe ad group) — excluding irrelevant searches

Any other "massage" in this directory is a bug. Fix it before importing.

---

## How to import

1. Open **Google Ads Editor** (download from https://ads.google.com/intl/en_us/home/tools/ads-editor/ if not installed).
2. Sign in and select the Altru Radiance account (857-072-1509).
3. Click **Get recent changes** (top-left button) to make sure the local copy is current.
4. Go to **Account → Import → From file…**
5. Select `bulk-upload.csv` from this folder.
6. Editor will show a preview dialog: confirm "4 campaigns, 10 ad groups, 60 keywords, 10 ads, ~25 negatives, 6 sitelinks, 7 callouts, 4 structured snippets" (counts may vary slightly by Editor version).
7. Click **Finish and review changes**.
8. Spot-check one campaign in the tree on the left — verify locations, ad schedule, device adjustments, and bid strategy.
9. Click **Post** (top-right) to push to the live account.
10. **Everything posts paused.** Unpause Campaign 4 (Brand Defense) first per playbook §7. Hold Campaigns 1–3 paused until conversion tracking is verified with Tag Assistant.

---

## What's in `bulk-upload.csv`

Single CSV using Editor's multi-entity column schema. Each row is one item; columns are populated only for the fields that apply to that item type.

| Block | Rows | Notes |
|---|---|---|
| Campaigns | 4 | All Search, all paused, location + schedule + device + bid strategy set per playbook |
| Ad groups | 10 | Default CPC bid $2.50 placeholder (Maximize Conversions doesn't use it but Editor requires a value) |
| Keywords | 60 | Phrase = `"keyword"`, Exact = `[keyword]`, Broad = no quotes |
| Negative keywords (campaign level) | 60+ | One row per negative |
| Responsive Search Ads | 10 | One RSA per ad group with 15 headlines + 4 descriptions; Headlines 1+2 pinned to pos 1, Headline 3 pinned to pos 2 |
| Sitelink assets | 6 | Account-level so all campaigns inherit |
| Callout assets | 7 | Account-level |
| Structured snippet assets | 1 (4 values) | Services header |

---

## Match type encoding (Editor convention)

- Broad → `keyword` (no markers)
- Phrase → `"keyword"`
- Exact → `[keyword]`
- Negative phrase → `-"keyword"` in Match Type column = `Negative Phrase`
- Negative exact → `[keyword]` in Match Type column = `Negative Exact`
- Negative broad → `keyword` in Match Type column = `Negative Broad`

The CSV uses explicit `Match Type` and `Status` columns so Editor doesn't have to infer.

---

## After import — manual steps Editor cannot do

These are unavoidable in the web UI (Editor doesn't expose them yet):

1. **Conversion goals** — confirm Campaigns 1, 2, 3, 4 inherit the account-level primary conversions (Booking – Restorative, Booking – Soothe, Booking – Procell).
2. **Per-campaign conversion override** (optional, recommended): set Campaign 1 to only count Booking – Restorative, Campaign 2 to only Soothe, Campaign 3 to only Procell. Editor doesn't support campaign-level conversion goals — do this in the UI under each campaign's Settings → Conversion goals.
3. **Location exclusion** (Salt Lake City Airport polygon) — Editor doesn't accept polygon exclusions via CSV. Add manually in each campaign's Locations panel.
4. **Call extension** ((801) 660-8933, studio hours only) — add at account level in the UI.
5. **Image extensions** — upload images in the UI.
6. **Bid strategy switch to Target CPA $40** — happens after 30 conversions per playbook §7 day 30.

---

## Verifying after Post

In Editor, after Post completes:

1. Tree view → Campaigns → confirm 4 new campaigns, all status Paused.
2. Click each campaign → Settings tab → verify:
   - Networks: Search only (no Display, no Search Partners)
   - Locations: Salt Lake County + Murray 5-mile radius (Presence)
   - Languages: English
   - Bid strategy: Maximize Conversions
   - Ad rotation: Optimize
   - Device bid adjustments: Mobile +15%, Tablet −20%
   - Ad schedule: Tue 10–20, Wed–Fri 9–21, Sat 9–16 (Sun/Mon blank)
3. Click each ad group → Keywords tab → verify keyword counts match the playbook.
4. Click Ads tab on any ad group → open the RSA → verify Headline 1, 2 pinned to position 1; Headline 3 pinned to position 2.
5. Account → Ads & extensions → Assets → verify 6 sitelinks, 7 callouts, 1 structured snippet.

If anything is missing or wrong, fix it in Editor and re-Post — don't edit the CSV and re-import (you'll get duplicates).

---

## Rollback

If something goes sideways after Post:

1. In Editor, **Account → View change history** → find the import event → **Revert**.
2. Or in the web UI, pause the 4 campaigns and delete them (since they're paused with zero impressions, no harm done).
