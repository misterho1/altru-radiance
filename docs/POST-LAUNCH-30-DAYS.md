# Altru Radiance — Post-Launch 30-Day Optimization Playbook

A practitioner-friendly guide for the first 30 days after Google Ads goes live.

- Operator: Mechelle (Master Esthetician, owner)
- Account: 857-072-1509
- Budget: $750/month ($25/day across 4 campaigns)
- Goal: Reach 30 conversions account-wide so we can switch to Target CPA $40

This guide tells you what to check, what to change, and what to ignore. Read each section the day it applies. Do not skip ahead.

---

## How to use this playbook

- Open Google Ads at the start of each working day (Tue-Sat).
- Spend 10 minutes max in the first two weeks. More than that and you will start tweaking things that should not be tweaked.
- Read the "Things to Ignore" section first if you feel the urge to change something not listed in that day's tasks.
- If a Red Flag fires, stop the regular task and address the Red Flag.

---

## Pre-Launch Checklist (Day 0)

Do not enable any campaign until every item below is true. Print this page, tick each box.

- [ ] DNS for altruradiance.com points to Cloudflare Pages and resolves on mobile and desktop
- [ ] Site is deployed to production (https://altruradiance.com, not the .pages.dev preview)
- [ ] SSL certificate is valid (green padlock in Chrome, no mixed-content warnings)
- [ ] Each service landing page loads in under 3 seconds on mobile (test with Chrome DevTools Lighthouse)
- [ ] Thank-you pages live and reachable: /thank-you-restorative, /thank-you-soothe, /thank-you-procell
- [ ] Square redirects configured for each service so a completed booking sends the user to the matching thank-you page
- [ ] Google Tag Assistant verified: all 3 conversion actions fire when a test booking completes (Booking - Restorative, Booking - Soothe, Booking - Procell)
- [ ] Conversion values confirmed in Google Ads: Restorative $250, Soothe $250, Procell $300
- [ ] Phone number on site matches the number Mechelle answers Tue-Sat during business hours
- [ ] Google Business Profile address and hours match the site exactly (Murray, Utah)
- [ ] Billing on file in Google Ads, primary payment method valid, backup card added
- [ ] Daily budget cap set: Restorative $13, Soothe $5.50, Procell $6, Brand Defense $1 (total $25.50)
- [ ] Bid strategy on every campaign is Maximize Conversions (not Maximize Clicks, not Target CPA yet)
- [ ] Ad schedule set: Tue 10am-8pm, Wed-Fri 9am-9pm, Sat 9am-4pm, Sun and Mon paused
- [ ] Location targeting: Murray, UT plus 15-mile radius. "Presence" only, not "Presence or interest"
- [ ] Negative keyword list applied to all 4 campaigns (free, cheap, jobs, training, school, DIY, near me free)
- [ ] At least 3 Responsive Search Ads per ad group, each with 15 headlines and 4 descriptions
- [ ] Final URL on every ad goes to the matching service page, not the homepage
- [ ] Mechelle has access to the Google Ads account on her own login (do not rely on a shared password)

If any box is unticked, fix it before launch. A campaign that goes live with broken tracking burns budget for two weeks before anyone notices.

---

## Days 1-3: Enable and Watch

### Day 1 (Tuesday)

What to do:

- Enable Brand Defense first. This campaign captures people Googling "altru radiance" and should produce clicks within an hour.
- Wait 4 hours. Confirm at least one impression shows in the Brand Defense campaign before enabling the others.
- Enable Restorative, Soothe Lymphatic, and Procell in that order, 30 minutes apart.
- Note the exact time each campaign went live in a notebook or the campaign's notes field.

What NOT to do:

- Do not click "Apply" on anything in the Recommendations tab.
- Do not change keyword match types.
- Do not pause any campaign no matter how few impressions appear.

What to look at:

- Campaigns view. Confirm status shows "Eligible" (green dot) not "Limited" or "Paused".
- Impressions column. Brand Defense should show impressions within an hour. The other three may take 24-48 hours.

Common Day 1 issues:

- Ad disapproved. Open the ad, read the policy reason at the top, fix the headline or description, resubmit. Most disapprovals on a med-spa account come from "Healthcare and medicines" auto-flagging the word "treatment" or "injection". Rephrase, do not appeal.
- "Daily budget exceeded" warning at 6pm on Day 1. Ignore. Google can spend up to 2x the daily budget on a single day and averages over the month.
- No impressions on Restorative after 6 hours. Normal. Search volume for "buccal release Utah" is low. Wait 48 hours before worrying.

### Day 2 (Wednesday)

What to do:

- Open the account once. Look at the Campaigns view for 90 seconds. Close the tab.
- If Brand Defense has 0 impressions after 24 hours, confirm the keyword "altru radiance" is in the campaign as a phrase match.

What NOT to do:

- Do not open the Search Terms report yet. There is not enough data.
- Do not raise any budget.
- Do not add keywords.

### Day 3 (Thursday)

What to do:

- Open the account once. Confirm all 4 campaigns have at least 1 impression. If Restorative or Soothe still shows 0, that is fine; it can take 5-7 days.
- Walk away.

What to look at:

- Just impressions. Just whether ads are serving.

What to ignore:

- Click-through rate (too little data).
- Cost per click (varies wildly in week 1).
- The single conversion that may or may not have come in. One conversion is noise.

---

## Days 4-7: First Pruning

### Day 4 (Friday)

What to do:

- Open Tools (top right wrench icon) -> Insights and reports -> Search terms.
- Set the date range to "Since campaign start".
- Scan the list for terms that have nothing to do with the practice. Examples to expect: "free facial near me", "esthetician jobs murray", "buccal release tutorial youtube", "lymphatic drainage for weight loss".

How to add a negative keyword:

1. In the Search Terms report, tick the box next to the bad term.
2. Click "Add as negative keyword" at the top of the table.
3. Choose "Add to a list" -> select the shared negative list applied to all campaigns. Do not add it to just one campaign unless the term is relevant to one service and not another.
4. Change match type to "Phrase" for multi-word negatives, "Exact" for single odd words.
5. Save.

What's normal early click volume:

- Account-wide at $25/day budget: expect 10-30 clicks per day total once all campaigns are serving.
- Brand Defense alone: 1-3 clicks per day. CTR will be very high (20-60%). This is expected.
- Restorative: 3-8 clicks per day. CPC may be $4-9.
- Soothe Lymphatic: 1-4 clicks per day.
- Procell: 2-5 clicks per day. CPC tends to run higher because microchanneling has commercial search intent.

What to ignore:

- Cost per click variance day to day. CPC swings 30-50% in week 1 are normal.
- One conversion vs zero conversions. Statistical noise until you cross 10.
- Quality Score on keywords with under 100 impressions. The number is not meaningful yet.

### Day 5 (Saturday — short day)

What to do:

- Check Saturday's ad schedule fired correctly. Open the campaign, click Settings -> Ad schedule. Confirm ads stopped serving at 4pm.
- If any campaign is still serving after 4pm Saturday, the schedule is broken. Fix the schedule, do not pause the campaign.

### Days 6-7 (Sunday-Monday — campaigns paused, you rest)

What to do:

- Nothing. Campaigns are paused by schedule on Sun and Mon. Do not log in.

---

## Week 2: Pattern Recognition

By Day 8, Google has enough data to start showing real patterns. Now we read carefully.

### Day 8 (Tuesday)

What to do:

- Open the account. Go to Campaigns -> click into each campaign one at a time.
- For each campaign, look at the Keywords tab. Sort by Conversions descending.
- Note which keyword themes are getting clicks AND conversions, vs. which are getting clicks only.

What "converting" looks like at this stage:

- A keyword with 20+ clicks and 1+ conversions is showing a signal.
- A keyword with 5 clicks and 0 conversions is showing nothing yet.
- A keyword with 30+ clicks and 0 conversions is starting to look bad but is not yet conclusive.

What NOT to do:

- Do not pause a keyword that has under 30 clicks, regardless of cost. Google's learning phase needs 7-14 days minimum per ad group to stabilize. Pausing kills the data.
- Do not lower bids. Maximize Conversions handles bidding for you.
- Do not change ad copy yet.

### Day 9 (Wednesday)

What to do:

- Run the Search Terms report again. Add 5-10 new negatives based on the irrelevant terms that appeared since Day 4.
- Common week 2 negatives for this account: "youtube", "tutorial", "course", "certification", "school near me", "diy", "free", "tiktok", "before and after photos" (not always negative but often researchers, not bookers).

### Day 10 (Thursday)

What to do:

- Read the conversion funnel. For each campaign:
  - Impressions (how many times the ad showed)
  - Clicks (how many people clicked)
  - CTR (clicks / impressions)
  - Conversions (how many bookings)
  - Conversion rate (conversions / clicks)

Healthy week 2 ranges for this account:

- Brand Defense: CTR 30%+, conversion rate 15-30%, CPA under $10
- Restorative: CTR 4-8%, conversion rate 3-8%, CPA $30-60
- Soothe Lymphatic: CTR 3-6%, conversion rate 2-6%, CPA $35-70
- Procell: CTR 3-7%, conversion rate 3-7%, CPA $40-80

If a campaign is wildly outside these ranges, note it but do not act yet. Wait until Day 14.

### Days 11-12 (Friday-Saturday)

What to do:

- Add any new negatives that have appeared.
- Do not change anything else.

### Day 14 (the second Tuesday)

First "bad" pattern to fix:

- Look for keywords with 30+ clicks, $50+ spent, and 0 conversions. These are the highest-confidence "kill" candidates.
- Pause those keywords. Do not delete; pause. Deletion removes history.
- How: Keywords tab -> tick the keyword -> Edit -> Pause.

If no keyword has hit 30 clicks yet, do nothing. Budget is the constraint, not bad targeting.

---

## Week 3: Optimization

By Day 15, you have two weeks of data. Now make targeted improvements.

### Day 15 (Tuesday)

What to do:

- Pull the Search Terms report one more time. Add 10-15 negatives.
- Look specifically for "buyer-style" queries that are NOT booking ("photos", "reviews", "is it worth it", "vs"). These researchers are not ready. Add as negatives or move to a separate research-intent ad group later.

### Day 16 (Wednesday)

Check Quality Score:

- Open the Keywords tab. Click the columns icon -> Quality Score -> Apply.
- Look at your top 10 keywords by impressions. Target Quality Score 7 or higher.
- For any keyword with Quality Score 5 or below: hover the speech bubble icon. It will show which of three sub-scores is dragging it down (Expected CTR, Ad Relevance, Landing Page Experience).

Fixes by sub-score:

- Expected CTR low: ad copy does not match the keyword. Rewrite Headline 1 to include the keyword phrase.
- Ad Relevance low: the keyword is in the wrong ad group. Move it to a tighter-themed ad group.
- Landing Page Experience low: the landing page does not mention the service prominently. Add the keyword phrase to the H1 and first paragraph.

### Day 17 (Thursday)

Review ad performance:

- Open Ads & assets -> Ads -> click a Responsive Search Ad -> View asset details.
- Google rates each headline and description as Low / Good / Best.
- For any headline rated Low after 1000+ impressions, replace it with a new variant.

Test pinning:

- If one specific headline is clearly outperforming (rated Best, appears in most served combinations, drives most clicks), consider pinning it to Headline 1 position.
- How: Edit the ad -> hover the headline -> click the pin icon -> select Position 1.
- Caveat: pinning reduces Google's machine learning surface area. Only pin when the winning headline is obvious. If unsure, do not pin.

### Day 18-20 (Friday-Saturday-Tuesday)

What to do:

- Continue adding negatives as they appear.
- Do not raise or lower budgets yet.
- If a campaign is hitting its daily budget by noon every day, note it for the Week 4 budget review.

---

## Week 4: Decision Point

### Day 22 (Tuesday)

Count account-wide conversions since launch:

- Open Campaigns -> set date range to the last 21 days.
- Sum the Conversions column across all campaigns.

If you are at 30+ conversions:

- Switch the three service campaigns (Restorative, Soothe, Procell) to Target CPA.
- How: Campaign Settings -> Bidding -> Change bid strategy -> Target CPA -> set tCPA to $40.
- Leave Brand Defense on Maximize Conversions. Brand intent does not need a CPA cap.
- Note the change in the campaign notes field with the date.
- Do not change anything else for 7 days. Target CPA needs its own learning period.

If you are under 30 conversions:

Investigate the cause. Walk through this checklist in order:

1. Tracking broken. Do a live test booking through each service. Confirm the conversion fires in Tag Assistant. If it does not, the rest of this list does not matter.
2. Budget too low. If you are consistently hitting the daily budget cap by midday on the better-performing campaigns, you are leaving conversions on the table. Note this for the budget decision below.
3. Wrong audience. Check the Demographics tab. If 70% of clicks are coming from outside Salt Lake County, tighten the location targeting radius.
4. Weak landing pages. Open the service page on mobile. Time how long it takes to find the "Book" button. If it takes more than 4 seconds, the page needs work.
5. Wrong intent keywords. If the Search Terms report shows mostly research queries (photos, reviews, vs.), shift to more transactional keywords.

When to scale UP budget (Day 22-30):

- A campaign is consistently hitting its daily budget cap before 6pm.
- AND that campaign's CPA is under $40.
- AND you have at least 5 conversions from that campaign.
- Action: raise that campaign's daily budget by 20-30%. Not 100%. Not double. Sudden budget jumps reset the learning phase.

When to scale DOWN budget:

- A campaign has spent $100+ over 14 days with 0 conversions and tracking is verified working.
- Action: cut that campaign's daily budget by half. Do not pause unless Day 28 still shows nothing.

### Day 24-28

What to do:

- Hold steady. Let the bid strategy change settle if you switched to tCPA.
- Continue adding negatives weekly.
- Note which day-of-week and which hours produce the most conversions. This is data for the Month 2 ad schedule refinement.

### Day 30

What to do:

- Print or screenshot the 30-day campaign report.
- Note: total spend, total conversions, CPA per campaign, top 5 converting keywords, top 5 negatives added.
- This is the baseline for Month 2 decisions.

---

## Red Flags (When to Pause and Reassess)

These are the specific scenarios that justify breaking the normal "do not touch" rules.

### Red Flag 1: Zero conversions after 14 days and $200+ spent on a campaign

- What it means: tracking is broken, the offer is mismatched, or the audience is wrong.
- Action: pause the campaign. Run a live test booking. Confirm the conversion fires. If tracking is fine, audit the landing page and ad copy alignment.
- Do not just keep spending. Two more weeks will produce two more weeks of the same result.

### Red Flag 2: Click-through rate under 1% on most ad groups

- What it means: the ad copy is not matching what searchers want.
- Action: rewrite Headline 1 on each ad to lead with the exact service name. Test for 7 days.
- Exception: Restorative may run lower CTR than the other campaigns because buccal release is a less-familiar term. Under 2% is fine for Restorative. Under 1% is not.

### Red Flag 3: Cost per conversion above $80

- What it means: budget is too low for the intent level OR keywords are too broad.
- Action: tighten match types. Move broad-match keywords to phrase match. Add 10 more negatives. Wait 7 days.
- If CPA stays above $80 after the fix: the offer is not converting. Audit the booking page friction (does Square require an account, is the calendar showing availability, is the deposit too high).

### Red Flag 4: "Limited by budget" status on a converting campaign

- What it means: Google would spend more and bring more conversions if you let it. This is a good problem.
- Action: raise daily budget by 20-30%. Do not double. Re-check in 7 days.

### Red Flag 5: A single keyword is eating more than 60% of a campaign's spend

- What it means: that keyword is dominating the auction and starving the rest of the ad group.
- Action: do not pause it. Lower its bid only if on manual bidding (not your case). On Maximize Conversions, let it run unless its CPA is bad. If CPA on that keyword is above account-wide CPA by 2x, pause.

### Red Flag 6: Conversion fires but no booking in Square

- What it means: someone is starting the booking flow and triggering the thank-you page without completing payment. Or the conversion is firing on the wrong page.
- Action: open Tag Assistant. Run a real booking and a fake-abandoned booking. Confirm the conversion only fires on payment completion.

### Red Flag 7: Spend pacing at 2x the daily budget for 3 days straight

- What it means: Google is front-loading the month. Usually fine, but check the monthly forecast.
- Action: open Billing -> View transactions. Confirm month-to-date spend is on track to land near $750, not $1500.

---

## Things to Ignore (Common Distractions)

These will pull you off track. Ignore each one until specifically noted.

### Google's Recommendations tab pushing Performance Max

- Google heavily promotes Performance Max because it removes operator control and runs across all inventory (Search, Display, YouTube, Gmail, Maps).
- For a small-budget local med-spa, Performance Max burns budget on irrelevant placements before producing local conversions.
- Action: ignore every Performance Max recommendation for the first 90 days. After 90 days, revisit with a 10% test budget only if the Search campaigns are profitable.

### Phone calls from "Google Ads strategists"

- Google will assign an account representative who calls weekly. They are sales staff with quotas, not optimization specialists.
- Common pitches: switch to Smart Bidding immediately, add Display network, raise budgets, enable auto-apply recommendations.
- Action: be polite. Decline everything until Day 30. After Day 30, evaluate any specific suggestion on its merits, never on the rep's urgency.

### Click-through rate panic on Brand Defense vs. Restorative

- Brand Defense will always show CTR of 30-60%. Restorative will always show CTR of 3-8%. This is not a problem with Restorative.
- Brand searchers already know the practice. Service searchers are comparing options.
- Action: judge each campaign against its own normal range, not against the other campaigns.

### Daily budget showing "exceeded"

- Google can spend up to 2x the daily budget on a single high-traffic day and balances by spending less on slow days.
- Monthly spend cap = daily budget x 30.4. Google holds the monthly average, not the daily.
- Action: only worry if month-to-date spend is on track to exceed $850 (15% over target).

### Single-day conversion drops

- Conversions vary day to day. A Tuesday with 0 conversions after a Thursday with 4 is statistical noise.
- Action: look at 7-day rolling totals, not single days. The Campaigns view has a "Last 7 days vs. previous period" comparison built in.

### Auction Insights showing competitor activity

- "Anti-aging clinic" or another local spa appearing in Auction Insights does not mean they are taking your clicks.
- Action: glance at Auction Insights monthly, not weekly. Competitor share of impressions is interesting context, not actionable in the first 30 days.

### Quality Score on low-impression keywords

- A keyword with 12 impressions and Quality Score 4 is not telling you anything reliable.
- Action: only act on Quality Score for keywords with 500+ impressions.

---

## Month 2 Preview

At the 30-day mark, before scaling, revisit these items in Week 5:

- Ad schedule refinement. Pull the Hour of Day report. If conversions cluster between 11am-2pm and 6pm-8pm, tighten the schedule to those windows during week 5.
- Day-of-week budget shifting. If Saturdays produce 40% of weekly bookings on 15% of the spend, raise the Saturday share.
- Add a remarketing audience. Once you have 100+ site visitors, you can build a remarketing list for Display (separate budget, separate campaign, not Performance Max).
- Test a second landing page variant. Take the highest-traffic service page and test a version with a different above-the-fold layout. Run 50/50 for 30 days.
- Expand keyword themes that are working. If "buccal release" is producing bookings, add related themes: "intraoral release", "face sculpting", "jaw tension release".
- Trim what is not working. Pause keywords with 100+ clicks and 0 conversions. Move budget to the proven themes.
- Evaluate Procell pricing in the conversion value. If actual booking averages are higher than $300, raise the conversion value. tCPA will then become more aggressive on Procell.
- Consider adding a fourth conversion action for phone calls if the call-tracking number is generating bookings outside of Square.

After Month 2 review, set Month 3 budget. Common Month 3 budgets for a profitable Month 2: $1000-1500/month. Do not raise budget above $1500 until you have 90 days of stable CPA data.

---

## Quick-Reference Card

Print this and tape it near the desk where Mechelle logs in.

- Log in: Tue, Thu, Sat. 10 minutes max.
- Do: check campaigns serving, add negatives, note questions.
- Do not: pause campaigns under 14 days old, apply Recommendations, change bid strategy before 30 conversions.
- Red Flag triggers a pause: 14 days + $200 spent + 0 conversions.
- Switch to tCPA $40 only when account has 30+ conversions total.
- Ignore: Performance Max prompts, Google rep upsells, single-day variance, daily budget "exceeded" warnings.

End of 30-day playbook.
