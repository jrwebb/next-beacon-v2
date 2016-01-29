'use strict';

import KeenQuery from 'n-keen-query';
import querystring from 'querystring';
// Shake the alias and builtQuery up then bake it into the Dom element
const shakeAndBake = (alias, builtQuery, el) => {

	// Todo: Check that the printer has been defined in KeenQuery and/or BeaconV2
	const printer = alias.printer || 'html';

	try {
		alias.explorerURL = builtQuery.generateKeenUrl('/data/explorer?');

		// Fetch the data from Keen API and call the printer function
		builtQuery.print(printer)

			// Handle the response from the printer function
			.then(res => {
				el.classList.remove('chart-loading');
				if (typeof res === 'function') {
					res(el, alias);
				} else {
					el.classList.add('chart-error');
					throw 'There is a problem with the keen-query response.'
				}
			});
	} catch (err) {
		console.log('err', alias);
		el.classList.remove('chart-loading');
		el.classList.add('chart-error');
		el.innerHTML = `<p class="error"><strong>Error: </strong>${err.message || err}</span><p>${alias.name}, ${alias.label}, ${alias.question}: ${alias.query}</p>`;
	}
}

module.exports = {
	init: () => {
		const q = querystring.parse(location.search.substr(1));
		let timeframer = kq => kq;

		if (q.timeframe) {
			if (q.timeframe.charAt(0) === '{') {
				const timeframe = JSON.parse(q.timeframe);
				timeframer = kq => kq.absTime(timefrmae.start, timeframe.end);
			} else {
				timeframer = kq => kq.relTime(q.timeframe);
			}
		}

		[].slice.call(document.querySelectorAll('[data-keen-alias]')).forEach(el => {
			const aliasAttribute = el.getAttribute('data-keen-alias');

			if (window.aliases && window.aliases[aliasAttribute]) {
				const alias = window.aliases[aliasAttribute];
				const builtQuery = timeframer(KeenQuery.buildFromAlias(alias));

				shakeAndBake(alias, builtQuery, el.parentElement);

				// HACK DURING DEVELOPMENT: Multiple prints of a single KeenQuery
				if (/^\/multi-print\//.test(location.pathname)) {

					// 02
					const builtQuery02 = builtQuery
						.relTime('this_90_days');

					let el02 = el.parentElement.cloneNode(true);
					el.parentElement.parentElement.appendChild(el02);

					shakeAndBake(alias, builtQuery02, el02);

					// 03
					const builtQuery03 = builtQuery
						.relTime('this_14_days')
						.interval('d');

					let el03 = el.parentElement.cloneNode(true);
					el.parentElement.parentElement.appendChild(el03);

					shakeAndBake(alias, builtQuery03, el03);

					// 04
					const builtQuery04 = builtQuery
						.relTime('this_7_days')
						.interval('d');

					let el04 = el.parentElement.cloneNode(true);
					el.parentElement.parentElement.appendChild(el04);

					let alias04 = Object.assign({}, alias);
					alias04.printer = 'LineChart';
					shakeAndBake(alias04, builtQuery04, el04);
				}
			}
		});
	}
}
