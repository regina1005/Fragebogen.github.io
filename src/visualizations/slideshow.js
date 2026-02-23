import Swiper from 'swiper';
import { EffectCards, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';

/**
 * Render drawing slideshow as polaroid card stack
 * @param {string} containerId - Container element ID
 * @param {Array} drawings - Array of image filenames
 */
export function renderSlideshow(containerId, drawings) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!drawings || drawings.length === 0) {
    container.innerHTML = '<div class="slideshow-empty">Keine Zeichnungen verfügbar</div>';
    return;
  }

  const slidesHTML = drawings.map(filename => `
    <div class="swiper-slide">
      <img src="/drawings/${encodeURIComponent(filename)}" alt="Teilnehmer Zeichnung" loading="lazy">
    </div>
  `).join('');

  container.innerHTML = `
    <div class="swiper polaroid-swiper">
      <div class="swiper-wrapper">
        ${slidesHTML}
      </div>
      <div class="swiper-pagination"></div>
    </div>
    <p class="swipe-hint">← wischen →</p>
  `;

  new Swiper(container.querySelector('.swiper'), {
    modules: [EffectCards, Pagination, Keyboard],
    effect: 'cards',
    grabCursor: true,
    pagination: {
      el: container.querySelector('.swiper-pagination'),
      type: 'fraction',
    },
    keyboard: {
      enabled: true,
    },
  });
}
