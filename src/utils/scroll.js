/**
 * Hero scroll-reveal animation
 * Phase 1 (20-40%): Text fades in
 * Phase 2 (60-100%): Everything fades out
 */
export function initHeroScrollAnimation() {
  const heroImage = document.querySelector('.hero-image');
  const heroText = document.querySelector('.hero-text');

  if (!heroImage || !heroText) return;

  function updateHeroOpacity() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollProgress = scrollY / viewportHeight;

    // Before Phase 1: Hidden (0-20% scroll)
    if (scrollProgress < 0.2) {
      heroText.style.opacity = 0;
      heroImage.style.opacity = 1;  // ensure hero image is fully visible
    }
    // Phase 1: Text appears (20-40% scroll)
    else if (scrollProgress >= 0.2 && scrollProgress < 0.4) {
      const textOpacity = Math.min((scrollProgress - 0.2) * 5, 1);
      heroText.style.opacity = textOpacity;
      heroImage.style.opacity = 1;  // ensure hero image is fully visible
    }
    // Between phases: Text fully visible (40-60% scroll)
    else if (scrollProgress >= 0.4 && scrollProgress <= 0.6) {
      heroText.style.opacity = 1;
      heroImage.style.opacity = 1;  // ensure hero image is fully visible
    }
    // Phase 2: Everything disappears (60-100% scroll)
    else if (scrollProgress > 0.6) {
      const fadeProgress = (scrollProgress - 0.6) * 2.5;
      const opacity = Math.max(1 - fadeProgress, 0);
      heroImage.style.opacity = opacity;
      heroText.style.opacity = opacity;
    }
  }

  // Use requestAnimationFrame for smooth animation
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeroOpacity();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateHeroOpacity();
}
