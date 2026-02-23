import { initHeroScrollAnimation } from './utils/scroll.js';
import { loadAndParseData } from './utils/csv-parser.js';
import { renderLikertScales } from './visualizations/likert-scale.js';
import { renderBarCharts, TEIL_B_QUESTIONS, TEIL_C_QUESTIONS } from './visualizations/bar-chart.js';
import { renderSlideshow } from './visualizations/slideshow.js';
import { renderTextList } from './visualizations/text-list.js';

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  initHeroScrollAnimation();
  initNavigation();
  initActiveNavTracking();

  // Signal loading state before data arrives
  document.body.classList.add('loading-data');

  // Load data and render visualizations
  try {
    const data = await loadAndParseData();

    renderLikertScales('teil-a-content', data.teilA);
    renderBarCharts('teil-b-content', data.teilB, TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', data.teilC, TEIL_C_QUESTIONS);
    renderTextList('abschiebsbriefe-content', data.abschiebsbriefe);
    renderSlideshow('slideshow-container', data.zeichnungen);
  } catch (error) {
    console.error('Failed to load data:', error);
    // Render with empty data so questions are still visible
    renderLikertScales('teil-a-content', []);
    renderBarCharts('teil-b-content', [], TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', [], TEIL_C_QUESTIONS);
    renderTextList('abschiebsbriefe-content', []);
    renderSlideshow('slideshow-container', []);
  } finally {
    document.body.classList.remove('loading-data');
  }
});

// Show navigation after hero
function initNavigation() {
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  if (!nav || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(hero);
}

// Highlight the active nav link based on the visible section
function initActiveNavTracking() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navLinks.length || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}
