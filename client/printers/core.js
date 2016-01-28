/* global google */

'use strict';

import googleChart from '../google-chart';

// Todo: Figure out why converting this to es6 breaks it. (`this` becomes `undefined`, but why?)
// This breaks it: `module.exports = () => {`
module.exports = function () {
	const data = this.getTable().humanize('shortISO');
	return (el, alias) => {
		const drawChart = () => googleChart.drawChart(data, el, alias);
		google.charts.setOnLoadCallback(drawChart.bind({this, el, alias}));
	}
}
