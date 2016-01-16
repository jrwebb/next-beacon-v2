/* global google */

'use strict';

const loadChartJS = () => {
	const scriptPromise = new Promise((resolve) => {
		const script = document.createElement('script');
		script.async = script.defer = true;
		script.src = "https://www.gstatic.com/charts/loader.js";
		script.addEventListener('load', () => {
			resolve();
		}, false);
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.appendChild(script);
	});
	return scriptPromise;
}

loadChartJS().then(() => {
	google.charts.load('current', {packages: ['corechart']});
	google.charts.setOnLoadCallback(() => {
		window.googleChartsLoaded = true;
		const googleChartsLoaded = new Event('googleChartsLoaded');
		window.dispatchEvent(googleChartsLoaded);
	});
});
