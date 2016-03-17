'use strict';

import {init as chartUi} from '../components/chart-ui';
import {buildAndRenderChart, displayError} from '../components/chart';
import {fromQueryString as getConfiguratorFromQueryString} from '../components/configurator';
import {storeKq} from '../data/kq-cache';

// Render all charts and initialize chart UI
export function init () {
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

	chartUi(document.querySelector('.charts'));
}
