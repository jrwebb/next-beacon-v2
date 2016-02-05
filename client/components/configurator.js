import querystring from 'querystring';
import {getFormState} from './read-configurator-form';

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
	if (interval) {
		return kq => kq.interval(interval);
	} else {
		return kq => kq;
	}
}

function adjustPrinter(printer) {
	if (printer) {
		return kq => kq.setPrinter(printer);
	} else {
		return kq => kq;
	}
}

function getKqConfigurer (opts) {
	return composeKqModifiers([
		adjustTimeframe(opts.timeframe),
		adjustInterval(opts.interval),
		adjustPrinter(opts.printer)
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

export function fromQueryString () {
	return getKqConfigurer(getStateFromQuery());
}

export function fromForm (form, updatedInput) {
	return getKqConfigurer(getFormState(form, updatedInput));
}
