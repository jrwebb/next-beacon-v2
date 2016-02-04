import querystring from 'querystring';
import {storeKq, retrieveKq} from '../data/kq-cache';


function composeKqModifiers(funcs) {
	const composed = kq => {
		kq = kq.clone(true);
		let func;
		while (func = funcs.shift()) {
			kq = func(kq);
		}
		return kq;
	}
	return composed;
}

function adjustTimeframe (timeframe) {

	if (typeof timeframe === 'string') {
		if (timeframe.charAt(0) === '{') {
			timeframe = JSON.parse(timeframe)
		} else {
			return kq => kq.relTime(timeframe);
		}
	}
	if (timeframe && timeframe.start && timeframe.end) {
		return kq => kq.absTime(timeframe.start, timeframe.end);
	}
	return kq => kq;
}

function adjustInterval(interval) {
	// handle the case where it sets the select value to innerHTML of the option when option value not defined
	// ANNNNNOYING!!!!
	if (interval && interval.charAt(0) === '-') {
		interval = null;
	}
	if (interval) {
		return kq => kq.interval(interval);
	} else {
		return kq => kq;
	}
}

function getKqConfigurer (opts) {
	return composeKqModifiers([
		adjustTimeframe(opts.timeframe),
		adjustInterval(opts.interval)
	]);
}

function getStateFromQuery () {
	const q = querystring.parse(location.search.substr(1));
	if (!q.timeframe && q['timeframe[start]'] && q['timeframe[end]']) {
		q.timeframe = {
			start: q['timeframe[start]'],
			end: q['timeframe[end]']
		};
	}
	return q;
}



// import KeenQuery from 'n-keen-query';







// function reprint (container, opts) {
// 	const aliasName = container.dataset.keenAlias;
// 	const kq = kqObjects[aliasName];
// 	const printerEl = container.querySelector('.chart__printer')
// 	printerEl.classList.add('chart-loading');
// 	shakeAndBake(window.aliases[aliasName], getKqConfigurer(opts)(kq), printerEl, opts.asData ? 'Table' : null);
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


function getStateFromForm (updatedInput, form) {
	return {};
}

export function fromQueryString () {
	return getKqConfigurer(getStateFromQuery());
}

export function fromForm (updatedInput, form) {
	return getKqConfigurer(getStateFromForm(updatedInput, form));
}
