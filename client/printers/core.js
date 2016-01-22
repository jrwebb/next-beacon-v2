/* global google */

'use strict';

import googleChart from '../google-chart';

module.exports = function () {
	const data = this.getTable().humanize('shortISO');
	return (el, alias) => {
		const drawChart = () => googleChart.drawChart(data, el, alias);

		// Todo: Grok why bind() works here.
		google.charts.setOnLoadCallback(drawChart.bind({data, el, alias}));
	}
}
