import { PageRouter } from './router.js';
import { loadAndParseData, filterAndAggregate } from './utils/csv-parser.js';
import { renderLikertScales, TEIL_E_LIKERT_QUESTIONS } from './visualizations/likert-scale.js';
import { renderBarCharts, TEIL_B_QUESTIONS, TEIL_C_QUESTIONS, TEIL_E_SINGLE_QUESTIONS } from './visualizations/bar-chart.js';
import { renderSlideshow } from './visualizations/slideshow.js';
import { renderTextList, renderFaltstrategieGroups } from './visualizations/text-list.js';
import { renderGroupDotScale } from './visualizations/scale-dot.js';
import { renderPodium } from './visualizations/podium.js';

const PAGE_IDS = ['start', 'teil-a', 'teil-b', 'teil-c', 'teil-d', 'teil-e', 'danke'];

const TEIL_E_LIKERT_CONFIG = {
  questions: TEIL_E_LIKERT_QUESTIONS,
  scaleMin: 0,
  scaleMax: 2,
  scaleLabels: ['Trifft nicht zu', 'neutral', 'Trifft zu'],
  prefix: 'E4.'
};

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
    renderFaltstrategieGroups('faltstrategien-content', data.faltstrategieTexte);
    renderTextList('abschiebsbriefe-content', data.abschiebsbriefe);
    renderSlideshow('slideshow-container', data.zeichnungen);
    renderGroupDotScale('teil-d3-content', data.teilD3);
    renderBarCharts('teil-e-single-content', data.teilE.singleChoice, TEIL_E_SINGLE_QUESTIONS);
    renderLikertScales('teil-e-likert-content', data.teilE.likert3, TEIL_E_LIKERT_CONFIG);
    renderPodium('podium-content', data.zeichnungen);

    initFilter('teil-a', rawRows, (filtered) => {
      renderLikertScales('teil-a-content', filtered.teilA);
    });
    initFilter('teil-b', rawRows, (filtered) => {
      renderBarCharts('teil-b-content', filtered.teilB, TEIL_B_QUESTIONS);
    });
    initFilter('teil-c', rawRows, (filtered) => {
      renderBarCharts('teil-c-content', filtered.teilC, TEIL_C_QUESTIONS);
      renderFaltstrategieGroups('faltstrategien-content', filtered.faltstrategieTexte);
    });
    initFilter('teil-e', rawRows, (filtered) => {
      renderBarCharts('teil-e-single-content', filtered.teilE.singleChoice, TEIL_E_SINGLE_QUESTIONS);
      renderLikertScales('teil-e-likert-content', filtered.teilE.likert3, TEIL_E_LIKERT_CONFIG);
    });

  } catch (error) {
    console.error('Failed to load data:', error);
    renderLikertScales('teil-a-content', []);
    renderBarCharts('teil-b-content', [], TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', [], TEIL_C_QUESTIONS);
    renderFaltstrategieGroups('faltstrategien-content', []);
    renderTextList('abschiebsbriefe-content', []);
    renderSlideshow('slideshow-container', []);
    renderGroupDotScale('teil-d3-content', []);
    renderBarCharts('teil-e-single-content', [], TEIL_E_SINGLE_QUESTIONS);
    renderLikertScales('teil-e-likert-content', [], TEIL_E_LIKERT_CONFIG);
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
