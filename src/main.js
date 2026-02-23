import { PageRouter } from './router.js';
import { loadAndParseData, filterAndAggregate } from './utils/csv-parser.js';
import { renderLikertScales } from './visualizations/likert-scale.js';
import { renderBarCharts, TEIL_B_QUESTIONS, TEIL_C_QUESTIONS } from './visualizations/bar-chart.js';
import { renderSlideshow } from './visualizations/slideshow.js';
import { renderTextList } from './visualizations/text-list.js';

const PAGE_IDS = ['start', 'teil-a', 'teil-b', 'teil-c', 'teil-d', 'teil-e'];

document.addEventListener('DOMContentLoaded', async () => {
  // eslint-disable-next-line no-unused-vars
  const router = new PageRouter(PAGE_IDS);

  document.body.classList.add('loading-data');

  try {
    const data = await loadAndParseData();
    const rawRows = data.rawRows;

    renderLikertScales('teil-a-content', data.teilA);
    renderBarCharts('teil-b-content', data.teilB, TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', data.teilC, TEIL_C_QUESTIONS);
    renderTextList('abschiebsbriefe-content', data.abschiebsbriefe);
    renderSlideshow('slideshow-container', data.zeichnungen);

    initFilter('teil-a', rawRows, (filtered) => {
      renderLikertScales('teil-a-content', filtered.teilA);
    });
    initFilter('teil-b', rawRows, (filtered) => {
      renderBarCharts('teil-b-content', filtered.teilB, TEIL_B_QUESTIONS);
    });
    initFilter('teil-c', rawRows, (filtered) => {
      renderBarCharts('teil-c-content', filtered.teilC, TEIL_C_QUESTIONS);
    });

  } catch (error) {
    console.error('Failed to load data:', error);
    renderLikertScales('teil-a-content', []);
    renderBarCharts('teil-b-content', [], TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', [], TEIL_C_QUESTIONS);
    renderTextList('abschiebsbriefe-content', []);
    renderSlideshow('slideshow-container', []);
  } finally {
    document.body.classList.remove('loading-data');
  }
});

/**
 * Verdrahtet die Filter-Buttons einer Seite.
 * @param {string} pageId - z.B. 'teil-a'
 * @param {Array} rawRows - Alle ungefilterten CSV-Zeilen
 * @param {Function} renderFn - Callback mit gefiltertem Datensatz: (filtered) => void
 */
function initFilter(pageId, rawRows, renderFn) {
  const page = document.getElementById(`page-${pageId}`);
  if (!page) return;

  const buttons = page.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filtered = filterAndAggregate(rawRows, btn.dataset.filter);
      renderFn(filtered);
    });
  });
}
