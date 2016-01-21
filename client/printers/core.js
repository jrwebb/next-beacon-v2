/* global google */

'use strict';

import googleChart from '../google-chart';

module.exports = function () {
	const data = this.getTable().humanize('human');
	return (el, alias) => {
		const drawChart = () => {
			googleChart.drawChart(data, el, alias);
		}
		google.charts.setOnLoadCallback(drawChart.bind({data, el, alias}));
		google.charts.load('current', {packages: ['corechart']});
	}
}
