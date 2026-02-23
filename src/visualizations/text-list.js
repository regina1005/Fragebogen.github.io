const FALTSTRATEGIEN = [
  'Dyadische Überlappungsfaltung',
  'Kompressionsbasierte Bündelung',
  'Lineare Parallelfaltung',
  'Unstrukturierte Ablage'
];

/**
 * Render Faltstrategie quote cards grouped by strategy (C2 value)
 * @param {string} containerId
 * @param {Array} items - Array of {text, zugehoerigkeit, faltStrategie} objects
 */
export function renderFaltstrategieGroups(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = '<div class="text-list-empty">Keine Einträge vorhanden</div>';
    return;
  }

  // Group by faltStrategie (0–3)
  const groups = {};
  items.forEach(item => {
    const key = item.faltStrategie !== null && item.faltStrategie !== undefined
      ? String(item.faltStrategie)
      : 'unknown';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  FALTSTRATEGIEN.forEach((name, index) => {
    const groupItems = groups[String(index)];
    if (!groupItems || groupItems.length === 0) return;

    const groupEl = document.createElement('div');
    groupEl.className = 'faltstrategie-group';
    groupEl.innerHTML = `
      <div class="faltstrategie-group-header">
        <span class="faltstrategie-group-badge">${index + 1}</span>
        <span class="faltstrategie-group-name">${name}</span>
      </div>
      <div class="faltstrategie-group-cards"></div>
    `;
    const cardsEl = groupEl.querySelector('.faltstrategie-group-cards');
    groupItems.forEach(item => cardsEl.appendChild(createTextCard(item.text, item.name, item.alter)));
    container.appendChild(groupEl);
  });

  const cards = container.querySelectorAll('.text-card');
  const observer = new IntersectionObserver(entries => {
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
    const name = typeof item === 'string' ? null : item.name;
    const alter = typeof item === 'string' ? null : item.alter;
    const card = createTextCard(text, name, alter);
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
 * @param {string|null} name - Name
 * @param {string|number|null} alter - Alter
 * @returns {HTMLElement}
 */
function createTextCard(text, name, alter) {
  const card = document.createElement('div');
  card.className = 'text-card';
  card.setAttribute('role', 'article');

  const sanitized = document.createElement('span');
  sanitized.textContent = text;
  const safeText = sanitized.innerHTML;

  const displayName = name || 'Unbekannt';
  const displayAlter = alter ? `, ${alter}` : '';
  const authorLabel = `${displayName}${displayAlter}`;

  card.innerHTML = `
    <div class="text-card-content">„${safeText}"</div>
    <div class="text-card-author">~ ${authorLabel}</div>
  `;

  return card;
}
