/* ============================================================
   reviews-widget.js — Live Google Reviews mount system

   Finds [data-altru-reviews] elements on the page, fetches
   /api/reviews?include=reviews once, then replaces each mount's
   children with rendered review nodes in the appropriate shape.

   On ANY failure (network, 5xx, malformed JSON, empty reviews),
   mounts remain untouched and existing hardcoded HTML stays
   visible as the fallback. No spinner / skeleton — hardcoded
   HTML IS the loading state.

   Shapes (set via data-altru-reviews attribute):
     carousel         - .reviews-carousel (cycling slides, prev/next/dots)
     row              - .reviews-row (3-card grid)
     testimonial-card - .testimonial-card (single card)
     sidebar          - service-page sidebar block (single quote)

   XSS-safe: nodes are built via document.createElement +
   textContent; mount contents are swapped via replaceChildren
   (which accepts DOM nodes, not strings — no HTML parser round-trip).
   ============================================================ */
(function () {
  'use strict';

  // ---- Init / fetch ----

  function init() {
    var mounts = document.querySelectorAll('[data-altru-reviews]');
    if (mounts.length === 0) return;

    fetch('/api/reviews?include=reviews', { credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) return Promise.reject('http_' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data || !Array.isArray(data.reviews) || data.reviews.length === 0) {
          return Promise.reject('empty');
        }
        Array.prototype.forEach.call(mounts, function (mount) {
          try {
            render(mount, data.reviews);
          } catch (renderErr) {
            console.warn('[reviews-widget] render failed for', mount, renderErr);
          }
        });
      })
      .catch(function (err) {
        console.warn('[reviews-widget] live reviews unavailable, hardcoded fallback retained:', err);
      });
  }

  function render(mount, reviews) {
    var shape = mount.getAttribute('data-altru-reviews');
    switch (shape) {
      case 'carousel':
        renderCarousel(mount, reviews);
        wireCarousel(mount);
        break;
      case 'row':
        replaceChildrenWith(mount, renderRow(reviews));
        break;
      case 'testimonial-card':
        replaceChildrenWith(mount, renderTestimonialCard(reviews));
        break;
      case 'sidebar':
        replaceChildrenWith(mount, renderSidebar(reviews));
        break;
      default:
        console.warn('[reviews-widget] unknown shape:', shape);
    }
  }

  // ---- DOM helpers ----

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function replaceChildrenWith(parent, nodes) {
    // Cross-browser equivalent: clear then append. replaceChildren is
    // baseline 2020+ but we use the loop form for max safety.
    while (parent.firstChild) parent.removeChild(parent.firstChild);
    for (var i = 0; i < nodes.length; i++) parent.appendChild(nodes[i]);
  }

  function stars(rating) {
    var r = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  // ---- Carousel shape (index.html .reviews-carousel) ----
  //
  // The carousel mount preserves its existing .reviews-nav and
  // .reviews-footer (the Google badge + policy link). The widget
  // only replaces children of the .reviews-track inside it, then
  // rebuilds the .reviews-dots inside the existing .reviews-nav
  // and re-wires prev/next/dots handlers.

  function renderCarousel(mount, reviews) {
    var track = mount.querySelector('.reviews-track');
    if (!track) return;
    var slides = reviews.map(function (rev, i) {
      var slide = el('div', i === 0 ? 'review-slide active' : 'review-slide');
      slide.setAttribute('data-index', String(i));
      slide.appendChild(el('div', 'review-stars', stars(rev.rating)));
      slide.appendChild(el('p', 'review-text', rev.text));
      var author = el('div', 'review-author');
      var line = el('div', 'review-author-line');
      line.appendChild(el('span', 'review-name', rev.author));
      line.appendChild(el('span', 'review-detail', 'Google Review · ' + (rev.relativeTime || '')));
      author.appendChild(line);
      slide.appendChild(author);
      return slide;
    });
    replaceChildrenWith(track, slides);
  }

  function wireCarousel(mount) {
    var slides = mount.querySelectorAll('.review-slide');
    var dotsContainer = mount.querySelector('#reviewDots');
    var prevBtn = mount.querySelector('#reviewPrev');
    var nextBtn = mount.querySelector('#reviewNext');
    if (!slides.length || !dotsContainer || !prevBtn || !nextBtn) return;

    // Build dots fresh (one per slide)
    var dots = [];
    while (dotsContainer.firstChild) dotsContainer.removeChild(dotsContainer.firstChild);
    for (var i = 0; i < slides.length; i++) {
      (function (idx) {
        var dot = el('button', idx === 0 ? 'review-dot active' : 'review-dot');
        dot.setAttribute('aria-label', 'Go to review ' + (idx + 1));
        dot.addEventListener('click', function () { showSlide(idx); });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      })(i);
    }

    var current = 0;
    function showSlide(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    prevBtn.addEventListener('click', function () { showSlide(current - 1); });
    nextBtn.addEventListener('click', function () { showSlide(current + 1); });

    // Auto-rotate every 7s, pause on hover. Honor prefers-reduced-motion.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var interval = setInterval(function () { showSlide(current + 1); }, 7000);
    mount.addEventListener('mouseenter', function () { clearInterval(interval); interval = null; });
    mount.addEventListener('mouseleave', function () {
      if (!interval) interval = setInterval(function () { showSlide(current + 1); }, 7000);
    });
  }

  // ---- Row shape (foundation-package.html, welcome-bundle.html) ----

  function renderRow(reviews) {
    return reviews.slice(0, 3).map(function (rev) {
      var card = el('div', 'review-card');
      card.appendChild(el('div', 'review-stars', stars(rev.rating)));
      card.appendChild(el('div', 'review-text', '“' + rev.text + '”'));
      card.appendChild(el('div', 'review-author', '— ' + rev.author + ' · Google Review'));
      return card;
    });
  }

  // ---- Testimonial-card shape (results.html) ----

  function renderTestimonialCard(reviews) {
    var rev = reviews[0];
    return [
      el('div', 'review-stars', stars(rev.rating)),
      el('p', 'review-quote', '"' + rev.text + '"'),
      el('p', 'review-author', rev.author),
      el('p', 'review-source', 'Verified Google Review'),
    ];
  }

  // ---- Sidebar shape (service pages) ----

  function renderSidebar(reviews) {
    var rev = reviews[0];
    return [
      el('span', 'sidebar-label', 'What Clients Say'),
      el('div', 'sidebar-stars', stars(rev.rating)),
      el('p', 'sidebar-review', '"' + rev.text + '"'),
      el('div', 'sidebar-review-author', rev.author + ' · Google Review'),
    ];
  }

  // ---- Bootstrap ----

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
