'use strict';

import Delegate from 'dom-delegate';
import {init as chartUi} from '../components/chart-ui';
import {buildAndRenderChart, displayError} from '../components/chart';
import {storeKq} from '../data/kq-cache';

function renderAllCharts () {
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

// Render all charts and initialize chart UI
export function init () {
	renderAllCharts();

	// Init UI for all charts
	chartUi(document.querySelector('.charts'));

	// Dashboard UI
	if (document.querySelector('.global__configurator__form')) {
		const delegate = new Delegate(document.body);
		delegate.on('change', '.global__configurator__form', renderAllCharts);
	}
}
