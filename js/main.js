/**
 * Akaden Landing Page Interactive Logic
 * 100% Faithful to Figma Requirements & User Specifications
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Sticky Site Header with Border Accent on Scroll
     ------------------------------------------------------------------------ */
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const primaryNav = document.getElementById('primaryNav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

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
     2. Section 2: Classic Flow Gradual Counter (1 to 100 on scroll)
     ------------------------------------------------------------------------ */
  const classicSection = document.getElementById('classic-flow');
  const repeatMultiplier = document.getElementById('repeatMultiplier');

  if (classicSection && repeatMultiplier) {
    let lastRenderedVal = 'x1';

    const handleClassicFlowScroll = () => {
      const rect = classicSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start counting when section top hits 60% of viewport
      // Finish counting when bottom reaches 40% of viewport
      const startPoint = windowHeight * 0.6;
      const totalScrollDistance = rect.height;
      const currentScroll = startPoint - rect.top;

      const progress = Math.min(Math.max(currentScroll / totalScrollDistance, 0), 1);

      let text = 'x1';
      if (progress >= 0.98) {
        text = 'x ∞';
      } else {
        const count = Math.min(100, Math.max(1, Math.round(1 + progress * 99)));
        text = 'x' + count;
      }

      if (text !== lastRenderedVal) {
        lastRenderedVal = text;
        repeatMultiplier.textContent = text;
      }
    };

    window.addEventListener('scroll', handleClassicFlowScroll, { passive: true });
    handleClassicFlowScroll();
  }

  /* ------------------------------------------------------------------------
     3. Section 3: Meanwhile in 2026 (Sticky with Dark Background sliding UNDER)
     ------------------------------------------------------------------------ */
  const meanwhileTrack = document.getElementById('meanwhileTrack');
  const meanwhileDarkBg = document.getElementById('meanwhileDarkBg');
  const meanwhileSticky = document.getElementById('meanwhileSticky');

  if (meanwhileTrack && meanwhileDarkBg) {
    const handleMeanwhileScroll = () => {
      const trackRect = meanwhileTrack.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // As user scrolls through the track, calculate how much the black background should rise
      // Total scroll length inside track
      const scrollableDist = trackRect.height - windowHeight;
      if (scrollableDist > 0) {
        const scrolled = -trackRect.top;
        const progress = Math.min(Math.max(scrolled / scrollableDist, 0), 1);

        // Black background rises up smoothly from 0% height to 75% height
        const targetHeight = Math.min(progress * 100, 75);
        meanwhileDarkBg.style.height = `${targetHeight}vh`;
      }
    };

    window.addEventListener('scroll', handleMeanwhileScroll, { passive: true });
    handleMeanwhileScroll();
  }

  /* ------------------------------------------------------------------------
     4. Section 4: The Shift - Scheme Diagram Swap on Scroll
     ------------------------------------------------------------------------ */
  const shiftDisplay = document.getElementById('shiftDisplay');
  const scheme1 = document.getElementById('scheme1');
  const scheme2 = document.getElementById('scheme2');
  const shiftTagText = document.getElementById('shiftTagText');

  if (shiftDisplay && scheme1 && scheme2) {
    const handleShiftSwap = () => {
      const rect = shiftDisplay.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isPastCenter = rect.top < windowHeight * 0.35;

      if (isPastCenter) {
        if (!scheme2.classList.contains('active')) {
          scheme1.classList.remove('active');
          scheme2.classList.add('active');
          if (shiftTagText) shiftTagText.textContent = 'Agentic Architecture (Scheme 2)';
        }
      } else {
        if (!scheme1.classList.contains('active')) {
          scheme2.classList.remove('active');
          scheme1.classList.add('active');
          if (shiftTagText) shiftTagText.textContent = 'New workflow';
        }
      }
    };

    window.addEventListener('scroll', handleShiftSwap, { passive: true });
    handleShiftSwap();
  }

  /* ------------------------------------------------------------------------
     5. Section 5: What Akaden Actually Is - Staggered Scroll Reveal
     ------------------------------------------------------------------------ */
  const formulaContainer = document.getElementById('formulaContainer');
  const formulaParts = document.querySelectorAll('.formula-part');

  if (formulaContainer && formulaParts.length > 0) {
    const formulaObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          formulaParts.forEach((part, index) => {
            setTimeout(() => {
              part.classList.add('revealed');
            }, index * 180);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

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
        // Counter-translate to keep dots visually stationary relative to screen
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
