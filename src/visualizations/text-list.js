/**
 * Render text list (goodbye letters to lost socks)
 * @param {string} containerId - Container element ID
 * @param {Array} texts - Array of text strings
 */
export function renderTextList(containerId, texts) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!texts || texts.length === 0) {
    container.innerHTML = '<div class="text-list-empty">Keine Einträge vorhanden</div>';
    return;
  }

  container.innerHTML = '';

  texts.forEach((text, index) => {
    const card = createTextCard(text, index + 1);
    container.appendChild(card);
  });

  // Scroll-triggered entrance animations
  const cards = container.querySelectorAll('.text-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

/**
 * Create a single text card
 * @param {string} text - Text content
 * @param {number} index - Participant index
 * @returns {HTMLElement}
 */
function createTextCard(text, index) {
  const card = document.createElement('div');
  card.className = 'text-card';
  card.setAttribute('role', 'article');

  // Sanitize text to prevent XSS
  const sanitized = document.createElement('span');
  sanitized.textContent = text;
  const safeText = sanitized.innerHTML;

  card.innerHTML = `
    <div class="text-card-content">„${safeText}“</div>
    <div class="text-card-author">— Teilnehmer ${index}</div>
  `;

  return card;
}
