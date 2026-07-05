/* ─── ALTRU CINEMATIC LAYER ─────────────────────────────────────────
   Scroll choreography for the homepage: entry reveals, the pinned
   Soothe Arc sequence, the philosophy scroll-fill, hero drift, and the
   scroll-progress counter. GSAP + ScrollTrigger, Lenis smooth scroll
   on desktop.

   Fail-safe contract (site rule: JS may never hide content for good):
   - The `cine-on` class (added by a tiny head script) gates ALL initial
     hidden states in CSS. No JS, or prefers-reduced-motion → class never
     lands → the page is fully static and fully visible.
   - A `cine-safe` timer below force-reveals everything 4s after load
     even if GSAP failed mid-flight.
   - Phones run the FULL cinematic tier (Andrew, 2026-07-05) with 9:16
     stage cuts; the only desktop-only piece is Lenis smooth scroll —
     touch scrolling stays native. Reduced-motion stays fully static.

   Motion law (Altru): slow, organic, breathing. Nothing snappy, no
   bounce, no elastic. Durations 1.2–1.6s, sine/power2 easing only.
   ─────────────────────────────────────────────────────────────────── */
(function () {
  var docEl = document.documentElement;

  // Safety valve: whatever happens below, nothing stays hidden past 4s.
  setTimeout(function () { docEl.classList.add('cine-safe'); }, 4000);

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !window.gsap || !window.ScrollTrigger) {
    docEl.classList.remove('cine-on');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  var isMobile = window.matchMedia('(max-width: 768px)').matches;

  /* ── Lenis smooth scroll (desktop only) ── */
  if (!isMobile && window.Lenis) {
    var lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ── Scroll-progress counter ── */
  var pctEl = document.getElementById('scrollPct');
  if (pctEl) {
    ScrollTrigger.create({
      start: 0,
      end: function () { return ScrollTrigger.maxScroll(window); },
      onUpdate: function (self) {
        pctEl.textContent = String(Math.round(self.progress * 100)).padStart(2, '0');
      }
    });
  }

  /* ── Entry reveals: rise + fade, gentle stagger ── */
  var REVEAL_SELECTORS = [
    '.trust-bridge .trust-stat', '.trust-bridge .trust-stars',
    '.carousel-headline', '.carousel-wrap', '.hero-proof',
    '.testimonials-header', '.reviews-carousel',
    '.services-header', '.service-card',
    '.philosophy-image-parallax', '.philosophy-text .eyebrow',
    '.philosophy-text .section-heading', '.philosophy-text .gold-rule',
    '.philosophy-text .pillar', '.philosophy-text .btn-ghost',
    '.results-header', '.result-card',
    '.journal-header', '.journal-card',
    '.cta-strip-inner > div'
  ].join(',');

  var targets = gsap.utils.toArray(REVEAL_SELECTORS);
  targets.forEach(function (el) { el.classList.add('cine-reveal'); });
  ScrollTrigger.batch(targets, {
    start: 'top 88%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: 'power2.out',
        stagger: 0.12,
        overwrite: true
      });
    }
  });
  // Anything already inside the first viewport reveals immediately.
  ScrollTrigger.refresh();

  /* ── Hero drift: headline eases up + fades as the visitor leaves ── */
  var heroInner = document.querySelector('.hero-inner');
  if (heroInner) {
    gsap.to(heroInner, {
      yPercent: -12,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom 30%',
        scrub: 1.2
      }
    });
  }

  /* ── The Soothe Arc: pinned four-frame sequence ── */
  var arc = document.querySelector('.soothe-arc');
  if (arc) {
    var frames = gsap.utils.toArray('.soothe-arc .arc-frame');
    var captions = gsap.utils.toArray('.soothe-arc .arc-caption');
    var idxEl = arc.querySelector('.arc-index');
    // DOM puts the FINAL frame first so no-JS visitors see the strongest
    // still. ORDER maps narrative stage -> DOM index: room, oil, hands, final.
    var ORDER = [1, 2, 3, 0];

    if (frames.length === 4) {
      // JS owns the sequence from here; start at stage one (the room).
      var setStage = function (n) {
        var d = ORDER[n];
        frames.forEach(function (f, i) { f.classList.toggle('is-active', i === d); });
        captions.forEach(function (c, i) { c.classList.toggle('is-active', i === d); });
        if (idxEl) idxEl.textContent = '0' + (n + 1);
      };
      setStage(0);
      var current = 0;
      ScrollTrigger.create({
        trigger: arc,
        start: 'top top',
        end: '+=280%',
        pin: true,
        anticipatePin: 1,
        scrub: true,
        onUpdate: function (self) {
          var stage = Math.min(3, Math.floor(self.progress * 4));
          if (stage !== current) { current = stage; setStage(stage); }
        }
      });
      // Ken Burns across the pin: the whole scene settles from 1.06 to 1,
      // scrubbed with scroll — barely-there drift that keeps frames alive.
      gsap.fromTo(frames, { scale: 1.06 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: arc, start: 'top top', end: '+=280%', scrub: true }
      });
    }
  }

  /* ── Philosophy scroll-fill: words brighten as you read down ── */
  var mission = document.querySelector('.philosophy-text > p');
  if (mission) {
    var words = mission.textContent.trim().split(/\s+/);
    mission.textContent = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'fill-word';
      span.textContent = w;
      mission.appendChild(span);
      if (i < words.length - 1) mission.appendChild(document.createTextNode(' '));
    });
    gsap.to(mission.querySelectorAll('.fill-word'), {
      opacity: 1,
      ease: 'none',
      stagger: 0.6,
      scrollTrigger: {
        trigger: mission,
        start: 'top 78%',
        end: 'bottom 45%',
        scrub: 1
      }
    });
  }

  /* ── CTA finale: gold hairline draws across as the strip enters ── */
  var ctaRule = document.querySelector('.cta-strip .cine-hairline');
  if (ctaRule) {
    gsap.fromTo(ctaRule, { scaleX: 0 }, {
      scaleX: 1,
      duration: 1.6,
      ease: 'sine.out',
      scrollTrigger: { trigger: '.cta-strip', start: 'top 80%', once: true }
    });
  }

  /* ── Gold rules draw themselves on entry (existing elements, all below
     the fold, so the pre-animation state never flashes) ── */
  gsap.utils.toArray('.gold-rule').forEach(function (r) {
    gsap.fromTo(r, { scaleX: 0 }, {
      scaleX: 1,
      duration: 1.4,
      ease: 'sine.out',
      transformOrigin: r.classList.contains('left') ? 'left center' : 'center center',
      scrollTrigger: { trigger: r, start: 'top 90%', once: true }
    });
  });

  /* ── Trust stat counts up on first sight ── */
  var stat = document.getElementById('trust-clients');
  if (stat && /^\d+\+$/.test(stat.textContent.trim())) {
    var target = parseInt(stat.textContent, 10);
    var tally = { n: 0 };
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 92%',
      once: true,
      onEnter: function () {
        gsap.to(tally, {
          n: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function () { stat.textContent = Math.round(tally.n) + '+'; }
        });
      }
    });
  }

  /* ── Section-heading line masks: each heading rises out of a clip.
     Every .section-heading sits below the fold, and the cine-safe
     timer force-clears the transform if anything fails. ── */
  gsap.utils.toArray('.section-heading, .cta-heading').forEach(function (h) {
    var inner = document.createElement('span');
    inner.className = 'cine-mask-inner';
    while (h.firstChild) inner.appendChild(h.firstChild);
    h.appendChild(inner);
    h.classList.add('cine-mask');
    gsap.fromTo(inner, { yPercent: 112 }, {
      yPercent: 0,
      duration: 1.25,
      ease: 'power3.out',
      scrollTrigger: { trigger: h, start: 'top 86%', once: true }
    });
  });

  /* ── Film grain: fixed cinematic texture ── */
  var grain = document.createElement('div');
  grain.className = 'cine-grain';
  grain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(grain);

  /* ── Loading-reveal intro: wordmark rises, hairline draws, curtain
     lifts. Once per session; injected by JS so no-JS and
     reduced-motion visitors never see a curtain at all. ── */
  try {
    if (!sessionStorage.getItem('cineIntroSeen')) {
      sessionStorage.setItem('cineIntroSeen', '1');
      var intro = document.createElement('div');
      intro.className = 'cine-intro';
      intro.setAttribute('aria-hidden', 'true');
      var mask = document.createElement('span');
      mask.className = 'cine-intro__mask';
      var mark = document.createElement('span');
      mark.className = 'cine-intro__mark';
      mark.textContent = 'Altru Radiance';
      mask.appendChild(mark);
      var line = document.createElement('span');
      line.className = 'cine-intro__line';
      intro.appendChild(mask);
      intro.appendChild(line);
      document.body.appendChild(intro);
      gsap.timeline()
        .fromTo(mark, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
        .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'sine.out' }, 0.25)
        .to(intro, {
          autoAlpha: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: function () { intro.remove(); }
        }, 1.15);
    }
  } catch (e) {}
})();
