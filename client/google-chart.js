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
		height: '85%'
	},
	vAxis: {
		viewWindow: { min: 0 }
	},
	legend: { position: 'bottom' },
	colors: colors.getColors()
};

const drawChart = (data, el, alias) => {
	const coreChartTypes = ['line','pie','bar','column'];

	if (!(alias || el || data) || coreChartTypes.find(e => e === alias.printer.toLowerCase()) === undefined) {
		throw 'Error drawing google chart.';
	}

	let dataTable = new google.visualization.DataTable();
	dataTable.addColumn('string', alias.label);
	data.headings.slice(1).forEach(a => {
		dataTable.addColumn('number', a);
	})

	data.rows.forEach(row => {
		dataTable.addRow(row);
	});

	let options = defaultOptions;
	options.title = alias.label;

	let chart = new google.visualization[ucfirst(alias.printer) + 'Chart'](el);
	chart.draw(dataTable, options);
	chartui.renderChartUI(el, alias);
}

module.exports = {
	drawChart : drawChart
}
