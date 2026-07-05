/* Hero derived-frame unveil verification harness.
   Runs against a local server of this worktree (default http://localhost:8734).

   Usage:
     NODE_PATH=C:/Users/goho2/projects/exclusiveut/node_modules \
       node tools/verify-hero.mjs [baseUrl] [shotDir]

   Covers the four contract states:
     1. desktop      — poster is LCP-ready, ambient video attaches + plays + fades in
     2. mobile       — poster carries the hero; video only attaches after load on fast connections
     3. reduced      — prefers-reduced-motion: video never attaches, poster static
     4. nojs         — JS disabled: markup poster still renders (static hero)
   Plus invariants: preload hint, scrim/line intact, GA tag + canonical untouched.
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
  const line = (ok ? 'PASS' : 'FAIL') + '  ' + name + (extra ? '  [' + extra + ']' : '');
  console.log(line);
  ok ? pass++ : fail++;
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--autoplay-policy=no-user-gesture-required'],
});

try {
  /* ── 1. DESKTOP ─────────────────────────────────────────────── */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 });

    const poster = await page.evaluate(() => {
      const p = document.querySelector('img.hero-poster');
      return p ? { complete: p.complete, w: p.naturalWidth, src: p.currentSrc || p.src } : null;
    });
    check('desktop: poster present + decoded', !!poster && poster.complete && poster.w > 0, poster && poster.src.split('/').pop());

    const preload = await page.evaluate(() =>
      !!document.querySelector('link[rel="preload"][as="image"][href*="soothe-glow-poster"]'));
    check('desktop: poster preload hint in head', preload);

    // Give the ambient video time to attach, buffer and fade in
    await page.waitForSelector('video.hero-video', { timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 5000));
    const vid = await page.evaluate(() => {
      const v = document.querySelector('video.hero-video');
      if (!v) return null;
      return {
        playing: !v.paused && v.currentTime > 0.2,
        t: v.currentTime,
        loop: v.loop, muted: v.muted,
        visible: v.classList.contains('is-playing'),
        ready: v.readyState,
        src: (v.currentSrc || v.src).split('/').pop(),
      };
    });
    check('desktop: ambient video attached', !!vid, vid && vid.src);
    check('desktop: video playing (muted, looping)', !!vid && vid.playing && vid.muted && vid.loop, vid && 't=' + vid.t.toFixed(2));
    check('desktop: video faded in (.is-playing)', !!vid && vid.visible, vid && 'readyState=' + vid.ready);

    const invariants = await page.evaluate(() => ({
      scrim: !!document.querySelector('.hero-bg'),
      line: !!document.querySelector('.hero-line'),
      ga: !!document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),
      canonical: (document.querySelector('link[rel="canonical"]') || {}).href,
      oldStack: !!document.querySelector('.hero-video-stack'),
    }));
    check('desktop: scrim + gold line intact', invariants.scrim && invariants.line);
    check('desktop: GA tag untouched', invariants.ga);
    check('desktop: canonical untouched', invariants.canonical === 'https://altruradiance.com/', invariants.canonical);
    check('desktop: old 5-video stack gone', !invariants.oldStack);

    await page.screenshot({ path: SHOTS + '/after-desktop.png' });
    await page.close();
  }

  /* ── 2. MOBILE ──────────────────────────────────────────────── */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 });
    const poster = await page.evaluate(() => {
      const p = document.querySelector('img.hero-poster');
      return p ? { complete: p.complete, w: p.naturalWidth, src: (p.currentSrc || p.src).split('/').pop() } : null;
    });
    check('mobile: poster present + decoded', !!poster && poster.complete && poster.w > 0, poster && poster.src);
    await new Promise(r => setTimeout(r, 4000));
    const attached = await page.evaluate(() => !!document.querySelector('video.hero-video'));
    console.log('INFO  mobile: video attached post-load = ' + attached + ' (allowed either way; connection-gated)');
    await page.screenshot({ path: SHOTS + '/after-mobile.png' });
    await page.close();
  }

  /* ── 3. REDUCED MOTION ──────────────────────────────────────── */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 3500));
    const state = await page.evaluate(() => ({
      video: !!document.querySelector('video.hero-video'),
      poster: !!document.querySelector('img.hero-poster'),
    }));
    check('reduced-motion: video never attaches', !state.video);
    check('reduced-motion: poster still carries hero', state.poster);
    await page.screenshot({ path: SHOTS + '/after-reduced.png' });
    await page.close();
  }

  /* ── 4. NO-JS ───────────────────────────────────────────────── */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setJavaScriptEnabled(false);
    const resp = await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 });
    check('no-js: page 200', !!resp && resp.status() === 200, resp && String(resp.status()));
    const html = await resp.text();
    check('no-js: poster is real markup (static hero)', html.includes('class="hero-poster"'));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: SHOTS + '/after-nojs.png' });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
