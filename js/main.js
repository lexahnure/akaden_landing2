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

    // 1. Check The Shift section (dark background #101429)
    if (shiftSection) {
      const rect = shiftSection.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom > probeY) {
        isDark = true;
      }
    }

    // 2. Check Meanwhile in 2026 track (becomes dark when dark bg slides up)
    if (meanwhileTrack && !isDark) {
      const rect = meanwhileTrack.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom > probeY) {
        if (meanwhileDarkBg) {
          const darkRect = meanwhileDarkBg.getBoundingClientRect();
          if (darkRect.top <= probeY && darkRect.bottom > probeY) {
            isDark = true;
          }
        }
      }
    }

    // 3. Check Footer (dark background #0f172a)
    if (siteFooter && !isDark) {
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
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('active');
    });

    primaryNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Section 2: Classic Flow - Pinned Center Repeat Card (Counts 1 to 100)
     ------------------------------------------------------------------------ */
  const repeatPinTrack = document.getElementById('repeatPinTrack');
  const repeatMultiplier = document.getElementById('repeatMultiplier');

  if (repeatPinTrack && repeatMultiplier) {
    let lastRenderedMultiplier = 'x1';

    const handleRepeatScroll = () => {
      const rect = repeatPinTrack.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Scrollable distance inside the pin track
      const scrollableDistance = rect.height - windowHeight;

      if (scrollableDistance > 0) {
        // How far the track has scrolled past the top
        const scrolled = -rect.top;
        const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

        let targetText = 'x1';
        if (progress >= 0.95) {
          targetText = 'x ∞';
        } else {
          // Gradual count from 1 to 100 while pinned
          const count = Math.min(100, Math.max(1, Math.round(1 + progress * 99)));
          targetText = 'x' + count;
        }

        if (targetText !== lastRenderedMultiplier) {
          lastRenderedMultiplier = targetText;
          repeatMultiplier.textContent = targetText;
        }
      }
    };

    window.addEventListener('scroll', handleRepeatScroll, { passive: true });
    handleRepeatScroll();
  }

  /* ------------------------------------------------------------------------
     3. Section 3: Meanwhile in 2026 (Sticky with Dark Background sliding UNDER)
     ------------------------------------------------------------------------ */
  if (meanwhileTrack && meanwhileDarkBg) {
    const handleMeanwhileScroll = () => {
      const trackRect = meanwhileTrack.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const scrollableDist = trackRect.height - windowHeight;
      if (scrollableDist > 0) {
        const scrolled = -trackRect.top;
        // Stays on white half as long: dark background rises twice as fast
        const progress = Math.min(Math.max(scrolled / (scrollableDist * 0.5), 0), 1);

        // Dark background rises up smoothly and covers the track
        const targetHeight = Math.min(progress * 100, 85);
        meanwhileDarkBg.style.height = `${targetHeight}vh`;
      }
    };

    window.addEventListener('scroll', handleMeanwhileScroll, { passive: true });
    handleMeanwhileScroll();
  }

  /* ------------------------------------------------------------------------
     4. Section 4: The Shift - Sticky Reveal Line wipes from Right to Left
     ------------------------------------------------------------------------ */
  const shiftTrack = document.getElementById('shiftTrack');
  const scheme2 = document.getElementById('scheme2');
  const shiftRevealLine = document.getElementById('shiftRevealLine');
  const shiftTagText = document.getElementById('shiftTagText');
  const shiftTagPulse = document.getElementById('shiftTagPulse');
  const shiftCaption = document.getElementById('shiftCaption');

  if (shiftTrack && scheme2 && shiftRevealLine) {
    const handleShiftWipe = () => {
      const rect = shiftTrack.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDist = rect.height - windowHeight;

      if (scrollableDist > 0) {
        const scrolled = -rect.top;
        // Progress goes 0.0 -> 1.0 as user scrolls through track
        const progress = Math.min(Math.max(scrolled / scrollableDist, 0), 1);

        // Wipe reveal completes during the first 75% of the runway.
        // During the remaining 25% (quarter of scroll), it remains pinned in the center
        // with the new Agentic SDLC scheme fully revealed!
        const revealProgress = Math.min(progress / 0.75, 1);
        const dividerPercent = (100 - (revealProgress * 100)).toFixed(2);
        const numDivider = parseFloat(dividerPercent);

        // Clip Scheme 2 so it is visible to the right of the divider
        scheme2.style.clipPath = `inset(0 0 0 ${dividerPercent}%)`;
        shiftRevealLine.style.left = `${dividerPercent}%`;

        // Reveal line disappears once it reaches the left end (and stays hidden during the post-reveal quarter)
        if (numDivider <= 1.0 || progress >= 0.75) {
          shiftRevealLine.style.opacity = '0';
        } else {
          shiftRevealLine.style.opacity = '1';
        }

        if (numDivider > 80) {
          if (shiftTagText) shiftTagText.textContent = 'Manual SDLC';
          if (shiftTagPulse) shiftTagPulse.style.backgroundColor = '#ff4d4f';
          if (shiftCaption) {
            shiftCaption.innerHTML = '<strong>Manual SDLC (Old Workflow).</strong> Hand-configure every workflow and integration manually.';
          }
        } else if (numDivider < 15 || progress >= 0.75) {
          if (shiftTagText) shiftTagText.textContent = 'Agentic SDLC AKADEN';
          if (shiftTagPulse) shiftTagPulse.style.backgroundColor = '#00ddff';
          if (shiftCaption) {
            shiftCaption.innerHTML = '<strong>Agentic SDLC AKADEN (New Workflow).</strong> Specialized AI agents execute bounded engineering steps under human supervision.';
          }
        } else {
          if (shiftTagText) shiftTagText.textContent = 'Comparing Workflows (' + Math.round(100 - numDivider) + '%)';
          if (shiftTagPulse) shiftTagPulse.style.backgroundColor = '#e52ea8';
          if (shiftCaption) {
            shiftCaption.innerHTML = '<strong>The Shift.</strong> Only the engineer\'s position changes — from manual execution to supervising AI agents.';
          }
        }
      }
    };

    window.addEventListener('scroll', handleShiftWipe, { passive: true });
    handleShiftWipe();
  }

  /* ------------------------------------------------------------------------
     5. Section 5: What Akaden Actually Is - Fast Sequential Reveal on Scroll:
        1 картка > плюс > 2 картка > плюс > 3 картка > дорівнює > 4 картка сума
     ------------------------------------------------------------------------ */
  const formulaContainer = document.getElementById('formulaContainer');

  if (formulaContainer) {
    const sequenceElements = [
      formulaContainer.querySelector('.formula-part[data-reveal="1"]'),
      formulaContainer.querySelector('.op-plus-1'),
      formulaContainer.querySelector('.formula-part[data-reveal="2"]'),
      formulaContainer.querySelector('.op-plus-2'),
      formulaContainer.querySelector('.formula-part[data-reveal="3"]'),
      formulaContainer.querySelector('.op-equals'),
      formulaContainer.querySelector('.formula-result')
    ].filter(Boolean);

    let hasRevealedFormula = false;

    const formulaObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasRevealedFormula) {
          hasRevealedFormula = true;
          // Step through items quite fast one after another (130ms delay each)
          sequenceElements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('revealed');
            }, index * 130);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

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
