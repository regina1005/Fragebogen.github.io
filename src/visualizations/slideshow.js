import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * Render drawing slideshow
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
      <img src="/drawings/${filename}" alt="Teilnehmer Zeichnung" loading="lazy">
    </div>
  `).join('');

  container.innerHTML = `
    <div class="swiper">
      <div class="swiper-wrapper">
        ${slidesHTML}
      </div>
      <button class="swiper-button-prev" aria-label="Vorherige Zeichnung"></button>
      <button class="swiper-button-next" aria-label="Nächste Zeichnung"></button>
      <div class="swiper-pagination"></div>
    </div>
  `;

  new Swiper(container.querySelector('.swiper'), {
    modules: [Navigation, Pagination, Keyboard],
    navigation: {
      nextEl: container.querySelector('.swiper-button-next'),
      prevEl: container.querySelector('.swiper-button-prev'),
    },
    pagination: {
      el: container.querySelector('.swiper-pagination'),
      type: 'fraction',
    },
    loop: drawings.length > 1,
    keyboard: {
      enabled: true,
    },
  });
}
