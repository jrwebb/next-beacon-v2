//import {fromForm as getConfigurator} from '../components/configurator';

const el = document.querySelector('.global__configurator__form');
el.addEventListener('change', (e) => {
	if (e.preventDefault) e.preventDefault();

	const form = e.currentTarget;
	const timeframeValue = form.querySelector('.timeframe').value;

	let querystring = '?' + encodeURIComponent(timeframeValue);
	history.pushState({}, "", querystring);

//	window.location = `/dashboard/${document.querySelector('.featureFlagText').value}`;
	return false;
});
