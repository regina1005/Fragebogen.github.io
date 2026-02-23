import { subscribeToLikes } from '../utils/firebase.js';

/**
 * Render the top 3 liked images as a podium
 * @param {string} containerId - The DOM element ID to render into
 * @param {Array} drawings - The original array of drawing objects/strings to match filenames and authors
 */
export function renderPodium(containerId, drawings) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Render initial empty state
  container.innerHTML = `
    <div class="podium-section">
      <h3>🏆 Die beliebtesten Sockenpaare 🏆</h3>
      <div class="podium-container" id="podium-ranks">
        <p class="podium-loading">Stimmen werden gezählt...</p>
      </div>
    </div>
  `;

  const ranksContainer = document.getElementById('podium-ranks');

  subscribeToLikes((likesData) => {
    // 1. Map likes to drawing objects
    const rankedDrawings = drawings.map(item => {
      const filename = typeof item === 'string' ? item : item.datei;
      const safeId = filename.replace(/\./g, '_');
      const name = typeof item === 'string' ? 'Unbekannt' : (item.name || 'Unbekannt');
      const likes = likesData[safeId] || 0;
      return { filename, name, likes };
    });

    // 2. Sort descending by likes
    rankedDrawings.sort((a, b) => b.likes - a.likes);

    // 3. Take top 3 (only those with at least 1 like, or just top 3 anyway)
    const top3 = rankedDrawings.slice(0, 3);

    // Check if we even have any likes at all
    const totalLikes = top3.reduce((sum, item) => sum + item.likes, 0);
    if (totalLikes === 0) {
      ranksContainer.innerHTML = '<p class="podium-empty">Noch keine Stimmen abgegeben. Werde der Erste!</p>';
      return;
    }

    // 4. Render Podium (Rank 2, Rank 1, Rank 3 layout)
    const getRankHTML = (item, rank) => {
      if (!item) return '<div class="podium-place empty"></div>';
      return `
        <div class="podium-place rank-${rank}">
          <div class="podium-medal">${rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</div>
          <img src="./drawings/${encodeURIComponent(item.filename)}" alt="Platz ${rank}" class="podium-img">
          <div class="podium-block"></div>
        </div>
      `;
    };

    // Reorder for visual CSS podium (2, 1, 3)
    ranksContainer.innerHTML = `
      ${getRankHTML(top3[1], 2)}
      ${getRankHTML(top3[0], 1)}
      ${getRankHTML(top3[2], 3)}
    `;
  });
}
