import Delegate from 'dom-delegate';
import {renderAllCharts} from '../pages/dashboard';

function handleDashboardConfigChange (e) {
	if (e.preventDefault) e.preventDefault();

	const form = document.querySelector('.dashboard__configurator__form');
	const timeframeValue = form.querySelector('.timeframe').value;
	let querystring = '?' + timeframeValue;

	history.pushState({}, "", querystring);
	//	window.location = querystring;

	renderAllCharts();
}

export function init () {
	if (!document.querySelector('.dashboard__configurator__form')) {
		return false;
	} else {
		const delegate = new Delegate(document.body);
		delegate.on('change', '.dashboard__configurator__form', handleDashboardConfigChange);
	}
}
