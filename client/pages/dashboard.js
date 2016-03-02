'use strict';

import KeenQuery from 'keen-query';
import {init as chartUi, renderChart, displayError} from '../components/chart-ui';
import {fromQueryString as getConfigurator} from '../components/configurator';
import {storeKq} from '../data/kq-cache';

export function init () {

	const configure = getConfigurator();

	[].forEach.call(document.querySelectorAll('.chart'), el => {
		const alias = el.dataset.keenAlias;
		const printerEl = el.querySelector('.chart__printer')
		let conf;
		if (conf = window.aliases[alias]) {
			try {
				let builtQuery = KeenQuery.buildFromAlias(conf);

				// todo: default to column chart if it has dimension but no interval... or something
				builtQuery = builtQuery.setPrinter(conf.printer || 'LineChart').tidy();

				storeKq(alias, builtQuery);

				if (!conf.freeze) {
					// avoid showing as big number when the default view could easily be converted to a line graph over time
					if (builtQuery.dimension < 2 && (['AreaChart','LineChart','ColumnChart'].indexOf(conf.printer) > -1 || !conf.printer)) {
						builtQuery = builtQuery.interval('d')
					}
					builtQuery = configure(builtQuery);
				}
				renderChart(printerEl, builtQuery, conf);
			} catch (err) {
				displayError(printerEl, err, null, conf);
			}
		} else {
			displayError(printerEl, `Invalid chart name: ${alias}`);
		}
	});

	chartUi(document.querySelector('.charts'));
}
