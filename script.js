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
      duration: 1.2,
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
  }

  /* ==========================================================================
     2. CUSTOM EDITORIAL CURSOR
     ========================================================================== */
  const cursorDot = document.getElementById('customCursor');
  const cursorFollower = document.getElementById('customCursorFollower');

  if (cursorDot && cursorFollower && window.matchMedia('(pointer: fine)').matches && typeof gsap !== 'undefined') {
    const quickDotX = gsap.quickTo(cursorDot, 'x', { duration: 0.06, ease: 'power2.out' });
    const quickDotY = gsap.quickTo(cursorDot, 'y', { duration: 0.06, ease: 'power2.out' });
    const quickFollowerX = gsap.quickTo(cursorFollower, 'x', { duration: 0.22, ease: 'power3.out' });
    const quickFollowerY = gsap.quickTo(cursorFollower, 'y', { duration: 0.22, ease: 'power3.out' });

    window.addEventListener('mousemove', (e) => {
      quickDotX(e.clientX);
      quickDotY(e.clientY);
      quickFollowerX(e.clientX);
      quickFollowerY(e.clientY);
    });

    const hoverTargets = document.querySelectorAll('a, button, input, .card_work, .capability_card, .showcase_frame');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ==========================================================================
     3. EDITORIAL HERO REVEAL (MASKED SLIDE-UP + SHOWCASE REVEAL)
     ========================================================================== */
  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Navbar entrance
    heroTl.from('.navbar_container', {
      y: -50,
      opacity: 0,
      duration: 0.85,
    });

    // Top eyebrow tag
    heroTl.from('.hero_eyebrow_wrap', {
      opacity: 0,
      y: 20,
      duration: 0.6,
    }, '-=0.4');

    // Masked line-by-line slide-up
    heroTl.from('.headline_mask .headline_inner', {
      yPercent: 110,
      duration: 1.15,
      stagger: 0.12,
    }, '-=0.3');

    // Descriptor and buttons
    heroTl.from('.hero_descriptor', {
      opacity: 0,
      y: 25,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.5');

    heroTl.from('.hero_cta_group .btn_tactile', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.4');

    // Showcase scale-in
    heroTl.from('.showcase_frame', {
      scale: 0.94,
      opacity: 0,
      y: 40,
      duration: 1.1,
      ease: 'power3.out',
    }, '-=0.5');

    // Scroll-driven scale-down parallax on the hero showcase
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to('.showcase_media', {
        scrollTrigger: {
          trigger: '.hero_showcase_wrap',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        yPercent: 12,
        scale: 1.08,
      });
    }
  }

  /* ==========================================================================
     4. MAGNETIC PILL BUTTONS
     ========================================================================== */
  const magneticButtons = document.querySelectorAll('.hero_btn_primary, .nav_cta, #submitBtn');
  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    magneticButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.28,
          y: y * 0.28,
          duration: 0.2,
          ease: 'power2.out',
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: 'elastic.out(1, 0.4)',
        });
      });
    });
  }

  /* ==========================================================================
     5. SCROLL-LINKED PARALLAX & REVEALS (SCROLLTRIGGER)
     ========================================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {

    // Portfolio Image Scrub Parallax
    gsap.utils.toArray('.work_img[data-parallax="true"]').forEach((img) => {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img.closest('.card_work'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        yPercent: -12,
        ease: 'none',
      });
    });

    // Portfolio Card Scroll Reveal
    gsap.utils.toArray('.card_work').forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    // Capabilities Section Stagger
    gsap.utils.toArray('.capability_card').forEach((cap, idx) => {
      gsap.from(cap, {
        scrollTrigger: {
          trigger: cap,
          start: 'top 86%',
        },
        y: 45,
        opacity: 0,
        duration: 0.75,
        delay: idx * 0.1,
        ease: 'power3.out',
      });
    });

    // Stats Counter Animation
    gsap.utils.toArray('.stat_number').forEach((statEl) => {
      const targetVal = parseInt(statEl.dataset.target, 10) || 0;
      const suffix = statEl.dataset.suffix || '';

      ScrollTrigger.create({
        trigger: statEl,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: targetVal,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: function () {
              statEl.textContent = Math.round(this.targets()[0].val) + suffix;
            },
          });
        },
      });
    });
  }

  /* ==========================================================================
     6. PORTFOLIO FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter_btn');
  const workCards = document.querySelectorAll('.card_work');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;

      workCards.forEach(card => {
        const cat = card.dataset.category || '';
        const isMatch = (filterVal === 'all') || cat.includes(filterVal);

        if (isMatch) {
          card.style.display = 'flex';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            );
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     7. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const navToggle = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);

      const bars = navToggle.querySelectorAll('.burger_bar');
      if (isOpen) {
        bars[0].style.transform = 'translateY(3.5px) rotate(45deg)';
        bars[1].style.transform = 'translateY(-3.5px) rotate(-45deg)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.transform = 'none';
      }
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        const bars = navToggle.querySelectorAll('.burger_bar');
        bars[0].style.transform = 'none';
        bars[1].style.transform = 'none';
      });
    });
  }

  /* ==========================================================================
     8. BACK TO TOP & ANCHOR SMOOTH SCROLL
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ==========================================================================
     9. LIVE STUDIO CLOCK (NYC TIME)
     ========================================================================== */
  const clockEl = document.getElementById('nycClock');
  function updateClock() {
    if (!clockEl) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      clockEl.textContent = `NYC ${timeStr} • AVAILABLE FOR COMMISSIONS`;
    } catch (e) {}
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ==========================================================================
     10. DIALOGUE MODAL SUBMISSION
     ========================================================================== */
  const dialogueModal = document.getElementById('dialogueModal');
  const modalClose = document.getElementById('modalClose');
  const modalDismiss = document.getElementById('modalDismiss');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalText = document.getElementById('modalText');

  window.handleDialogueSubmit = function () {
    const emailInput = document.getElementById('clientEmail');
    const scopeOption = document.querySelector('input[name="scope"]:checked');
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const scopeVal = scopeOption ? scopeOption.value : 'Complete Rebrand';

    if (!emailVal || !emailVal.includes('@')) {
      alert('Please enter a valid work email.');
      return;
    }

    if (modalText) {
      modalText.textContent = `Thank you for initiating conversation regarding "${scopeVal}". Our principals have dispatched our private atelier dossier and direct calendar invite to ${emailVal}.`;
    }

    if (dialogueModal) {
      dialogueModal.classList.add('active');
      dialogueModal.setAttribute('aria-hidden', 'false');
    }

    if (emailInput) emailInput.value = '';
  };

  function closeDialog() {
    if (dialogueModal) {
      dialogueModal.classList.remove('active');
      dialogueModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeDialog);
  if (modalDismiss) modalDismiss.addEventListener('click', closeDialog);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeDialog);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialogueModal && dialogueModal.classList.contains('active')) {
      closeDialog();
    }
  });

  // Showcase click feedback
  const showcasePlay = document.getElementById('showcasePlay');
  if (showcasePlay && typeof gsap !== 'undefined') {
    showcasePlay.addEventListener('click', () => {
      gsap.to(showcasePlay, {
        scale: 1.15,
        duration: 0.3,
        ease: 'back.out(2)',
        onComplete: () => {
          gsap.to(showcasePlay, { scale: 1, duration: 0.25 });
        }
      });
    });
  }

  console.log(
    '%c✦ OH! STUDIO — STRICT TWO-TONE EDITORIAL ATELIER',
    'background: #790B13; color: #FFF0DC; font-size: 13px; font-weight: 800; padding: 6px 12px; border-radius: 4px;'
  );
});
