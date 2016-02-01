'use strict';

import KeenQuery from 'n-keen-query';
import querystring from 'querystring';
import Delegate from 'dom-delegate';

const kqObjects = {};


function getChartContainer (el) {
	while (!el.classList.contains('chart-container')) {
		el = el.parentNode;
	}
	return el;
}

// Shake the alias and builtQuery up then bake it into the Dom element
const shakeAndBake = (alias, builtQuery, el) => {
	try {
		alias.explorerURL = '/data/explorer?' + KeenQuery.generateExplorerUrl(builtQuery);

		if (!alias.printer) {

			// Default to google table for multi-dimention data
			if (builtQuery.dimensions && builtQuery.dimensions.length > 0) {
				alias.printer = 'Table';
			}
			else {
				alias.printer = 'html';
			}
		}

		// Fetch the data from Keen API and call the printer function
		builtQuery.print(alias.printer)

			// Handle the response from the printer function
			.then(res => {
				el.classList.remove('chart-loading');
				el.classList.add('chart-loaded');
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

function getTimeframerFunction (timeframe) {

	if (typeof timeframe === 'string') {
		if (timeframe.charAt(0) === '{') {
			timeframe = JSON.parse(timeframe)
		} else {
			return kq => kq.relTime(timeframe);
		}
	}
	if (timeframe) {
		return kq => kq.absTime(timeframe.start, timeframe.end);
	}
	return kq => kq;
}

function getQuery () {
	const q = querystring.parse(location.search.substr(1));
	if (q['timeframe[start]'] && q['timeframe[end]']) {
		q.timeframe = {
			start: q['timeframe[start]'],
			end: q['timeframe[end]']
		};
	}
	return q;
}

function reprint (container, timeframe) {
	const aliasName = container.dataset.keenAlias;
	const kq = kqObjects[aliasName];
	const printerEl = container.querySelector('.chart__printer')
	printerEl.classList.add('chart-loading');
	shakeAndBake(window.aliases[aliasName], getTimeframerFunction(timeframe)(kq), printerEl);
}

module.exports = {
	init: () => {
		const del = new Delegate(document.querySelector('.charts'));
		const q = getQuery();

		let timeframer = getTimeframerFunction(q.timeframe);

		del.on('click', '.timeframe-switcher a', function (ev) {
			ev.preventDefault();
			const timeframe = ev.target.dataset.timeframe;
			const container = getChartContainer(ev.target);
			reprint(container, timeframe);
		});

		del.on('submit', '.timeframe-switcher__custom', function (ev) {
			ev.preventDefault();
			ev.target.querySelector('.timeframe-switcher__start').value
			const timeframe = {
				start: ev.target.querySelector('.timeframe-switcher__start').value,
				end: ev.target.querySelector('.timeframe-switcher__end').value
			}
			const container = getChartContainer(ev.target);
			reprint(container, timeframe);
			// const aliasName = container.dataset.keenAlias;
			// const kq = kqObjects[aliasName];
			// const printerEl = container.querySelector('.chart__printer')
			// printerEl.classList.add('chart-loading');
			// shakeAndBake(window.aliases[aliasName], getTimeframerFunction(timeframe)(kq), printerEl);
		});

		[].slice.call(document.querySelectorAll('.chart-container')).forEach(el => {
			const aliasAttribute = el.getAttribute('data-keen-alias');

			if (window.aliases && window.aliases[aliasAttribute]) {
				const alias = window.aliases[aliasAttribute];
				const builtQuery = timeframer(KeenQuery.buildFromAlias(alias));
				kqObjects[aliasAttribute] = builtQuery;
				const printerEl = el.querySelector('.chart__printer')
				shakeAndBake(alias, builtQuery, printerEl);

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
