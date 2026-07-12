/* ─── ALTRU CINEMATIC LAYER ─────────────────────────────────────────
   Scroll choreography for the homepage: entry reveals, the pinned
   Soothe Arc sequence, the philosophy scroll-fill, hero drift, and the
   scroll-progress counter. GSAP + ScrollTrigger on NATIVE scroll.

   Scrolling stays native (Andrew, 2026-07-11): a smooth-scroll lib
   that rewrites scrollTop every frame breaks keyboard scrolling
   (Space/PageDown/arrows/Home/End) and #hash anchor links. CSS
   `scroll-behavior: smooth` supplies the glide instead — do not
   reintroduce Lenis or any scroll hijacker.

   Fail-safe contract (site rule: JS may never hide content for good):
   - The `cine-on` class (added by a tiny head script) gates ALL initial
     hidden states in CSS. No JS, or prefers-reduced-motion → class never
     lands → the page is fully static and fully visible.
   - A `cine-safe` timer below force-reveals everything 4s after load
     even if GSAP failed mid-flight.
   - Phones run the cinematic tier with 9:16 stage cuts, but the Soothe
     Arc pin is desktop-only — on touch the four movements render as
     normal stacked stills. Reduced-motion stays fully static.

   Motion law (Altru): slow, organic, breathing. Nothing snappy, no
   bounce, no elastic. Sine/power2 easing only. Ambient/decorative
   motion runs 1.2–1.6s, but entry reveals must beat the scroll — keep
   them 0.4–0.6s or content crosses the viewport still half-faded.
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
    start: 'top 95%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.06,
        overwrite: true
      });
    }
  });
  // Anything already inside the first viewport reveals immediately.
  ScrollTrigger.refresh();

  /* ── Hero drift: headline eases up + fades as the visitor leaves.
     The fade spans the hero's FULL height and holds opacity at 1 for
     the first 40% of it, so the headline stays readable well past the
     first few wheel ticks. ── */
  var heroInner = document.querySelector('.hero-inner');
  if (heroInner) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })
      .to(heroInner, { yPercent: -10, ease: 'none', duration: 1 }, 0)
      .to(heroInner, { opacity: 0.3, ease: 'none', duration: 0.6 }, 0.4);
  }

  /* ── The Soothe Arc: four-frame sequence — pinned scrub on wide
     fine-pointer screens, plain stacked stills (pure CSS) on touch
     and narrow viewports. gsap.matchMedia re-picks the variant on
     resize/rotation and reverts each one's triggers itself. ── */
  var arc = document.querySelector('.soothe-arc');
  if (arc) {
    var frames = gsap.utils.toArray('.soothe-arc .arc-frame');
    var captions = gsap.utils.toArray('.soothe-arc .arc-caption');
    var idxEl = arc.querySelector('.arc-index');
    // DOM puts the FINAL frame first so no-JS visitors see the strongest
    // still. ORDER maps narrative stage -> DOM index: room, oil, hands, final.
    var ORDER = [1, 2, 3, 0];

    if (frames.length === 4) {
      var mm = gsap.matchMedia();

      // Touch and narrow viewports skip the pin — a multi-viewport
      // scroll lock reads as a dead zone on touch (pointer: coarse
      // catches tablets and landscape phones wider than 768px). The
      // .arc-stacked CSS restacks the movements into narrative order.
      mm.add('(max-width: 768px), (pointer: coarse)', function () {
        arc.classList.add('arc-stacked');
        return function () { arc.classList.remove('arc-stacked'); };
      });

      mm.add('(min-width: 769px) and (pointer: fine)', function () {
        // Each caption's words go into overflow masks so stage changes
        // can rise word-by-word instead of a flat fade. <em> survives
        // intact. Wrap once — this context re-runs on breakpoint
        // changes, and the masks persist across them.
        captions.forEach(function (cap) {
          if (cap.querySelector('.cw')) return;
          Array.prototype.slice.call(cap.childNodes).forEach(function (node) {
            if (node.nodeType === 3) {
              var frag = document.createDocumentFragment();
              node.textContent.split(/(\s+)/).forEach(function (part) {
                if (!part) return;
                if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
                var mask = document.createElement('span');
                mask.className = 'cw';
                var inner = document.createElement('span');
                inner.textContent = part;
                mask.appendChild(inner);
                frag.appendChild(mask);
              });
              cap.replaceChild(frag, node);
            } else if (node.nodeType === 1 && node.tagName !== 'BR') {
              var mask = document.createElement('span');
              mask.className = 'cw';
              var inner = document.createElement('span');
              cap.insertBefore(mask, node);
              inner.appendChild(node);
              mask.appendChild(inner);
            }
          });
        });

        // JS owns the sequence from here; start at stage one (the room).
        var setStage = function (n) {
          var d = ORDER[n];
          frames.forEach(function (f, i) { f.classList.toggle('is-active', i === d); });
          captions.forEach(function (c, i) { c.classList.toggle('is-active', i === d); });
          var words = captions[d].querySelectorAll('.cw > span');
          if (words.length) {
            gsap.fromTo(words, { yPercent: 112 }, {
              yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, overwrite: true
            });
          }
          if (idxEl) {
            idxEl.textContent = '0' + (n + 1);
            gsap.fromTo(idxEl, { yPercent: 55, autoAlpha: 0 }, {
              yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out', overwrite: true
            });
          }
        };
        setStage(0);
        var current = 0;
        ScrollTrigger.create({
          trigger: arc,
          start: 'top top',
          end: '+=180%',
          pin: true,
          anticipatePin: 1,
          scrub: true,
          onUpdate: function (self) {
            var stage = Math.min(3, Math.floor(self.progress * 4));
            if (stage !== current) { current = stage; setStage(stage); }
          }
        });
        // Alternating Ken Burns: odd frames breathe in while even frames
        // settle out, so every cut lands with different cinematography.
        frames.forEach(function (f, i) {
          gsap.fromTo(f,
            { scale: i % 2 ? 1 : 1.07 },
            { scale: i % 2 ? 1.07 : 1, ease: 'none',
              scrollTrigger: { trigger: arc, start: 'top top', end: '+=180%', scrub: true } });
        });
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
  gsap.utils.toArray('.section-heading, .cta-heading, .carousel-headline').forEach(function (h) {
    var inner = document.createElement('span');
    inner.className = 'cine-mask-inner';
    while (h.firstChild) inner.appendChild(h.firstChild);
    h.appendChild(inner);
    h.classList.add('cine-mask');
    gsap.fromTo(inner, { yPercent: 112 }, {
      yPercent: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: h, start: 'top 95%', once: true }
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
  var introPlays = false;
  try {
    if (!sessionStorage.getItem('cineIntroSeen')) {
      introPlays = true;
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

  /* ── Hero entrance: type choreography replaces the CSS fades. The
     headline rises out of a mask off the back of the intro; the gold
     line draws down; eyebrow, tagline, sub and glossary cascade. ── */
  (function () {
    var eyebrow = document.querySelector('.hero-eyebrow');
    var headline = document.querySelector('.hero-headline');
    var tagline = document.querySelector('.hero-tagline');
    var sub = document.querySelector('.hero-sub');
    var glossary = document.querySelector('.hero-glossary');
    var line = document.querySelector('.hero-line');
    if (!headline) return;
    // The headline paints via background-clip:text, so its TEXT must stay
    // inside the element — wrap the element itself in the overflow mask
    // and translate the whole headline, never its children.
    var hMask = document.createElement('span');
    hMask.style.display = 'block';
    hMask.style.overflow = 'hidden';
    headline.parentNode.insertBefore(hMask, headline);
    hMask.appendChild(headline);
    gsap.set(headline, { display: 'block' });
    var tl = gsap.timeline({ delay: introPlays ? 1.15 : 0.2 });
    if (line) tl.fromTo(line, { scaleY: 0, transformOrigin: 'top center' }, { scaleY: 1, duration: 1.1, ease: 'sine.out' }, 0);
    if (eyebrow) tl.fromTo(eyebrow, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.1);
    tl.fromTo(headline, { yPercent: 112 }, { yPercent: 0, duration: 1.35, ease: 'power3.out' }, 0.25);
    if (tagline) tl.fromTo(tagline, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 0.75);
    if (sub) tl.fromTo(sub, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 0.95);
    if (glossary) tl.fromTo(glossary, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.1, ease: 'power2.out' }, 1.15);
  })();

  /* ── Cursor halo: candlelight trails the pointer with lag ── */
  if (window.matchMedia('(pointer: fine)').matches) {
    var halo = document.createElement('div');
    halo.className = 'cine-halo';
    halo.setAttribute('aria-hidden', 'true');
    document.body.appendChild(halo);
    gsap.set(halo, { autoAlpha: 0 });
    var hxTo = gsap.quickTo(halo, 'x', { duration: 0.9, ease: 'power3.out' });
    var hyTo = gsap.quickTo(halo, 'y', { duration: 0.9, ease: 'power3.out' });
    window.addEventListener('pointermove', function (e) {
      gsap.to(halo, { autoAlpha: 1, duration: 0.6, overwrite: 'auto' });
      hxTo(e.clientX);
      hyTo(e.clientY);
    }, { passive: true });
  }

  /* ── Ghost band: the wordmark drifts, slow as breath ── */
  var ghostTrack = document.querySelector('.ghost-band__track');
  if (ghostTrack) {
    gsap.to(ghostTrack, { xPercent: -50, ease: 'none', duration: 55, repeat: -1 });
  }

  /* ── Editorial parallax: media drifts inside its frames ── */
  var philImg = document.querySelector('.philosophy-image-wrap img');
  if (philImg) {
    gsap.fromTo(philImg, { yPercent: -6, scale: 1.14 }, {
      yPercent: 6, scale: 1.14, ease: 'none',
      scrollTrigger: { trigger: '.philosophy-image-parallax', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  }
  // Result-card photos get NO drift/zoom (Andrew, 2026-07-11): they are
  // before/after evidence composites whose 3:4 frame matches the photo
  // exactly, so any scale or yPercent shift crops the faces — the proof
  // must stay fully readable. Parallax belongs on mood imagery only.

  /* ── Scroll-progress counter. Created LAST, after every pinned
     trigger, and refreshed after all pins (refreshPriority: -1), so
     its range includes the Soothe Arc's pin spacing — otherwise it
     reads 100 with two viewports of page still below. ── */
  var pctEl = document.getElementById('scrollPct');
  if (pctEl) {
    ScrollTrigger.create({
      start: 0,
      end: function () { return ScrollTrigger.maxScroll(window); },
      refreshPriority: -1,
      onUpdate: function (self) {
        pctEl.textContent = String(Math.round(self.progress * 100)).padStart(2, '0');
      }
    });
  }
  ScrollTrigger.refresh();
})();
