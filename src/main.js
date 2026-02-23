import { PageRouter } from './router.js';
import { loadAndParseData } from './utils/csv-parser.js';
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

    renderLikertScales('teil-a-content', data.teilA);
    renderBarCharts('teil-b-content', data.teilB, TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', data.teilC, TEIL_C_QUESTIONS);
    renderTextList('abschiebsbriefe-content', data.abschiebsbriefe);
    renderSlideshow('slideshow-container', data.zeichnungen);

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
