/**
 * OH! STUDIO — Bold, Tactile & Playful Creative Agency
 * GSAP 3, ScrollTrigger & Lenis Smooth Scroll Orchestration
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. TACTILE AUDIO SYNTHESIZER (WEB AUDIO API)
     ========================================================================== */
  class TactileSoundEngine {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick(pitch = 600, duration = 0.04) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // AudioContext silent fail safe
      }
    }

    playPop(pitch = 380) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      } catch (e) {}
    }

    playChime() {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          setTimeout(() => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.25);
          }, idx * 60);
        });
      } catch (e) {}
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  }

  const soundEngine = new TactileSoundEngine();

  // Sound Toggle UI Button
  const soundToggleBtn = document.getElementById('soundToggle');
  if (soundToggleBtn) {
    const onIcon = soundToggleBtn.querySelector('.icon_sound.on');
    const offIcon = soundToggleBtn.querySelector('.icon_sound.off');

    soundToggleBtn.addEventListener('click', () => {
      soundEngine.init();
      const isEnabled = soundEngine.toggle();
      if (isEnabled) {
        onIcon.style.display = 'block';
        offIcon.style.display = 'none';
        soundToggleBtn.setAttribute('title', 'Sound Effects ON');
        soundEngine.playPop(500);
      } else {
        onIcon.style.display = 'none';
        offIcon.style.display = 'block';
        soundToggleBtn.setAttribute('title', 'Sound Effects MUTED');
      }
    });
  }

  // Attach tactile audio to all buttons and links
  document.querySelectorAll('button, .btn_tactile, .btn_pill, .nav_link, .filter_pill').forEach(el => {
    el.addEventListener('mousedown', () => soundEngine.playClick(620, 0.04));
    el.addEventListener('mouseenter', () => soundEngine.playClick(880, 0.02));
  });

  /* ==========================================================================
     2. LENIS SMOOTH SCROLL & GSAP TICKER INTEGRATION
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
  }

  /* ==========================================================================
     3. CUSTOM TACTILE CURSOR
     ========================================================================== */
  const cursorDot = document.getElementById('customCursor');
  const cursorFollower = document.getElementById('customCursorFollower');

  if (cursorDot && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
    const quickDotX = gsap.quickTo(cursorDot, 'x', { duration: 0.05, ease: 'power2.out' });
    const quickDotY = gsap.quickTo(cursorDot, 'y', { duration: 0.05, ease: 'power2.out' });
    const quickFollowerX = gsap.quickTo(cursorFollower, 'x', { duration: 0.25, ease: 'power3.out' });
    const quickFollowerY = gsap.quickTo(cursorFollower, 'y', { duration: 0.25, ease: 'power3.out' });

    window.addEventListener('mousemove', (e) => {
      quickDotX(e.clientX);
      quickDotY(e.clientY);
      quickFollowerX(e.clientX);
      quickFollowerY(e.clientY);
    });

    // Cursor hover expansion
    const interactiveTargets = document.querySelectorAll('a, button, input, .card_project, .bento_card, .hero_sticker, .showcase_tab');
    interactiveTargets.forEach(target => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ==========================================================================
     4. BOUNCY HERO ENTRANCE CHOREOGRAPHY
     ========================================================================== */
  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    const heroTl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });

    // Navbar entrance
    heroTl.from('.navbar_container', {
      y: -60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Live status pill
    heroTl.from('.hero_status_pill', {
      y: 20,
      opacity: 0,
      scale: 0.85,
      duration: 0.5,
    }, '-=0.4');

    // Expressive headline lines & inline badges
    heroTl.from('.headline_row', {
      y: 45,
      opacity: 0,
      rotation: 1.5,
      stagger: 0.12,
      duration: 0.75,
    }, '-=0.3');

    // Inline pills bounce
    heroTl.from('.inline_pill', {
      scale: 0,
      rotation: -15,
      stagger: 0.15,
      duration: 0.6,
      ease: 'back.out(2.2)',
    }, '-=0.4');

    // Description & CTA buttons
    heroTl.from('.hero_description', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.3');

    heroTl.from('.hero_cta_group .btn_tactile', {
      scale: 0.8,
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
    }, '-=0.4');

    // Floating Stickers Pop
    heroTl.from('.hero_sticker', {
      scale: 0,
      opacity: 0,
      rotation: 'random(-25, 25)',
      stagger: 0.1,
      duration: 0.65,
      ease: 'back.out(2)',
    }, '-=0.3');

    // Showcase Card Reveal
    heroTl.from('#heroShowcase', {
      y: 60,
      opacity: 0,
      scale: 0.96,
      duration: 0.9,
      ease: 'power3.out',
    }, '-=0.4');
  }

  /* ==========================================================================
     5. INTERACTIVE STICKER PARALLAX (gsap.quickTo)
     ========================================================================== */
  const stickers = document.querySelectorAll('.hero_sticker');
  if (stickers.length > 0 && typeof gsap !== 'undefined' && !prefersReducedMotion) {
    const stickerAnims = Array.from(stickers).map((sticker) => {
      const speed = parseFloat(sticker.dataset.parallax || '0.05');
      return {
        el: sticker,
        speed: speed,
        xTo: gsap.quickTo(sticker, 'x', { duration: 0.45, ease: 'power2.out' }),
        yTo: gsap.quickTo(sticker, 'y', { duration: 0.45, ease: 'power2.out' }),
        rotTo: gsap.quickTo(sticker, 'rotation', { duration: 0.5, ease: 'power2.out' }),
        baseRot: sticker.classList.contains('sticker_1') ? -6 :
                 sticker.classList.contains('sticker_2') ? 5 :
                 sticker.classList.contains('sticker_3') ? -3 : 6,
      };
    });

    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const relX = (e.clientX - rect.left) - rect.width / 2;
        const relY = (e.clientY - rect.top) - rect.height / 2;

        stickerAnims.forEach(item => {
          item.xTo(relX * item.speed);
          item.yTo(relY * item.speed);
          item.rotTo(item.baseRot + (relX * item.speed * 0.1));
        });
      });

      heroSection.addEventListener('mouseleave', () => {
        stickerAnims.forEach(item => {
          item.xTo(0);
          item.yTo(0);
          item.rotTo(item.baseRot);
        });
      });
    }
  }

  /* ==========================================================================
     6. MAGNETIC TACTILE CTAs
     ========================================================================== */
  const magneticButtons = document.querySelectorAll('.hero_cta_primary, .nav_cta, .cta_submit_btn, .banner_btn');
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
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      });
    });
  }

  /* ==========================================================================
     7. SCROLL REVEALS & STRAIGHTENING CHOREOGRAPHY (ScrollTrigger)
     ========================================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {

    // Work Project Cards Stagger & Straighten
    gsap.utils.toArray('.card_project').forEach((card, idx) => {
      const initialRot = (idx % 2 === 0) ? -2 : 2;
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        y: 60,
        rotation: initialRot,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
      });
    });

    // Bento Services Cards
    gsap.utils.toArray('.bento_card').forEach((card, idx) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 86%',
        },
        y: 50,
        opacity: 0,
        scale: 0.94,
        duration: 0.7,
        delay: idx * 0.1,
        ease: 'back.out(1.5)',
      });
    });

    // Process Cards
    gsap.utils.toArray('.card_process').forEach((step, idx) => {
      gsap.from(step, {
        scrollTrigger: {
          trigger: step,
          start: 'top 88%',
        },
        y: 45,
        opacity: 0,
        duration: 0.7,
        delay: idx * 0.12,
        ease: 'power3.out',
      });
    });

    // Testimonial Bubble Cards
    gsap.utils.toArray('.card_testimonial').forEach((bubble, idx) => {
      const rot = (idx === 0) ? -1.5 : (idx === 1) ? 1.5 : -1;
      gsap.from(bubble, {
        scrollTrigger: {
          trigger: bubble,
          start: 'top 88%',
        },
        y: 50,
        rotation: rot,
        opacity: 0,
        duration: 0.75,
        delay: idx * 0.1,
        ease: 'back.out(1.4)',
      });
    });

    // Giant CTA Card
    gsap.from('.card_cta_giant', {
      scrollTrigger: {
        trigger: '.card_cta_giant',
        start: 'top 85%',
      },
      y: 60,
      scale: 0.95,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
    });
  }

  /* ==========================================================================
     8. SHOWREEL INTERACTIVE PREVIEW TABS
     ========================================================================== */
  const showcaseTabs = document.querySelectorAll('.showcase_tab');
  const showcaseImg = document.getElementById('showcaseImg');
  const showcasePlayBtn = document.getElementById('showcasePlayBtn');

  if (showcaseTabs.length > 0 && showcaseImg) {
    showcaseTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        showcaseTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        soundEngine.playPop(480);

        const newSrc = tab.dataset.img;
        if (newSrc && typeof gsap !== 'undefined') {
          gsap.to(showcaseImg, {
            opacity: 0.3,
            scale: 0.98,
            duration: 0.2,
            onComplete: () => {
              showcaseImg.src = newSrc;
              gsap.to(showcaseImg, {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: 'power2.out',
              });
            }
          });
        }
      });
    });

    if (showcasePlayBtn) {
      showcasePlayBtn.addEventListener('click', () => {
        soundEngine.playChime();
        gsap.to(showcasePlayBtn, {
          scale: 1.25,
          rotation: 360,
          duration: 0.5,
          ease: 'back.out(2)',
          onComplete: () => {
            gsap.to(showcasePlayBtn, { scale: 1, duration: 0.3 });
          }
        });
      });
    }
  }

  /* ==========================================================================
     9. WORK FILTERING FUNCTIONALITY
     ========================================================================== */
  const filterPills = document.querySelectorAll('.filter_pill');
  const projectCards = document.querySelectorAll('.card_project');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.dataset.filter;
      soundEngine.playPop(420);

      projectCards.forEach(card => {
        const categories = card.dataset.category || '';
        const isMatch = (filterValue === 'all') || categories.includes(filterValue);

        if (isMatch) {
          card.style.display = 'flex';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card,
              { opacity: 0, scale: 0.92, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     10. BENTO MINI INTERACTIVE DEMOS
     ========================================================================== */
  // 1. Stamp button
  const stampBtn = document.getElementById('stampBtn');
  let stampCount = 0;
  if (stampBtn) {
    stampBtn.addEventListener('click', () => {
      stampCount++;
      soundEngine.playPop(700);
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(stampBtn,
          { scale: 0.85, rotation: -8 },
          { scale: 1, rotation: 0, duration: 0.35, ease: 'elastic.out(1.2, 0.4)' }
        );
      }
      stampBtn.querySelector('span').textContent = `STAMPED x${stampCount} ★`;
    });
  }

  // 2. Spring Physics Demo Button
  const springTestBtn = document.getElementById('springTestBtn');
  if (springTestBtn) {
    springTestBtn.addEventListener('click', () => {
      soundEngine.playPop(300);
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(springTestBtn,
          { scaleX: 1.4, scaleY: 0.6, rotation: 8 },
          { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1.5, 0.3)' }
        );
      }
    });
  }

  // 3. Tactile Switch Demo
  const tactileDemoSwitch = document.getElementById('tactileDemoSwitch');
  const switchLabel = document.getElementById('switchLabel');
  if (tactileDemoSwitch && switchLabel) {
    tactileDemoSwitch.addEventListener('change', () => {
      soundEngine.playClick(tactileDemoSwitch.checked ? 750 : 350, 0.05);
      switchLabel.textContent = tactileDemoSwitch.checked
        ? 'Tactile Mode: ACTIVE'
        : 'Tactile Mode: SLEEPING';
    });
  }

  // 4. Device Pills Demo
  const devPills = document.querySelectorAll('.dev_pill');
  devPills.forEach(pill => {
    pill.addEventListener('click', () => {
      devPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      soundEngine.playPop(600);
    });
  });

  /* ==========================================================================
     11. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const navToggle = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      soundEngine.playPop(isOpen ? 540 : 380);

      const lines = navToggle.querySelectorAll('.burger_line');
      if (isOpen) {
        lines[0].style.transform = 'translateY(3.5px) rotate(45deg)';
        lines[1].style.transform = 'translateY(-3.5px) rotate(-45deg)';
      } else {
        lines[0].style.transform = 'none';
        lines[1].style.transform = 'none';
      }
    });

    // Close mobile drawer upon link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        const lines = navToggle.querySelectorAll('.burger_line');
        lines[0].style.transform = 'none';
        lines[1].style.transform = 'none';
      });
    });
  }

  /* ==========================================================================
     12. BACK TO TOP BUTTON WITH SMOOTH SCROLL
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      soundEngine.playPop(650);
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Anchor links smooth scrolling via Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        soundEngine.playPop(480);
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ==========================================================================
     13. LIVE NEW YORK CITY STUDIO CLOCK
     ========================================================================== */
  const liveClockEl = document.getElementById('liveClock');
  function updateNYCClock() {
    if (!liveClockEl) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
      liveClockEl.textContent = `NYC ${timeString} • AVAILABLE FOR NEW COMMISSIONS`;
    } catch (e) {
      // Fallback
    }
  }
  updateNYCClock();
  setInterval(updateNYCClock, 1000);

  /* ==========================================================================
     14. INTERACTIVE PROJECT SUBMISSION & MODAL
     ========================================================================== */
  const inquiryModal = document.getElementById('inquiryModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalText = document.getElementById('modalText');

  window.handleProjectSubmit = function () {
    const emailInput = document.getElementById('clientEmail');
    const scopeInput = document.querySelector('input[name="scope"]:checked');
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const scopeVal = scopeInput ? scopeInput.value : 'Brand Identity';

    if (!emailVal || !emailVal.includes('@')) {
      alert('Please enter a valid work email address.');
      return;
    }

    soundEngine.playChime();

    if (modalText) {
      modalText.textContent = `Thank you for requesting "${scopeVal}". We've dispatched our project scoping deck and booking link directly to ${emailVal}. Let's make something they can't ignore!`;
    }

    if (inquiryModal) {
      inquiryModal.classList.add('active');
      inquiryModal.setAttribute('aria-hidden', 'false');
    }

    if (emailInput) emailInput.value = '';
  };

  function closeModal() {
    if (inquiryModal) {
      inquiryModal.classList.remove('active');
      inquiryModal.setAttribute('aria-hidden', 'true');
      soundEngine.playPop(350);
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && inquiryModal && inquiryModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Log OH! STUDIO creative developer greeting
  console.log(
    '%c⚡ OH! STUDIO — BOLD, TACTILE & PLAYFUL CREATIVE LAB',
    'background: #CCFF00; color: #121212; font-size: 14px; font-weight: 800; padding: 6px 12px; border: 2px solid #121212; border-radius: 6px;'
  );
});
