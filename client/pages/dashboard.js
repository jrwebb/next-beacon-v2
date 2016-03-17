'use strict';

import KeenQuery from 'keen-query';
import {init as chartUi} from '../components/chart-ui';
import {renderChart, displayError} from '../components/chart';
import {fromQueryString as getConfiguratorFromQueryString} from '../components/configurator';
import {storeKq} from '../data/kq-cache';

// export function renderAllCharts () {}

function buildAndRenderChart (chart, printerEl) {
	try {
		let builtQuery = KeenQuery.buildFromAlias(chart);

		// todo: default to column chart if it has dimension but no interval... or something
		builtQuery = builtQuery.setPrinter(chart.printer || 'LineChart').tidy();

		if (chart.hasConfigurableInterval) {
			// avoid showing as big number when the default view could easily be converted to a line graph over time
			if (builtQuery.dimension < 2 && (['AreaChart','LineChart','ColumnChart'].indexOf(chart.printer) > -1 || !chart.printer)) {
				builtQuery = builtQuery.interval('d')
			}
		}

		storeKq(chart.name, builtQuery);

		const configuratorSkipSteps = [];

		if (!chart.hasConfigurableInterval) {
			configuratorSkipSteps.push('interval');
		}

		if (!chart.hasConfigurableTimeframe) {
			configuratorSkipSteps.push('timeframe');
		}

		const configure = getConfiguratorFromQueryString();
		builtQuery = configure(builtQuery, configuratorSkipSteps);
		renderChart(printerEl, builtQuery, chart);
	} catch (err) {
		displayError(printerEl, err, null, chart);
	}
}

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
