'use strict';

import KeenQuery from 'n-keen-query';
import {init as chartUi} from '../components/chart-ui';
import {fromQueryString as getConfigurator} from '../components/configurator';
import {storeKq, retrieveKq} from '../data/kq-cache';


export function init () {

	const configure = getConfigurator();

	[].slice.call(document.querySelectorAll('.chart')).forEach(el => {
		const alias = el.getAttribute('data-keen-alias');
		const printerEl = el.querySelector('.chart__printer')
		let conf;
		if (conf = window.aliases[alias]) {
			const builtQuery = configure(KeenQuery.buildFromAlias(conf));
			storeKq(builtQuery);
			// temporarily force all line charts on first render;
			conf.printer = null;
			try {
				const printer = conf.printer || 'LineChart';

				// Fetch the data from Keen API and call the printer function
				builtQuery.print(printer)

					// Handle the response from the printer function
					.then(renderer => {
						printerEl.classList.remove('chart-loading');
						printerEl.classList.add('chart-loaded');
						if (typeof renderer === 'function') {
							renderer(printerEl, conf);
						} else {
							printerEl.classList.add('chart-error');
							throw 'There is a problem with the keen-query response.'
						}
					});
			} catch (err) {
				console.log('err', conf);
				printerEl.classList.remove('chart-loading');
				printerEl.classList.add('chart-error');
				printerEl.innerHTML = `<p class="error"><strong>Error: </strong>${err.message || err}</span><p>${conf.name}, ${conf.label}, ${conf.question}: ${conf.query}</p>`;
			}



		} else {
			printerEl.classList.add('chart-error');
			printerEl.innerHTML = `<p class="error">Invalid chart name: ${alias}</p>`;
		}
			// // HACK DURING DEVELOPMENT: Multiple prints of a single KeenQuery
			// if (/^\/multi-print\//.test(location.pathname)) {

			// 	// 02
			// 	const builtQuery02 = builtQuery
			// 		.relTime('this_90_days');

			// 	let el02 = el.parentElement.cloneNode(true);
			// 	el.parentElement.parentElement.appendChild(el02);

			// 	printChart(alias, builtQuery02, el02);

			// 	// 03
			// 	const builtQuery03 = builtQuery
			// 		.relTime('this_14_days')
			// 		.interval('d');

			// 	let el03 = el.parentElement.cloneNode(true);
			// 	el.parentElement.parentElement.appendChild(el03);

			// 	printChart(alias, builtQuery03, el03);

			// 	// 04
			// 	const builtQuery04 = builtQuery
			// 		.relTime('this_7_days')
			// 		.interval('d');

			// 	let el04 = el.parentElement.cloneNode(true);
			// 	el.parentElement.parentElement.appendChild(el04);

			// 	let alias04 = Object.assign({}, alias);
			// 	alias04.printer = 'LineChart';
			// 	printChart(alias04, builtQuery04, el04);
			// }
	});

	chartUi();

}
