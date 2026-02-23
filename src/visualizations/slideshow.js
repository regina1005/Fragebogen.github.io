import Swiper from 'swiper';
import { EffectCards, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import { likeImage, subscribeToLikes, hasLiked, getLikedImage } from '../utils/firebase.js';

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

  const slidesHTML = drawings.map(item => {
    const filename = typeof item === 'string' ? item : item.datei;
    const name = typeof item === 'string' ? 'Unbekannt' : (item.name || 'Unbekannt');
    const alter = typeof item === 'string' || !item.alter ? '' : `, ${item.alter}`;
    const desc = `${name}${alter}`;
    const safeId = filename.replace(/\./g, '_');

    return `
    <div class="swiper-slide">
      <div class="polaroid-content">
        <img src="./drawings/${encodeURIComponent(filename)}" alt="Teilnehmer Zeichnung" loading="lazy">
        <div class="polaroid-caption">${desc}</div>
        <div class="polaroid-actions">
          <button class="btn-like" data-image="${filename}" id="like-btn-${safeId}">
            <span class="like-icon">❤️</span> <span class="like-count" id="like-count-${safeId}">0</span>
          </button>
        </div>
      </div>
    </div>
  `}).join('');

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

  // Bind like buttons
  const likeBtns = container.querySelectorAll('.btn-like');
  likeBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      if (hasLiked()) {
        alert('Du hast bereits für eine Socke abgestimmt!');
        return;
      }
      const imageId = btn.getAttribute('data-image');
      btn.disabled = true;
      const success = await likeImage(imageId);
      if (success) {
        btn.classList.add('liked');
      } else {
        btn.disabled = false; // re-enable if failed
      }
    });
  });

  // Subscribe to realtime like counts
  subscribeToLikes((likesData) => {
    const votedId = getLikedImage();
    Object.keys(likesData).forEach(key => {
      const el = document.getElementById(`like-count-${key}`);
      if (el) el.textContent = likesData[key];

      // Update button state visually
      if (votedId && votedId.replace(/\./g, '_') === key) {
        const btn = document.getElementById(`like-btn-${key}`);
        if (btn) {
          btn.classList.add('liked');
          btn.disabled = true;
        }
      }
    });

    // If user has voted, disable all other like buttons
    if (votedId) {
      container.querySelectorAll('.btn-like').forEach(b => {
        b.disabled = true;
      });
    }
  });
}
