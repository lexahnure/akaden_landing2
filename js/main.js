/**
 * Akaden Landing Page Interactive Logic
 * Fulfills all 10 user requirements with smooth, optimized animations
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Sticky Site Header with Scroll Shadow
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

    // Close menu when clicking a link
    primaryNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Classic Flow: Dynamic Repeat Multiplier (x1 -> x2 -> x3 -> x100 -> x ∞)
     ------------------------------------------------------------------------ */
  const repeatCard = document.getElementById('repeatCard');
  const repeatMultiplier = document.getElementById('repeatMultiplier');
  const repeatBadge = document.getElementById('repeatBadge');

  if (repeatCard && repeatMultiplier) {
    let currentMultiplier = 'x1';

    const updateRepeatMultiplier = () => {
      const rect = repeatCard.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress of card through the viewport
      // When card top hits 85% of viewport -> starts; when bottom hits 25% -> finishes
      const totalDistance = windowHeight * 0.7;
      const currentPos = (windowHeight * 0.85) - rect.top;
      const progress = Math.min(Math.max(currentPos / totalDistance, 0), 1);

      let targetMultiplier = 'x1';
      let isEscalated = false;

      if (progress > 0.85) {
        targetMultiplier = 'x ∞';
        isEscalated = true;
      } else if (progress > 0.65) {
        targetMultiplier = 'x100';
        isEscalated = true;
      } else if (progress > 0.45) {
        targetMultiplier = 'x3';
      } else if (progress > 0.20) {
        targetMultiplier = 'x2';
      } else {
        targetMultiplier = 'x1';
      }

      if (targetMultiplier !== currentMultiplier) {
        currentMultiplier = targetMultiplier;
        repeatMultiplier.textContent = currentMultiplier;

        if (isEscalated) {
          repeatMultiplier.classList.add('escalated');
          if (repeatBadge) repeatBadge.style.transform = 'scale(1.08)';
        } else {
          repeatMultiplier.classList.remove('escalated');
          if (repeatBadge) repeatBadge.style.transform = 'scale(1)';
        }
      }
    };

    window.addEventListener('scroll', updateRepeatMultiplier, { passive: true });
    updateRepeatMultiplier();
  }

  /* ------------------------------------------------------------------------
     3. Meanwhile in 2026: Sticky Pinning & Dark Transition
     ------------------------------------------------------------------------ */
  const meanwhileWrapper = document.getElementById('meanwhileWrapper');
  const shiftSection = document.getElementById('shift');

  if (meanwhileWrapper && shiftSection) {
    const handleMeanwhileTransition = () => {
      const shiftRect = shiftSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When shift section approaches within 30% of viewport, darken meanwhile background
      if (shiftRect.top < windowHeight * 0.5) {
        meanwhileWrapper.style.backgroundColor = 'var(--color-bg-dark)';
      } else {
        meanwhileWrapper.style.backgroundColor = 'var(--color-bg-white)';
      }
    };

    window.addEventListener('scroll', handleMeanwhileTransition, { passive: true });
    handleMeanwhileTransition();
  }

  /* ------------------------------------------------------------------------
     4. The Shift: Scheme Diagram Swap on Scroll
     ------------------------------------------------------------------------ */
  const shiftDisplay = document.getElementById('shiftDisplay');
  const scheme1 = document.getElementById('scheme1');
  const scheme2 = document.getElementById('scheme2');
  const shiftTagText = document.getElementById('shiftTagText');

  if (shiftDisplay && scheme1 && scheme2) {
    const handleShiftSwap = () => {
      const rect = shiftDisplay.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When user has scrolled past center of diagram
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
     5. What Akaden Actually Is: Staggered Scroll Reveal (Y: -20px -> 0, opacity: 0 -> 1)
     ------------------------------------------------------------------------ */
  const formulaContainer = document.getElementById('formulaContainer');
  const formulaParts = document.querySelectorAll('.formula-part');

  if (formulaContainer && formulaParts.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.25
    };

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
    }, observerOptions);

    formulaObserver.observe(formulaContainer);
  }

  /* ------------------------------------------------------------------------
     9. Contact Us: Parallax Dots (Fixed / Stationary on Scroll)
     ------------------------------------------------------------------------ */
  const contactSection = document.getElementById('contact');
  const contactDotsImg = document.querySelector('.contact-dots-img');

  if (contactSection && contactDotsImg) {
    const handleParallaxDots = () => {
      const rect = contactSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // If contact section is visible in or near viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Counter-translate to keep dots visually stationary
        // rect.top changes as you scroll; counter-scrolling with 1:1 ratio pins it completely
        const scrollDelta = -rect.top;
        contactDotsImg.style.transform = `translate3d(0, ${scrollDelta * 0.9}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleParallaxDots, { passive: true });
    handleParallaxDots();
  }

  /* ------------------------------------------------------------------------
     10. FAQ Accordion & Smooth Scroll to Contact Form
     ------------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for a clean single-open accordion feel
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
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
        // Focus first input for accessibility
        setTimeout(() => {
          document.getElementById('userName')?.focus();
        }, 500);
      }
    });
  }

  /* ------------------------------------------------------------------------
     Form Validation & Interactive Feedback
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

      // Validate Name
      if (!userName.value.trim()) {
        if (nameError) nameError.textContent = 'Please enter your name';
        userName.classList.add('invalid');
        isValid = false;
      } else {
        if (nameError) nameError.textContent = '';
        userName.classList.remove('invalid');
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!userEmail.value.trim() || !emailPattern.test(userEmail.value.trim())) {
        if (emailError) emailError.textContent = 'Please enter a valid corporate email';
        userEmail.classList.add('invalid');
        isValid = false;
      } else {
        if (emailError) emailError.textContent = '';
        userEmail.classList.remove('invalid');
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
