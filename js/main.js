/**
 * Akaden Landing Page Interactive Logic
 * Fulfills all user specifications:
 * 1. Classic flow: Repeat card appears after step 3, stays centered for 1 full scroll runway,
 *    and during this time only the counter counts 1 -> 100 -> Infinity.
 * 2. Meanwhile in 2026: Sticky with dark background sliding up underneath.
 * 3. The Shift: Swapping between user-provided Manual SDLC and Agentic SDLC schemes.
 * 4. What Akaden actually is: Staggered reveal for cards.
 * 5. Parallax stationary dots in Contact section.
 * 6. FAQ Accordion.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Floating Island Header with Dynamic Theme based on Section Background
     ------------------------------------------------------------------------ */
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const primaryNav = document.getElementById('primaryNav');

  // Dark sections to detect
  const shiftSection = document.getElementById('shift');
  const meanwhileTrack = document.getElementById('meanwhileTrack');
  const meanwhileDarkBg = document.getElementById('meanwhileDarkBg');
  const siteFooter = document.querySelector('.site-footer');

  const updateHeaderIslandState = () => {
    if (!header) return;

    const scrollY = window.scrollY;
    // Island mode activates when scrolled down past 40px
    const isIsland = scrollY > 40;
    if (isIsland) {
      header.classList.add('is-island');
    } else {
      header.classList.remove('is-island');
    }

    // Probe point at header's vertical center in the viewport
    const probeY = 44;
    let isDark = false;

    // Check Footer (dark background #0f172a)
    if (siteFooter) {
      const rect = siteFooter.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom > probeY) {
        isDark = true;
      }
    }

    if (isDark) {
      header.classList.remove('theme-light');
      header.classList.add('theme-dark');
    } else {
      header.classList.remove('theme-dark');
      header.classList.add('theme-light');
    }
  };

  window.addEventListener('scroll', updateHeaderIslandState, { passive: true });
  window.addEventListener('resize', updateHeaderIslandState, { passive: true });
  updateHeaderIslandState();

  // Mobile menu toggle
  if (mobileMenuBtn && primaryNav) {
    const closeMobileMenu = () => {
      primaryNav.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };

    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      const nextExpanded = !isExpanded;
      mobileMenuBtn.setAttribute('aria-expanded', String(nextExpanded));
      primaryNav.classList.toggle('active', nextExpanded);
      document.body.classList.toggle('menu-open', nextExpanded);
    });

    primaryNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ------------------------------------------------------------------------
     2. Section 2: Classic Flow - Sequential Card Pinning Runway Animation
     - Step 1 stays sticky at top.
     - Steps 2, 3, 4 slide up sequentially with 8px gap.
     - When all 4 are assembled, board background #F0F5FF and conic-gradient :after appear.
     - Conic gradient rotates 720deg while multiplier counts x1 -> x100 -> x ∞.
     - Releases to normal scroll once infinity is reached.
     ------------------------------------------------------------------------ */
  const classicRunway = document.getElementById('classicRunway');
  const classicFlowBoard = document.getElementById('classicFlowBoard');
  const classicCard1 = document.getElementById('classicCard1');
  const classicCard2 = document.getElementById('classicCard2');
  const classicCard3 = document.getElementById('classicCard3');
  const classicCard4 = document.getElementById('classicCard4');
  const repeatMultiplier = document.getElementById('repeatMultiplier');

  if (classicRunway && classicFlowBoard && classicCard2 && classicCard3 && classicCard4 && repeatMultiplier) {
    let ticking = false;
    let lastRenderedText = '';
    let lastAngle = -1;
    let lastBgOp = -1;

    const updateClassicFlow = () => {
      ticking = false;
      const rect = classicRunway.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = rect.height - windowHeight;

      if (scrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

      // Travel distance for incoming cards
      const enterDistance = Math.min(windowHeight * 0.75, 600);

      // Ease-out helper
      const easeOut = t => 1 - Math.pow(1 - t, 2);

      // --- Stage 1: Card 2 slides in (P: 0.00 -> 0.12) ---
      const t2Raw = Math.min(Math.max(progress / 0.12, 0), 1);
      const t2 = easeOut(t2Raw);
      const ty2 = Math.round((1 - t2) * enterDistance);
      const op2 = progress <= 0 ? 0 : Math.min(1, t2Raw * 2.5);
      classicCard2.style.transform = `translate3d(0, ${ty2}px, 0)`;
      classicCard2.style.opacity = op2;

      // --- Stage 2: Card 3 slides in (P: 0.12 -> 0.24) ---
      const t3Raw = Math.min(Math.max((progress - 0.12) / 0.12, 0), 1);
      const t3 = easeOut(t3Raw);
      const ty3 = Math.round((1 - t3) * enterDistance);
      const op3 = progress <= 0.12 ? 0 : Math.min(1, t3Raw * 2.5);
      classicCard3.style.transform = `translate3d(0, ${ty3}px, 0)`;
      classicCard3.style.opacity = op3;

      // --- Stage 3: Card 4 slides in (P: 0.24 -> 0.36) ---
      const t4Raw = Math.min(Math.max((progress - 0.24) / 0.12, 0), 1);
      const t4 = easeOut(t4Raw);
      const ty4 = Math.round((1 - t4) * enterDistance);
      const op4 = progress <= 0.24 ? 0 : Math.min(1, t4Raw * 2.5);
      classicCard4.style.transform = `translate3d(0, ${ty4}px, 0)`;
      classicCard4.style.opacity = op4;

      // --- Stage 4: Background #F0F5FF & :after conic glow appear (P: 0.36 -> 0.46) ---
      const bgProgress = Math.min(Math.max((progress - 0.36) / 0.10, 0), 1);
      const bgRounded = Math.round(bgProgress * 100) / 100;
      if (bgRounded !== lastBgOp) {
        lastBgOp = bgRounded;
        classicFlowBoard.style.setProperty('--board-bg-opacity', bgRounded);
        classicFlowBoard.style.setProperty('--board-after-opacity', bgRounded);
      }

      // --- Stage 5: Conic gradient rotates 720deg & Multiplier counts up (P: 0.46 -> 0.90) ---
      const rotProgress = Math.min(Math.max((progress - 0.46) / 0.44, 0), 1);
      const angle = Math.round(rotProgress * 720);
      if (angle !== lastAngle) {
        lastAngle = angle;
        classicFlowBoard.style.setProperty('--conic-angle', `${angle}deg`);
      }

      // Multiplier logic
      let currentText = 'x1';
      if (progress < 0.46) {
        currentText = 'x1';
      } else if (rotProgress >= 0.94) {
        currentText = 'x ∞';
      } else {
        // Smooth exponential-feeling count up from 1 to 100
        const count = Math.min(100, Math.max(1, Math.round(1 + Math.pow(rotProgress / 0.94, 1.5) * 99)));
        currentText = 'x' + count;
      }

      if (currentText !== lastRenderedText) {
        lastRenderedText = currentText;
        repeatMultiplier.textContent = currentText;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateClassicFlow);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateClassicFlow();
  }

  /* ------------------------------------------------------------------------
     4. Section 4: The Shift - Mobile Tabs Switcher
        On mobile: switches between Old Workflow and New Workflow schemes
        On desktop: both stand side-by-side with labels
     ------------------------------------------------------------------------ */
  const shiftTabBtns = document.querySelectorAll('.shift-tab-btn');
  const shiftCols = document.querySelectorAll('.shift-col');

  if (shiftTabBtns.length > 0) {
    shiftTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        shiftTabBtns.forEach(b => {
          const isSelected = b === btn;
          b.classList.toggle('active', isSelected);
          b.setAttribute('aria-selected', String(isSelected));
        });
        shiftCols.forEach(col => {
          const matches = (targetTab === 'old' && col.classList.contains('shift-col-old')) ||
                          (targetTab === 'new' && col.classList.contains('shift-col-new'));
          col.classList.toggle('active', matches);
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. Section 5: What Akaden Actually Is - Fast Sequential Reveal on Scroll:
        1 картка > плюс > 2 картка > плюс > 3 картка > дорівнює > 4 картка сума
        On mobile: pluses and equals are positioned absolute between cards
     ------------------------------------------------------------------------ */
  const formulaContainer = document.getElementById('formulaContainer');

  if (formulaContainer) {
    const part1 = formulaContainer.querySelector('.formula-part[data-reveal="1"]');
    const part2 = formulaContainer.querySelector('.formula-part[data-reveal="2"]');
    const part3 = formulaContainer.querySelector('.formula-part[data-reveal="3"]');
    const opPlus1 = formulaContainer.querySelector('.op-plus-1');
    const opPlus2 = formulaContainer.querySelector('.op-plus-2');
    const opEquals = formulaContainer.querySelector('.op-equals');

    const updateFormulaOperatorsPosition = () => {
      if (window.innerWidth <= 1024) {
        if (part1 && opPlus1) {
          opPlus1.style.top = `${part1.offsetTop + part1.offsetHeight + 6}px`;
          opPlus1.style.left = '50%';
        }
        if (part2 && opPlus2) {
          opPlus2.style.top = `${part2.offsetTop + part2.offsetHeight + 6}px`;
          opPlus2.style.left = '50%';
        }
        if (part3 && opEquals) {
          opEquals.style.top = `${part3.offsetTop + part3.offsetHeight + 6}px`;
          opEquals.style.left = '50%';
        }
      } else {
        if (opPlus1) { opPlus1.style.top = ''; opPlus1.style.left = ''; }
        if (opPlus2) { opPlus2.style.top = ''; opPlus2.style.left = ''; }
        if (opEquals) { opEquals.style.top = ''; opEquals.style.left = ''; }
      }
    };

    window.addEventListener('resize', updateFormulaOperatorsPosition, { passive: true });
    setTimeout(updateFormulaOperatorsPosition, 60);

    const sequenceElements = [
      part1,
      opPlus1,
      part2,
      opPlus2,
      part3,
      opEquals,
      formulaContainer.querySelector('.formula-result')
    ].filter(Boolean);

    let hasRevealedFormula = false;

    const formulaObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasRevealedFormula) {
          hasRevealedFormula = true;
          updateFormulaOperatorsPosition();
          // Step through items quite fast one after another (130ms delay each)
          sequenceElements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('revealed');
            }, index * 130);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    formulaObserver.observe(formulaContainer);
  }

  /* ------------------------------------------------------------------------
     9. Section 9: Contact Us - Parallax Stationary Dots
     ------------------------------------------------------------------------ */
  const contactSection = document.getElementById('contact');
  const contactDotsImg = document.querySelector('.contact-dots-img');

  if (contactSection && contactDotsImg) {
    const handleParallaxDots = () => {
      const rect = contactSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollDelta = -rect.top;
        contactDotsImg.style.transform = `translate3d(0, ${scrollDelta * 0.85}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleParallaxDots, { passive: true });
    handleParallaxDots();
  }

  /* ------------------------------------------------------------------------
     10. Section 10: FAQ Accordion & Smooth Scroll
     ------------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Talk To Our Team Button: smooth scroll to form
  const talkToTeamBtn = document.getElementById('talkToTeamBtn');
  if (talkToTeamBtn) {
    talkToTeamBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const contactTarget = document.getElementById('contact');
      if (contactTarget) {
        contactTarget.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          document.getElementById('userName')?.focus();
        }, 500);
      }
    });
  }

  /* ------------------------------------------------------------------------
     Contact Form Validation
     ------------------------------------------------------------------------ */
  const leadForm = document.getElementById('leadForm');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const formFeedback = document.getElementById('formFeedback');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (!userName.value.trim()) {
        if (nameError) nameError.textContent = 'Please enter your name';
        isValid = false;
      } else {
        if (nameError) nameError.textContent = '';
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!userEmail.value.trim() || !emailPattern.test(userEmail.value.trim())) {
        if (emailError) emailError.textContent = 'Please enter a valid corporate email';
        isValid = false;
      } else {
        if (emailError) emailError.textContent = '';
      }

      if (isValid) {
        if (formFeedback) {
          formFeedback.textContent = '✓ Thank you! Our team will get in touch with you shortly.';
          formFeedback.className = 'form-feedback success';
        }
        leadForm.reset();
      }
    });
  }

});
