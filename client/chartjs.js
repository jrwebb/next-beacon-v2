/* global Chart */

'use strict';

const loadChartJS = () => {
	const scriptPromise = new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.async = script.defer = true;
		script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js";
		script.addEventListener('load', () => {
			resolve();
		}, false);
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(script, s);
	});
	return scriptPromise;
}

loadChartJS().then(() => {
	Chart.defaults.global.responsive = true;
	Chart.defaults.global.maintainAspectRatio = true;
	Chart.defaults.global.pointDotRadius = 2;
	Chart.defaults.global.pointDotStrokeWidth = 1;
	Chart.defaults.global.datasetFill = false;
	Chart.defaults.global.legendTemplate = "<ul style=\"list-style-type: none;\" class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\">&nbsp;</span>&nbsp;<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>";
});
