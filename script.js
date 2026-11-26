/**
 * OH! STUDIO — Strict Two-Tone Editorial Creative Studio
 * GSAP 3, ScrollTrigger & Lenis Smooth Scroll Orchestration
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. LENIS SMOOTH SCROLL & GSAP TICKER INTEGRATION
     ========================================================================== */
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  } else if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ==========================================================================
     2. EDITORIAL HERO REVEAL
     ========================================================================== */
  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    heroTl.from('.hero_eyebrow_wrap', {
      opacity: 0,
      y: 16,
      duration: 0.6,
    });

    heroTl.from('.headline_mask .headline_inner', {
      yPercent: 108,
      duration: 1.05,
      stagger: 0.1,
    }, '-=0.35');

    heroTl.from('.hero_descriptor', {
      opacity: 0,
      y: 20,
      duration: 0.65,
      ease: 'power3.out',
    }, '-=0.5');

    heroTl.from('.hero_cta_group .btn_tactile', {
      opacity: 0,
      y: 16,
      stagger: 0.08,
      duration: 0.55,
      ease: 'power3.out',
    }, '-=0.45');

    heroTl.from('.showcase_frame', {
      scale: 0.97,
      opacity: 0,
      y: 28,
      duration: 0.95,
      ease: 'power3.out',
    }, '-=0.45');

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to('.showcase_media', {
        scrollTrigger: {
          trigger: '.hero_showcase_wrap',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        yPercent: 10,
        scale: 1.06,
      });
    }
  }

  /* ==========================================================================
     3. SCROLL-LINKED PARALLAX & REVEALS
     ========================================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    // Work image parallax
    gsap.utils.toArray('.work_img[data-parallax="true"]').forEach((img) => {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img.closest('.card_work'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        yPercent: -10,
        ease: 'none',
      });
    });

    // Work card entrance
    gsap.utils.toArray('.card_work').forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
        },
        y: 32,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
      });
    });

    // Practice index rows
    gsap.utils.toArray('.capability_row').forEach((row, idx) => {
      gsap.from(row, {
        scrollTrigger: {
          trigger: row,
          start: 'top 88%',
        },
        y: 24,
        opacity: 0,
        duration: 0.65,
        delay: idx * 0.06,
        ease: 'power3.out',
      });
    });

    // Studio Ethos quote scroll-scrubbed highlight & facts stagger
    gsap.fromTo('.ethos_quote',
      { opacity: 0.32, y: 18 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ethos_layout',
          start: 'top 85%',
          end: 'top 42%',
          scrub: true,
        },
      }
    );

    gsap.from('.fact_item', {
      scrollTrigger: {
        trigger: '.studio_facts_strip',
        start: 'top 86%',
      },
      y: 24,
      opacity: 0,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power3.out',
    });

    // Navbar logo tactile hover micro-interaction
    const navLogo = document.querySelector('.nav_logo_svg');
    if (navLogo) {
      const navBrand = navLogo.closest('.nav_brand') || navLogo;
      navBrand.addEventListener('mouseenter', () => {
        gsap.to(navLogo, {
          scale: 1.06,
          rotation: -2,
          duration: 0.35,
          ease: 'back.out(2)',
        });
      });
      navBrand.addEventListener('mouseleave', () => {
        gsap.to(navLogo, {
          scale: 1,
          rotation: 0,
          duration: 0.35,
          ease: 'back.out(2)',
        });
      });
    }

    // Monumental Footer SVG reveal + interactive star wiggle
    const footerLogoSvg = document.getElementById('footerLogoSvg');
    if (footerLogoSvg) {
      gsap.fromTo(footerLogoSvg,
        { yPercent: 60, scale: 0.94, opacity: 0 },
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.monumental_wordmark_wrap',
            start: 'top 92%',
            once: true,
          },
        }
      );

      const pabgosStar = document.getElementById('pabgos-star');
      if (pabgosStar) {
        footerLogoSvg.addEventListener('mouseenter', () => {
          gsap.to(pabgosStar, {
            rotation: 15,
            scale: 1.15,
            transformOrigin: '50% 50%',
            duration: 0.35,
            ease: 'back.out(2)',
          });
        });
        footerLogoSvg.addEventListener('mouseleave', () => {
          gsap.to(pabgosStar, {
            rotation: 0,
            scale: 1,
            transformOrigin: '50% 50%',
            duration: 0.35,
            ease: 'back.out(2)',
          });
        });
      }
    }
  }

  /* ==========================================================================
     4. PORTFOLIO FILTERING (WITH ARIA-SELECTED SYNC)
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter_btn');
  const workCards = document.querySelectorAll('.card_work');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = btn.dataset.filter;

      workCards.forEach((card) => {
        const cat = card.dataset.category || '';
        const isMatch = filterVal === 'all' || cat.includes(filterVal);

        if (isMatch) {
          card.style.display = 'flex';
          if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
            gsap.fromTo(card,
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            );
          }
        } else {
          card.style.display = 'none';
        }
      });

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  /* ==========================================================================
     5. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const navToggle = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));

      const bars = navToggle.querySelectorAll('.burger_bar');
      if (isOpen) {
        bars[0].style.transform = 'translateY(3.25px) rotate(45deg)';
        bars[1].style.transform = 'translateY(-3.25px) rotate(-45deg)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.transform = 'none';
      }
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        const bars = navToggle.querySelectorAll('.burger_bar');
        bars[0].style.transform = 'none';
        bars[1].style.transform = 'none';
      });
    });
  }

  /* ==========================================================================
     6. BACK TO TOP & ANCHOR SMOOTH SCROLL
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -72, duration: 1.1 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ==========================================================================
     7. LIVE STUDIO CLOCK (NEW YORK)
     ========================================================================== */
  const clockEl = document.getElementById('nycClock');
  function updateClock() {
    if (!clockEl) return;
    try {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(now);
      clockEl.textContent = `New York — ${timeStr}`;
    } catch (e) {}
  }
  updateClock();
  setInterval(updateClock, 15000);

  /* ==========================================================================
     8. CASE STUDY & INQUIRY MODAL (FOCUS TRAP + SCROLL LOCK + GSAP)
     ========================================================================== */
  const dialogueModal = document.getElementById('dialogueModal');
  const modalBox = dialogueModal ? dialogueModal.querySelector('.modal_box') : null;
  const modalClose = document.getElementById('modalClose');
  const modalDismiss = document.getElementById('modalDismiss');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalEyebrow = document.getElementById('modalEyebrow');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalMeta = document.getElementById('modalMeta');
  const formFeedback = document.getElementById('formFeedback');

  let lastFocusedElement = null;

  const caseStudies = {
    'maison-verre': {
      eyebrow: 'Case Study · 2026',
      title: 'Maison Verre',
      description:
        'For Paris botanical house Maison Verre, we developed a restrained serif-and-grotesque typographic system, tactile apothecary packaging, and a custom Webflow commerce flagship built around editorial storytelling.',
      meta: 'Client: Maison Verre Paris · Scope: Identity, Art Direction, Webflow',
    },
    'kunsthalle-basel': {
      eyebrow: 'Case Study · 2026',
      title: 'Kunsthalle Archive',
      description:
        'Commissioned by an independent architecture foundation in Zürich, this digital exhibition index pairs a strict Swiss grid with smooth scroll-linked spatial transitions across 140+ archival installations.',
      meta: 'Client: Kunsthalle Stiftung Zürich · Scope: Digital Flagship, Motion',
    },
    'braun-acoustic': {
      eyebrow: 'Case Study · 2025',
      title: 'Vesper Audio',
      description:
        'A tactile hardware identity and interactive product launch for Berlin acoustic studio Vesper. Every detail—from machined aluminum packaging marks to WebAudio-reactive previews—was built in-house.',
      meta: 'Client: Vesper Acoustic GmbH · Scope: Identity, Sound & Motion',
    },
    'editions-mare': {
      eyebrow: 'Case Study · 2025',
      title: 'Éditions Maré',
      description:
        'An editorial reading room and catalog for Geneva art book publisher Éditions Maré, translating their signature print margins and footnote choreography into a responsive Framer site.',
      meta: 'Client: Éditions Maré Genève · Scope: Editorial Type, Framer',
    },
    'korsholm': {
      eyebrow: 'Case Study · 2026',
      title: 'Korsholm Objects',
      description:
        'A digital showroom and material library for Copenhagen furniture studio Korsholm, highlighting solid ash joinery and brushed steel finishes through quiet pacing and high-resolution detail.',
      meta: 'Client: Korsholm Atelier · Scope: Design System, Framer',
    },
  };

  function getFocusableModalElements() {
    if (!modalBox) return [];
    return Array.from(
      modalBox.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }

  function openModal({ eyebrow, title, description, meta }) {
    if (!dialogueModal) return;
    lastFocusedElement = document.activeElement;

    if (modalEyebrow) modalEyebrow.textContent = eyebrow;
    if (modalTitle) modalTitle.textContent = title;
    if (modalText) modalText.textContent = description;
    if (modalMeta) modalMeta.textContent = meta || '';

    dialogueModal.classList.add('active');
    dialogueModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();

    if (typeof gsap !== 'undefined' && !prefersReducedMotion && modalBox && modalBackdrop) {
      gsap.fromTo(modalBackdrop, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      gsap.fromTo(modalBox,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
      );
    }

    if (modalClose) {
      modalClose.focus();
    }
  }

  function finalizeClose() {
    if (!dialogueModal) return;
    dialogueModal.classList.remove('active');
    dialogueModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function closeDialog() {
    if (!dialogueModal || !dialogueModal.classList.contains('active')) return;
    if (typeof gsap !== 'undefined' && !prefersReducedMotion && modalBox && modalBackdrop) {
      gsap.to(modalBackdrop, { opacity: 0, duration: 0.2, ease: 'power2.in' });
      gsap.to(modalBox, {
        opacity: 0,
        y: 12,
        scale: 0.98,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: finalizeClose,
      });
    } else {
      finalizeClose();
    }
  }

  workCards.forEach((card) => {
    const key = card.dataset.project;
    const study = caseStudies[key];
    if (!study) return;

    card.addEventListener('click', () => openModal(study));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(study);
      }
    });
  });

  window.handleDialogueSubmit = function () {
    const form = document.getElementById('dialogueForm');
    const emailInput = document.getElementById('clientEmail');
    const scopeOption = document.querySelector('input[name="scope"]:checked');
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const scopeVal = scopeOption ? scopeOption.value : 'Brand Identity';

    if (!emailVal || !emailVal.includes('@')) {
      if (formFeedback) {
        formFeedback.textContent = 'Please enter a valid work email address.';
      }
      if (emailInput) emailInput.focus();
      return;
    }

    if (formFeedback) formFeedback.textContent = '';

    // Submit to Netlify Forms when hosted, with graceful local fallback
    const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
    if (!isLocal && form) {
      const formData = new URLSearchParams();
      formData.append('form-name', 'inquiry');
      formData.append('scope', scopeVal);
      formData.append('email', emailVal);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      }).catch(() => {});
    }

    openModal({
      eyebrow: 'Inquiry Received',
      title: 'Thank you.',
      description: `We have received your note regarding ${scopeVal}. Our partners will reply to ${emailVal} within one business day.`,
      meta: 'OH! STUDIO — New York & London',
    });

    if (emailInput) emailInput.value = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeDialog);
  if (modalDismiss) modalDismiss.addEventListener('click', closeDialog);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeDialog);

  document.addEventListener('keydown', (e) => {
    if (!dialogueModal || !dialogueModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeDialog();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = getFocusableModalElements();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
});
