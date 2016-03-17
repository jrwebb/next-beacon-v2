'use strict';

import KeenQuery from 'keen-query';
import {init as chartUi} from '../components/chart-ui';
import {renderChart, displayError} from '../components/chart';
import {fromQueryString as getConfigurator} from '../components/configurator';
import {storeKq} from '../data/kq-cache';

export function init () {

	const configure = getConfigurator();

	[].forEach.call(document.querySelectorAll('.chart'), el => {
		const chartName = el.dataset.chartName;
		const printerEl = el.querySelector('.chart__printer')
		let conf;
		if (conf = window.charts.find(c => c.name === chartName)) {
			try {
				let builtQuery = KeenQuery.buildFromAlias(conf);

				// todo: default to column chart if it has dimension but no interval... or something
				builtQuery = builtQuery.setPrinter(conf.printer || 'LineChart').tidy();

				if (conf.hasConfigurableInterval) {
					// avoid showing as big number when the default view could easily be converted to a line graph over time
					if (builtQuery.dimension < 2 && (['AreaChart','LineChart','ColumnChart'].indexOf(conf.printer) > -1 || !conf.printer)) {
						builtQuery = builtQuery.interval('d')
					}
				}

				storeKq(chartName, builtQuery);

				const configuratorSkipSteps = [];

				if (!conf.hasConfigurableInterval) {
					configuratorSkipSteps.push('interval');
				}

				if (!conf.hasConfigurableTimeframe) {
					configuratorSkipSteps.push('timeframe');
				}

				builtQuery = configure(builtQuery, configuratorSkipSteps);
				renderChart(printerEl, builtQuery, conf);
			} catch (err) {
				displayError(printerEl, err, null, conf);
			}
		} else {
			displayError(printerEl, `Invalid chart name: ${chartName}`);
		}
	});

	chartUi(document.querySelector('.charts'));
}
