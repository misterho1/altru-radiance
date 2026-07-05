/* Cinematic-layer verification harness.
   Usage: node tools/verify-cinematic.mjs [baseUrl] [shotDir]
   Covers: desktop choreography (reveals, counter, Soothe Arc pin+scrub,
   philosophy scroll-fill, CTA hairline), mobile static-arc behavior,
   reduced-motion full-static, no-JS full visibility, and the invariants
   (hero video, GA, canonical).
*/
import { createRequire } from 'module';
const require = createRequire('file:///C:/Users/goho2/projects/exclusiveut/node_modules/');
const puppeteer = require('puppeteer-core');

const BASE = process.argv[2] || 'http://localhost:8734';
const SHOTS = process.argv[3] || 'tools/shots';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

import { mkdirSync } from 'fs';
mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
function check(name, ok, extra) {
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + name + (extra ? '  [' + extra + ']' : ''));
  ok ? pass++ : fail++;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--autoplay-policy=no-user-gesture-required'],
});

try {
  /* ── DESKTOP ── */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(1500);

    check('desktop: cine-on gate armed', await page.evaluate(() =>
      document.documentElement.classList.contains('cine-on')));
    check('desktop: GSAP + ScrollTrigger + Lenis loaded', await page.evaluate(() =>
      !!(window.gsap && window.ScrollTrigger && window.Lenis)));

    // Hero video from the prior pass still runs
    const hero = await page.evaluate(() => {
      const v = document.querySelector('video.hero-video');
      return v ? !v.paused && v.currentTime > 0.2 : false;
    });
    check('desktop: hero ambient video still playing', hero);

    // Counter visible and climbing
    const pct0 = await page.evaluate(() => document.getElementById('scrollPct').textContent);
    await page.evaluate(() => window.scrollBy(0, 2500));
    await sleep(1200);
    const pct1 = await page.evaluate(() => document.getElementById('scrollPct').textContent);
    check('desktop: scroll counter climbs', pct0 === '00' && parseInt(pct1, 10) > 0, pct0 + ' -> ' + pct1);

    // Entry reveals: scroll services into view, cards end at opacity 1
    await page.evaluate(() => document.querySelector('.services-section').scrollIntoView({ block: 'start' }));
    await sleep(2600);
    const cardOpacity = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.querySelector('.service-card')).opacity));
    check('desktop: service cards revealed', cardOpacity > 0.95, 'opacity=' + cardOpacity);

    // Soothe Arc: pinned, starts at stage 1, ends at stage 4
    const pinned = await page.evaluate(() => !!document.querySelector('.pin-spacer .soothe-arc, .pin-spacer > .soothe-arc, .soothe-arc'));
    const pinSpacer = await page.evaluate(() => !!document.querySelector('.pin-spacer'));
    check('desktop: Soothe Arc pin engaged', pinned && pinSpacer);

    await page.evaluate(() => document.querySelector('.soothe-arc').scrollIntoView({ block: 'start' }));
    await sleep(1600);
    const stageStart = await page.evaluate(() => {
      const frames = [...document.querySelectorAll('.arc-frame')];
      const active = frames.findIndex(f => f.classList.contains('is-active'));
      return { active, caption: document.querySelector('.arc-caption.is-active').textContent.trim() };
    });
    check('desktop: Arc opens on stage 1 (room)', stageStart.active === 1, stageStart.caption);

    // Scrub deep into the pin: should reach the final stage
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2.6));
    await sleep(1600);
    const stageEnd = await page.evaluate(() => {
      const frames = [...document.querySelectorAll('.arc-frame')];
      return frames.findIndex(f => f.classList.contains('is-active'));
    });
    check('desktop: Arc scrubs to final stage', stageEnd === 0 || stageEnd === 3, 'active frame idx=' + stageEnd);

    // Philosophy scroll-fill words exist and brighten after scroll-through
    await page.evaluate(() => document.querySelector('.philosophy-text').scrollIntoView({ block: 'center' }));
    await sleep(2000);
    const fill = await page.evaluate(() => {
      const words = document.querySelectorAll('.philosophy-text > p .fill-word');
      if (!words.length) return { n: 0 };
      const first = parseFloat(getComputedStyle(words[0]).opacity);
      return { n: words.length, first };
    });
    check('desktop: philosophy scroll-fill active', fill.n > 20 && fill.first > 0.8, fill.n + ' words, first=' + fill.first);

    // CTA hairline drawn
    await page.evaluate(() => document.querySelector('.cta-strip').scrollIntoView({ block: 'center' }));
    await sleep(2200);
    const hair = await page.evaluate(() => {
      const el = document.querySelector('.cine-hairline');
      const t = getComputedStyle(el).transform;
      return t === 'none' || /matrix\(1[,)]/.test(t) || /matrix\(0\.9\d/.test(t);
    });
    check('desktop: CTA hairline drawn', hair);

    const inv = await page.evaluate(() => ({
      ga: !!document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),
      canonical: (document.querySelector('link[rel="canonical"]') || {}).href,
    }));
    check('desktop: GA untouched', inv.ga);
    check('desktop: canonical untouched', inv.canonical === 'https://altruradiance.com/', inv.canonical);

    await page.evaluate(() => document.querySelector('.soothe-arc').scrollIntoView({ block: 'start' }));
    await sleep(1500);
    await page.screenshot({ path: SHOTS + '/cine-arc-desktop.png' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(1000);
    await page.screenshot({ path: SHOTS + '/cine-hero-desktop.png' });
    await page.close();
  }

  /* ── MOBILE ── */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(1500);
    const state = await page.evaluate(() => ({
      counterVisible: getComputedStyle(document.querySelector('.scroll-progress')).display !== 'none',
      pinSpacer: !!document.querySelector('.pin-spacer'),
      arcActive: [...document.querySelectorAll('.arc-frame')].findIndex(f => f.classList.contains('is-active')),
      idx: document.querySelector('.arc-index').textContent.trim(),
    }));
    check('mobile: counter hidden', !state.counterVisible);
    check('mobile: Arc NOT pinned (no scrub)', !state.pinSpacer);
    check('mobile: Arc shows final still + caption', state.arcActive === 0 && state.idx === '04', 'idx=' + state.idx);
    await page.evaluate(() => document.querySelector('.soothe-arc').scrollIntoView({ block: 'center' }));
    await sleep(1200);
    await page.screenshot({ path: SHOTS + '/cine-arc-mobile.png' });
    await page.close();
  }

  /* ── REDUCED MOTION ── */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(2000);
    const state = await page.evaluate(() => ({
      gate: document.documentElement.classList.contains('cine-on'),
      cardOpacity: parseFloat(getComputedStyle(document.querySelector('.service-card')).opacity),
      counterVisible: getComputedStyle(document.querySelector('.scroll-progress')).display !== 'none',
    }));
    check('reduced-motion: gate never armed', !state.gate);
    check('reduced-motion: content fully visible without scrolling', state.cardOpacity === 1, 'opacity=' + state.cardOpacity);
    check('reduced-motion: no counter', !state.counterVisible);
    await page.close();
  }

  /* ── NO-JS ── */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setJavaScriptEnabled(false);
    const resp = await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 });
    const html = await resp.text();
    check('no-js: page 200', resp.status() === 200);
    check('no-js: Arc frames + captions are real markup', html.includes('soothe-arc-1-1920') && html.includes('The room holds quiet.'));
    await sleep(1200);
    await page.screenshot({ path: SHOTS + '/cine-nojs.png' });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
