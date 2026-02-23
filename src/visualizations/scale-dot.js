/**
 * D3 Identification Scale — individual participant dots on a VAS track
 * Red = Patienten, Blue = Therapeutisches Team
 *
 * Items: Array of { value: 0–100, zugehoerigkeit: 'patienten'|'personal' }
 */

/**
 * Assign vertical stacking levels to dots that are close to each other.
 * Dots within `threshold`% of each other get stacked upward (level 0 = on track).
 */
function stackDots(rawDots, threshold = 5) {
  const sorted = [...rawDots].sort((a, b) => a.pct - b.pct);
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length - 1 && sorted[j + 1].pct - sorted[i].pct < threshold) j++;
    for (let k = 0; k < j - i + 1; k++) sorted[i + k].yLevel = k;
    i = j + 1;
  }
  return sorted;
}

export function renderGroupDotScale(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'visualization-card';

  const hasData = Array.isArray(items) && items.length > 0;

  if (!hasData) {
    card.innerHTML = `
      <div class="visualization-card-index">D3</div>
      <div class="visualization-title">Wie stark identifizieren Sie sich mit Ihrem präferierten Sockenpaar?</div>
      <div class="group-scale-wrapper">
        <div class="group-dots-container">
          <div class="likert-no-data">Daten werden noch erhoben</div>
        </div>
        <div class="group-scale-line"></div>
        <div class="likert-labels" aria-hidden="true">
          <span>gar nicht</span>
          <span>vollständig</span>
        </div>
      </div>
    `;
  } else {
    const rawDots = items
      .filter(item => item.value !== null && item.value !== undefined && item.value !== '')
      .map(item => ({
        pct: Math.min(100, Math.max(0, Number(item.value))),
        isPersonal: (item.zugehoerigkeit || '').toLowerCase() === 'personal'
      }));

    const dots = stackDots(rawDots);
    const DOT_BOTTOM = 0;   // px — bottom of level-0 dot relative to dots container bottom
    const DOT_SPACING = 18; // px per level

    const dotsHTML = dots.map(dot => `
      <div class="group-dot ${dot.isPersonal ? 'personal' : 'patienten'}"
           style="left: ${dot.pct.toFixed(1)}%; bottom: ${DOT_BOTTOM + dot.yLevel * DOT_SPACING}px;"
           title="${dot.isPersonal ? 'Therapeutisches Team' : 'Patient'}">
      </div>
    `).join('');

    card.innerHTML = `
      <div class="visualization-card-index">D3</div>
      <div class="visualization-title">Wie stark identifizieren Sie sich mit Ihrem präferierten Sockenpaar?</div>
      <div class="group-scale-wrapper">
        <div class="group-dots-container">
          ${dotsHTML}
        </div>
        <div class="group-scale-line"></div>
        <div class="likert-labels" aria-hidden="true">
          <span>gar nicht</span>
          <span>vollständig</span>
        </div>
      </div>
      <div class="likert-legend" aria-hidden="true">
        <div class="likert-legend-item">
          <div class="group-dot-legend patienten"></div>
          <span>Patient</span>
        </div>
        <div class="likert-legend-item">
          <div class="group-dot-legend personal"></div>
          <span>Therapeutisches Team</span>
        </div>
      </div>
    `;
  }

  container.appendChild(card);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  observer.observe(card);
}
