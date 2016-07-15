import {init as chartUi} from '../components/chart-ui';
import {init as dashboardUi} from '../components/dashboard-ui';
import {buildAndRenderChart, displayError} from '../components/chart';
import {getRecordings} from '../components/recordings';

window.jQuery = window.$ = require('jquery');
require('jquery-stupid-table');

export function renderAllCharts () {
	[].forEach.call(document.querySelectorAll('.chart'), el => {
		const chartName = el.dataset.chartName;
		const printerEl = el.querySelector('.chart__printer')
		let chart;
		if (chart = window.charts.find(c => c.name === chartName)) {
			buildAndRenderChart(chart, printerEl)
		} else {
			displayError(printerEl, `Invalid chart name: ${chartName}`);
		}
	});
}

export function renderRecordings (configuration) {

	if (!window.charts || window.charts.length > 1) {
		return;
	}

	const recordingsEl = document.querySelector('.chart__ui__recordings');
	const messagesEl = document.querySelector('.chart__ui__messages');
	const rangeEl = document.querySelector('#chart__configurator__range');
	const limit = rangeEl.querySelector('input').value;

	rangeEl.classList.remove('hidden');

	getRecordings({
		el: recordingsEl,
		queryStr: window.charts[0].query,
		eventLimit: parseInt(limit),
		messagesEl: messagesEl,
		configuration: configuration,
		chartName: window.charts[0].name
	});
}

// Render all charts and initialize chart UI
export function init () {
	renderAllCharts();

	if (window.location.search.indexOf('recordings') !== -1) {
		renderRecordings();
	}

	// Init UI for all charts
	chartUi(document.querySelector('.charts'));

	// Init dashboard UI
	dashboardUi();
}
