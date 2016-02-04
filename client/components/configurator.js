import querystring from 'querystring';
import {storeKq, retrieveKq} from '../data/kq-cache';

function getQuery () {
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
	const q = getQuery();

	return kq => kq
}

export function fromForm () {

}
