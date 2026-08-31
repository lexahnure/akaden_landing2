// Akaden Landing Page Interactive Logic
document.addEventListener("DOMContentLoaded", () => {
          // 0. Hero Scroll Parallax & Fullscreen Black Transition Controller
  const heroTrack = document.querySelector(".hero-scroll-track");
  const heroContent = document.querySelector(".hero-content");
  const heroBezel = document.querySelector(".hero-device-bezel");
  const heroBlackOverlay = document.querySelector(".hero-black-overlay");

  function handleHeroScroll() {
    if (!heroTrack || !heroContent || !heroBezel) return;
    const rect = heroTrack.getBoundingClientRect();
    const trackHeight = heroTrack.offsetHeight - window.innerHeight;
    if (trackHeight <= 0) return;

    // Progress from 0.0 (top) to 1.0 (bottom of track)
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / trackHeight, 0), 1);

    // Phase 1: Text fades out and floats upward (0.0 -> 0.28 progress)
    const textProgress = Math.min(progress / 0.25, 1);
    const textOpacity = Math.max(0, 1 - textProgress);
    const textTranslateY = -textProgress * 80;
    heroContent.style.opacity = textOpacity.toFixed(3);
    heroContent.style.transform = `translateY(${textTranslateY.toFixed(1)}px)`;
    heroContent.style.pointerEvents = textOpacity < 0.1 ? "none" : "auto";

        // Phase 2: Bezel moves into center & scales to final size (Responsive initial scale)
    const isTabletOrMobile = window.innerWidth <= 1024;
    const baseScale = isTabletOrMobile ? 0.68 : 0.48;
    const targetScale = isTabletOrMobile ? 1.00 : 0.92;
    const baseTranslateY = isTabletOrMobile ? 220 : 320;

    const zoomProgress = Math.min(Math.max((progress - 0.06) / 0.82, 0), 1);
    const scale = baseScale + (zoomProgress * (targetScale - baseScale));
    const translateY = (1 - zoomProgress) * baseTranslateY;
    heroBezel.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;

    // Phase 3: Black overlay smoothly blankets the ENTIRE 100vw x 100vh screen
    const overlayProgress = Math.min(Math.max((progress - 0.35) / 0.45, 0), 1);
    if (heroBlackOverlay) {
      heroBlackOverlay.style.opacity = overlayProgress.toFixed(3);
    }

    // Dissolve bezel border and shadow as screen goes completely black
    if (overlayProgress > 0.8) {
      heroBezel.style.borderColor = "transparent";
      heroBezel.style.boxShadow = "none";
    } else {
      heroBezel.style.borderColor = "rgba(255, 255, 255, 0.10)";
      heroBezel.style.boxShadow = "0 32px 80px rgba(0, 30, 80, 0.20), 0 4px 16px rgba(0, 0, 0, 0.08)";
    }
  }

  handleHeroScroll();
    // 1. Sticky / Island Header Controller & Dark Section Detector
  const header = document.querySelector(".site-header");
  const darkSection3 = document.getElementById("use-cases");
  const darkFooter = document.getElementById("contact");

  function updateHeaderTheme() {
    if (!header) return;

    // Scrolled state for Island capsule
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    const headerRect = header.getBoundingClientRect();
    const headerCenter = headerRect.top + (headerRect.height / 2);

    let isOverDark = false;

    // 1. Check if over Hero dark phase
    if (heroTrack) {
      const heroRect = heroTrack.getBoundingClientRect();
      const trackHeight = heroTrack.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-heroRect.top / trackHeight, 0), 1);
      if (progress > 0.40 && heroRect.bottom > headerCenter) {
        isOverDark = true;
      }
    }

    // 2. Check if over Use Cases (Section 3)
    if (darkSection3) {
      const sec3Rect = darkSection3.getBoundingClientRect();
      if (sec3Rect.top <= headerCenter && sec3Rect.bottom >= headerCenter) {
        isOverDark = true;
      }
    }

    // 3. Check if over Footer
    if (darkFooter) {
      const footRect = darkFooter.getBoundingClientRect();
      if (footRect.top <= headerCenter && footRect.bottom >= headerCenter) {
        isOverDark = true;
      }
    }

    if (isOverDark) {
      header.classList.add("dark-theme");
    } else {
      header.classList.remove("dark-theme");
    }
  }

  window.addEventListener("scroll", () => {
    handleSection2Scroll();
    handleHeroScroll();
    updateHeaderTheme();
  }, { passive: true });

  updateHeaderTheme();

      // 2. Fullscreen Mobile Drawer Controller & Theme Synchronization
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const drawerClose = document.querySelector(".mobile-drawer-close");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link, .mobile-drawer-cta, .mobile-drawer-logo");

  function syncDrawerTheme() {
    if (!mobileDrawer || !header) return;
    if (header.classList.contains("dark-theme")) {
      mobileDrawer.classList.add("dark-theme");
    } else {
      mobileDrawer.classList.remove("dark-theme");
    }
  }

  function openDrawer() {
    if (!mobileDrawer) return;
    syncDrawerTheme();
    mobileDrawer.classList.add("open");
    mobileDrawer.setAttribute("aria-hidden", "false");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove("open");
    mobileDrawer.setAttribute("aria-hidden", "true");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", openDrawer);
  }

  if (drawerClose) {
    drawerClose.addEventListener("click", closeDrawer);
  }

  mobileLinks.forEach(link => {
    link.addEventListener("click", closeDrawer);
  });

      // 3. Scroll-Driven 5 Steps Synchronization (Desktop Vertical / Tablet-Mobile Horizontal)
  const stepCards = document.querySelectorAll(".step-card");
  const visualItems = document.querySelectorAll(".step-visual-item");
  const lineProgress = document.querySelector(".steps-line-progress");
  const lineTrack = document.querySelector(".steps-line-track");
  const sec2 = document.getElementById("how-it-works");
  const stepsList = document.querySelector(".steps-list");

  function handleSection2Scroll() {
    if (!sec2 || !stepsList) return;

    if (window.innerWidth <= 1024) {
      // Tablet / Mobile: Vertical scroll drives horizontal translation of stepsList
      const rect = sec2.getBoundingClientRect();
      const trackHeight = sec2.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / trackHeight, 0), 1);

      const maxScrollX = stepsList.scrollWidth - window.innerWidth + 48;
      if (maxScrollX > 0) {
        const translateX = progress * maxScrollX;
        stepsList.style.transform = `translateX(-${translateX.toFixed(1)}px)`;
      }
    } else {
      // Desktop: Reset horizontal transform and calculate active vertical step
      stepsList.style.transform = "none";
      const viewportCenter = window.innerHeight * 0.45;
      let closestIndex = 0;
      let minDistance = Infinity;

      stepCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      const secRect = sec2.getBoundingClientRect();
      if (secRect.top <= window.innerHeight * 0.7 && secRect.bottom >= window.innerHeight * 0.2) {
        setActiveStep(closestIndex);
      }
    }
  }

  function updateProgressLine(index) {
    if (!lineProgress || !lineTrack || stepCards.length === 0 || window.innerWidth <= 1024) return;
    const targetCard = stepCards[index];
    const trackTop = lineTrack.getBoundingClientRect().top + window.pageYOffset;
    const cardBadge = targetCard.querySelector(".step-badge");
    const badgeBottom = (cardBadge || targetCard).getBoundingClientRect().top + window.pageYOffset + 18;
    const targetHeight = Math.max(30, badgeBottom - trackTop);
    lineProgress.style.height = targetHeight + "px";
  }

  function setActiveStep(index) {
    stepCards.forEach((card, i) => {
      if (i === index) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });

    visualItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    updateProgressLine(index);
  }

  // Initial progress line setup
  setTimeout(() => updateProgressLine(0), 100);
  window.addEventListener("resize", () => {
    handleSection2Scroll();
  });

// Click on step card smoothly scrolls and activates it
  stepCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      setActiveStep(index);
      const headerOffset = 180;
      const elementPosition = card.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    });
  });

  // Scroll listener to update active step based on viewport position
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const viewportCenter = window.innerHeight * 0.45;
        let closestIndex = 0;
        let minDistance = Infinity;

        stepCards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const distance = Math.abs(cardCenter - viewportCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        // Only switch if the section is in view
        const section = document.getElementById("how-it-works");
        if (section) {
          const secRect = section.getBoundingClientRect();
          if (secRect.top <= window.innerHeight * 0.7 && secRect.bottom >= window.innerHeight * 0.2) {
            setActiveStep(closestIndex);
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 4. Video Cards Modal / Preview
  const videoCards = document.querySelectorAll(".video-card");
  const videoModal = document.getElementById("videoModal");
  const closeModalBtn = document.querySelector(".video-modal-close");

  if (videoModal) {
    videoCards.forEach(card => {
      card.addEventListener("click", () => {
        videoModal.showModal();
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => {
        videoModal.close();
      });
    }

    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) {
        videoModal.close();
      }
    });
  }

  // 5. Active Nav Link on Scroll (Scroll Spy)
  const sections = document.querySelectorAll("section[id], header[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");
      const targetNav = document.querySelector(".nav-link[href*=" + sectionId + "]");
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (targetNav) {
          document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
          targetNav.classList.add("active");
        }
      }
    });
  }, { passive: true });
});
