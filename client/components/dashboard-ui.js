import Delegate from 'dom-delegate';
import {renderAllCharts, renderRecordings} from '../pages/dashboard';
import {fromForm as getConfigurator} from './configurator';

function handleDashboardConfigChange (e) {
	if (e.preventDefault) e.preventDefault();

	const form = document.querySelector('.dashboard__configurator__form');
	const timeframeValue = form.querySelector('.timeframe').value;
	let querystring = '?' + timeframeValue;

	// Add to querystring any filters (e.g. page-type, device-type, rfv)
	const pagetypeValue = form.querySelector('.pagetype').value;
	querystring += '&' + pagetypeValue;

	// Todo: Render charts when user clicks the "back" button in the browser
	history.pushState({}, '', querystring);

	renderAllCharts();
}

function reconfigureRecordings (ev) {
	if (window.location.search.indexOf('recordings') !== -1) {
		const configuration = getConfigurator(document.querySelector('.chart__configurator'), ev.target.name);
		renderRecordings(configuration);
	}
}

export function init () {
	if (!document.querySelector('.dashboard__configurator__form')) {
		return false;
	} else {
		const delegate = new Delegate(document.body);
		delegate.on('change', '.dashboard__configurator__form', handleDashboardConfigChange);
		delegate.on('change', '.chart__configurator [name]', reconfigureRecordings);
		delegate.on('change', '.extract__numberOfEvents-range', reconfigureRecordings);
	}
}
