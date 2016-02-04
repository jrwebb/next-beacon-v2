'use strict';


function getChartContainer (el) {
	while (!el.classList.contains('chart')) {
		el = el.parentNode;
	}
	return el;
}



// Utilities for user interface (ui) elements
export function init () {

}


// export function renderChartUI (el, kq, alias) {
// 	const uiEl = el.querySelector('.chart__ui');
// 	if (!uiEl) return;

// 	uiEl.insertAdjacentHTML('beforeend', `<a href="${kq.generateKeenUrl('/data/explorer?', 'keen-explorer')}">View in keen explorer</a>`);
// }


// const del = new Delegate(document.querySelector('.charts'));


// import KeenQuery from 'n-keen-query';
// import querystring from 'querystring';
// import Delegate from 'dom-delegate';

// const kqObjects = {};


// function getChartContainer (el) {
// 	while (!el.classList.contains('chart')) {
// 		el = el.parentNode;
// 	}
// 	return el;
// }

// module.exports = {
// 	init: () => {
// 		const del = new Delegate(document.querySelector('.charts'));
// 		const q = getStateFromQuery();

// 		let customiser = getKqConfigurer(q);

// 		del.on('change', '.timeframe-switcher__interval', function (ev) {
// 			ev.preventDefault();
// 			const container = getChartContainer(ev.target);
// 			reprint(container, {
// 				timeframe: getTimeframe(container),
// 				interval: container.querySelector('.timeframe-switcher__interval').value
// 			});
// 		});

// 		del.on('change', '.timeframe-switcher__start, .timeframe-switcher__end, .timeframe-switcher [name="timeframe"]', function (ev) {
// 			ev.preventDefault();
// 			const type = ev.target.name === 'timeframe' ? 'rel' : 'abs';
// 			const container = getChartContainer(ev.target);
// 			const timeframe = getTimeframe(container, type);
// 			if (!timeframe) {
// 				return;
// 			}
// 			reprint(container, {
// 				timeframe: getTimeframe(container, type),
// 				interval: container.querySelector('.timeframe-switcher__interval').value
// 			});
// 		});

// 		del.on('click', '.chart__view-switcher', function (ev) {
// 			ev.preventDefault();
// 			let asData;
// 			const container = getChartContainer(ev.target);
// 			if (ev.target.hasAttribute('aria-pressed')) {
// 				asData = false;
// 				ev.target.removeAttribute('aria-pressed');
// 			} else {
// 				asData = true
// 				ev.target.setAttribute('aria-pressed', '');
// 			}
// 			reprint(container, {
// 				timeframe: getTimeframe(container),
// 				interval: container.querySelector('.timeframe-switcher__interval').value,
// 				asData
// 			});
// 		});
