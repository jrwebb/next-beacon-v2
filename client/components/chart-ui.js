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

// function composeKqModifiers(funcs) {
// 	const composed = kq => {
// 		let func;
// 		while (func = funcs.shift()) {
// 			kq = func(kq);
// 		}
// 		return kq;
// 	}
// 	return composed;
// }
// function adjustTimeframe (timeframe) {

// 	if (typeof timeframe === 'string') {
// 		if (timeframe.charAt(0) === '{') {
// 			timeframe = JSON.parse(timeframe)
// 		} else {
// 			return kq => kq.relTime(timeframe);
// 		}
// 	}
// 	if (timeframe && timeframe.start && timeframe.end) {
// 		return kq => kq.absTime(timeframe.start, timeframe.end);
// 	}
// 	return kq => kq;
// }

// function adjustInterval(interval) {
// 	// handle the case where it sets the select value to innerHTML of the option when option value not defined
// 	// ANNNNNOYING!!!!
// 	if (interval && interval.charAt(0) === '-') {
// 		interval = null;
// 	}
// 	if (interval) {
// 		return kq => kq.interval(interval);
// 	} else {
// 		return kq => kq;
// 	}
// }

// function getKqCustomiser (opts) {
// 	return composeKqModifiers([
// 		adjustTimeframe(opts.timeframe),
// 		adjustInterval(opts.interval)
// 	]);
// }

// function getQuery () {
// 	const q = querystring.parse(location.search.substr(1));
// 	if (!q.timeframe && q['timeframe[start]'] && q['timeframe[end]']) {
// 		q.timeframe = {
// 			start: q['timeframe[start]'],
// 			end: q['timeframe[end]']
// 		};
// 	}
// 	return q;
// }

// function reprint (container, opts) {
// 	const aliasName = container.dataset.keenAlias;
// 	const kq = kqObjects[aliasName];
// 	const printerEl = container.querySelector('.chart__printer')
// 	printerEl.classList.add('chart-loading');
// 	shakeAndBake(window.aliases[aliasName], getKqCustomiser(opts)(kq), printerEl, opts.asData ? 'Table' : null);
// }

// function getTimeframe(container, type) {
// 	const relTimeEl = container.querySelector('[name="timeframe"]:checked')
// 	const relTime = relTimeEl && relTimeEl.value;
// 	const startEl = container.querySelector('.timeframe-switcher__start');
// 	const endEl = container.querySelector('.timeframe-switcher__end');
// 	const absTime = {
// 		start: startEl.value,
// 		end: endEl.value
// 	};

// 	// fully set absolute time
// 	if (absTime.start && absTime.end && type !== 'rel') {
// 		relTimeEl && relTimeEl.removeAttribute('checked');
// 		return absTime;
// 	// midway through setting absolute time
// 	} else if (type === 'abs') {
// 		return null;
// 	// otherwise fallback to relative time range
// 	} else {
// 		endEl.value = '';
// 		startEl.value = '';
// 		if (!relTime) {
// 			container.querySelector('.timeframe-switcher__timeframe[value="this_14_days"]').setAttribute('checked', '');
// 			return 'this_14_days';
// 		}
// 		return relTime;
// 	}

// }

// module.exports = {
// 	init: () => {
// 		const del = new Delegate(document.querySelector('.charts'));
// 		const q = getQuery();

// 		let customiser = getKqCustomiser(q);

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
