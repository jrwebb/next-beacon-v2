import querystring from 'querystring';
import {getFormState} from './read-configurator-form';

function composeKqModifiers(functions) {
	const composed = (kq, skip) => {
		kq = kq.clone(true);
		let func;
		const funcs = functions.slice();
		while (func = funcs.shift()) {
			if (skip && skip.includes(func._name)) {
				return kq;
			}
			kq = func(kq);
		}
		return kq;
	}
	return composed;
}

function timeframeModifier (timeframe) {
	let func;
	if (typeof timeframe === 'string' && timeframe.charAt(0) === '{') {
		timeframe = JSON.parse(timeframe)
	}
	if (typeof timeframe === 'string') {
		func = kq => kq.relTime(timeframe);
	} else if (timeframe && timeframe.start && timeframe.end) {
		func = kq => kq.absTime(timeframe.start, timeframe.end);
	} else {
		func = kq => kq;
	}
	func._name = 'timeframe';
	return func;
}

function simpleKqModifier(method, value) {
	let func;
	if (value) {
		func = kq => kq[method](value);
	} else {
		func = kq => kq;
	}
	func._name = method;
	return func;
}

function getKqConfigurer (opts) {
	return composeKqModifiers([
		timeframeModifier(opts.timeframe),
		simpleKqModifier('interval', opts.interval),
		simpleKqModifier('group', opts.group),
		simpleKqModifier('setPrinter', opts.printer)
	].concat(opts.filters.map(filterConf => {
		return simpleKqModifier('filter', `${filterConf.prop}=${filterConf.value}`);
	})));
}

function getStateFromQuery () {
	const q = querystring.parse(location.search.substr(1));
	if (!q.timeframe && q['timeframe[start]'] && q['timeframe[end]']) {
		q.timeframe = {
			start: q['timeframe[start]'],
			end: q['timeframe[end]']
		};
	}
	q.filters = [];
	return q;
}

export function fromQueryString () {
	return getKqConfigurer(getStateFromQuery());
}

export function fromForm (form, updatedInput) {
	return getKqConfigurer(getFormState(form, updatedInput));
}
