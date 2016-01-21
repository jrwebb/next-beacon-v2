/* global google */

'use strict';

import chartui from './components/chartui';
import colors from './colors';

const ucfirst = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const defaultOptions = {
	is3D: true,
	pieSliceTextStyle: {
		color: 'black'
	},
	trendlines: { 0: {
		color: 'green'
	}},
	curveType:'function',
	height: 450,
	chartArea: {
		top: '5%',
		left: '5%',
		width: '95%',
		height: '75%'
	},
	vAxis: {
		viewWindow: { min: 0 }
	},
	hAxis: {
		gridlines: { count: 10 }
	},
	legend: { position: 'bottom' },
	colors: colors.getColors()
};

const drawChart = (data, el, alias) => {
	const coreChartTypes = ['line','pie','bar','column'];

	if (!(alias || el || data) || coreChartTypes.find(e => e === alias.printer.toLowerCase()) === undefined) {
		throw 'Error drawing google chart.';
	}
	const chart = new google.visualization[ucfirst(alias.printer) + 'Chart'](el);

	let options = defaultOptions;
	options.title = alias.label;

	// Google line and column charts expect times to be date objects
	data.headings.forEach((h, i) => {
		if (h === 'timeframe' && ['line','column'].find(e => e === alias.printer.toLowerCase()) !== undefined) {
			data.rows = data.rows.map(r => {
				r[i] = new Date(r[i]);
				return r;
			});
		}
	});
	var mergedData = [data.headings].concat(data.rows);
	let dataTable = new google.visualization.arrayToDataTable(mergedData); // eslint-disable-line new-cap

	chart.draw(dataTable, options);
	chartui.renderChartUI(el, alias);
}

module.exports = {
	drawChart : drawChart
}
