/**
 * Render text list (goodbye letters or Faltstrategie quotes)
 * @param {string} containerId - Container element ID
 * @param {Array} items - Array of {text, zugehoerigkeit} objects or plain strings
 */
export function renderTextList(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = '<div class="text-list-empty">Keine Einträge vorhanden</div>';
    return;
  }

  container.innerHTML = '';

  items.forEach((item) => {
    const text = typeof item === 'string' ? item : item.text;
    const zugehoerigkeit = typeof item === 'string' ? null : item.zugehoerigkeit;
    const card = createTextCard(text, zugehoerigkeit);
    container.appendChild(card);
  });

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
 * @param {string|null} zugehoerigkeit - 'patienten' | 'personal' | null
 * @returns {HTMLElement}
 */
function createTextCard(text, zugehoerigkeit) {
  const card = document.createElement('div');
  card.className = 'text-card';
  card.setAttribute('role', 'article');

  const sanitized = document.createElement('span');
  sanitized.textContent = text;
  const safeText = sanitized.innerHTML;

  let authorLabel;
  const z = (zugehoerigkeit || '').toLowerCase();
  if (z === 'personal') {
    authorLabel = 'Therapeutisches Teammitglied';
  } else if (z === 'patienten') {
    authorLabel = 'Patient';
  } else {
    authorLabel = 'Teilnehmer';
  }

  card.innerHTML = `
    <div class="text-card-content">„${safeText}"</div>
    <div class="text-card-author">— ${authorLabel}</div>
  `;

  return card;
}
