/**
 * PageRouter — verwaltet die 6-Seiten-Navigation
 *
 * Seiten-Reihenfolge:
 *   0: start
 *   1: teil-a
 *   2: teil-b
 *   3: teil-c
 *   4: teil-d
 *   5: teil-e
 */
export class PageRouter {
  constructor(pageIds) {
    this.pages = pageIds;
    this.currentIndex = 0;
    this.isAnimating = false;

    this.btnBack = document.getElementById('btn-back');
    this.btnNext = document.getElementById('btn-next');
    this.btnStart = document.getElementById('btn-start');
    this.dotsContainer = document.getElementById('dots');
    this.bottomBar = document.getElementById('bottom-bar');

    this._initDots();
    this._bindEvents();
    this._update();
  }

  /** Erstellt die Dot-Elemente (eines pro Ergebnisseite, d.h. pages.length - 1) */
  _initDots() {
    this.dotsContainer.innerHTML = '';
    for (let i = 1; i < this.pages.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      this.dotsContainer.appendChild(dot);
    }
  }

  /** Bindet Klick-Events an Buttons */
  _bindEvents() {
    this.btnBack.addEventListener('click', () => this.back());
    this.btnNext.addEventListener('click', () => this.next());

    // Startseite: Button und ganzes Panel navigieren vorwärts
    if (this.btnStart) {
      this.btnStart.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }
    const startPage = document.getElementById(`page-${this.pages[0]}`);
    if (startPage) {
      startPage.addEventListener('click', () => this.next());
    }
  }

  /** Weiterblättern */
  next() {
    if (this.isAnimating || this.currentIndex >= this.pages.length - 1) return;
    this._animateTo(this.currentIndex + 1, 'forward');
  }

  /** Zurückblättern */
  back() {
    if (this.isAnimating || this.currentIndex <= 0) return;
    this._animateTo(this.currentIndex - 1, 'backward');
  }

  /**
   * Navigiert zu einer Seite mit Slide-Animation
   * @param {number} newIndex
   * @param {'forward'|'backward'} direction
   */
  _animateTo(newIndex, direction) {
    this.isAnimating = true;

    const exitEl = document.getElementById(`page-${this.pages[this.currentIndex]}`);
    const enterEl = document.getElementById(`page-${this.pages[newIndex]}`);
    const duration = 300;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const actualDuration = reducedMotion ? 10 : duration;

    // Eintretende Seite sofort positionieren (kein Übergang)
    enterEl.style.transition = 'none';
    enterEl.style.transform = direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)';
    enterEl.classList.add('page-active');

    // Reflow erzwingen
    enterEl.offsetHeight; // eslint-disable-line no-unused-expressions

    // Beide Seiten animieren
    const easing = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    exitEl.style.transition = easing;
    exitEl.style.transform = direction === 'forward' ? 'translateX(-100%)' : 'translateX(100%)';
    enterEl.style.transition = easing;
    enterEl.style.transform = 'translateX(0)';

    // UI sofort aktualisieren
    this.currentIndex = newIndex;
    this._update();

    setTimeout(() => {
      exitEl.classList.remove('page-active');
      exitEl.style.transition = '';
      exitEl.style.transform = '';
      enterEl.style.transition = '';
      enterEl.style.transform = '';
      this.isAnimating = false;
    }, actualDuration);
  }

  /** Aktualisiert Bottom-Bar, Dots und Buttons */
  _update() {
    const isStart = this.currentIndex === 0;
    const isLast = this.currentIndex === this.pages.length - 1;

    // Bottom-Bar verstecken auf Startseite
    this.bottomBar.classList.toggle('hidden', isStart);

    // Buttons: aria-hidden steuert visibility via CSS
    this.btnBack.setAttribute('aria-hidden', String(isStart));
    this.btnNext.setAttribute('aria-hidden', String(isLast));

    // Dots: dot i entspricht Seite i+1
    const dots = this.dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('dot-active', i + 1 === this.currentIndex);
    });
  }
}
