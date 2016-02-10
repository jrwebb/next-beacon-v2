'use strict';

import KeenQuery from 'n-keen-query';
import {init as chartUi, renderChart} from '../components/chart-ui';
import {fromQueryString as getConfigurator} from '../components/configurator';
import {storeKq} from '../data/kq-cache';

export function init () {

	const configure = getConfigurator();

	[].forEach.call(document.querySelectorAll('.chart'), el => {
		const alias = el.dataset.keenAlias;
		const printerEl = el.querySelector('.chart__printer')
		let conf;
		if (conf = window.aliases[alias]) {
			let builtQuery = KeenQuery.buildFromAlias(conf);

			// todo: put this in buildFromAlias
			builtQuery = builtQuery.setPrinter(conf.printer || 'LineChart').tidy();

			storeKq(alias, builtQuery);
			renderChart(printerEl, configure(builtQuery), conf);

		} else {
			printerEl.classList.add('chart-error');
			printerEl.innerHTML = `<p class="error">Invalid chart name: ${alias}</p>`;
		}
	});

	chartUi(document.querySelector('.charts'));

			// // HACK DURING DEVELOPMENT: Multiple prints of a single KeenQuery
			// if (/^\/multi-print\//.test(location.pathname)) {

			// 	// 02
			// 	const builtQuery02 = builtQuery
			// 		.relTime('this_90_days');

			// 	let el02 = el.parentElement.cloneNode(true);
			// 	el.parentElement.parentElement.appendChild(el02);

			// 	renderChart(alias, builtQuery02, el02);

			// 	// 03
			// 	const builtQuery03 = builtQuery
			// 		.relTime('this_14_days')
			// 		.interval('d');

			// 	let el03 = el.parentElement.cloneNode(true);
			// 	el.parentElement.parentElement.appendChild(el03);

			// 	renderChart(alias, builtQuery03, el03);

			// 	// 04
			// 	const builtQuery04 = builtQuery
			// 		.relTime('this_7_days')
			// 		.interval('d');

			// 	let el04 = el.parentElement.cloneNode(true);
			// 	el.parentElement.parentElement.appendChild(el04);

			// 	let alias04 = Object.assign({}, alias);
			// 	alias04.printer = 'LineChart';
			// 	renderChart(alias04, builtQuery04, el04);
			// }
}
