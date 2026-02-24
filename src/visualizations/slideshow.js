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

  // Overlay handling
  const overlay = document.getElementById('vote-overlay');
  const overlayBtn = document.getElementById('btn-vote-ok');
  if (overlay && overlayBtn) {
    overlayBtn.addEventListener('click', () => {
      overlay.classList.add('hidden');
      container.classList.remove('obscured');
    });
  }

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

  let latestLikesData = {};

  const applyVoteState = (likesData = {}) => {
    const votedId = getLikedImage();
    const allButtons = container.querySelectorAll('.btn-like');

    allButtons.forEach(btn => {
      const btnImageId = btn.getAttribute('data-image');
      const safeId = btnImageId.replace(/\./g, '_');
      const polaroid = btn.closest('.polaroid-content');

      if (!votedId) {
        btn.disabled = false;
        btn.classList.remove('liked');
        if (polaroid) polaroid.classList.remove('liked-polaroid');
      } else if (votedId === btnImageId) {
        btn.disabled = false;
        btn.classList.add('liked');
        if (polaroid) polaroid.classList.add('liked-polaroid');
      } else {
        btn.disabled = true;
        btn.classList.remove('liked');
        if (polaroid) polaroid.classList.remove('liked-polaroid');
      }

      const countEl = document.getElementById(`like-count-${safeId}`);
      if (countEl) {
        countEl.textContent = likesData[safeId] || 0;
      }
    });
  };

  // Bind like buttons
  const likeBtns = container.querySelectorAll('.btn-like');
  likeBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const imageId = btn.getAttribute('data-image');
      const isAlreadyLikedByMe = getLikedImage() === imageId;

      if (hasLiked() && !isAlreadyLikedByMe) {
        alert('Du hast bereits für eine Socke abgestimmt! Du kannst deine Stimme aber wieder entfernen, indem du noch einmal auf deine aktuell gelikte Socke klickst.');
        return;
      }

      btn.disabled = true;
      const success = await likeImage(imageId, isAlreadyLikedByMe);
      btn.disabled = false;
      if (!success) return;

      // Update the local UI immediately after like/unlike so no page reload is needed.
      applyVoteState(latestLikesData);
    });
  });

  // Subscribe to realtime like counts
  subscribeToLikes((likesData) => {
    latestLikesData = likesData || {};
    applyVoteState(latestLikesData);
  });
}
