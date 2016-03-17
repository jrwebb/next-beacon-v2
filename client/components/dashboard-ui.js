import Delegate from 'dom-delegate';
import {renderAllCharts} from '../pages/dashboard';

function handleDashboardConfigChange (e) {
	if (e.preventDefault) e.preventDefault();

	const form = document.querySelector('.dashboard__configurator__form');
	const timeframeValue = form.querySelector('.timeframe').value;
	let querystring = '?' + timeframeValue;

	// Add to querystring any filters (e.g. page-type, device-type, rfv)
	const pagetypeValue = form.querySelector('.pagetype').value;
	querystring += '&' + pagetypeValue;


	// Todo: Render charts when user clicks the "back" button in the browser
	history.pushState({}, "", querystring);

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
