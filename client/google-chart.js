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
		color: '#a1dbb2' // Todo: Get this color from colors.js ('Light green')
	}},
	curveType:'function',
	height: 450,
	chartArea: {
		top: '10%',
		left: '5%',
		width: '95%',
		height: '75%'
	},
	vAxis: {
		viewWindow: { min: 0 }
	},
	hAxis: {
		gridlines: {
			count: 8,
			color: '#F7F7F7'
		},
	},
	titleTextStyle: {
		color: '#222',
		fontName: 'HelveticaNeue-Light',
		fontSize: 26,
		bold: false
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
	options.title = alias.question;

	// Google line and column charts expect times to be date objects
	// (Also: See hAxis.ticks for a possible alternative)
	data.headings.forEach((h, i) => {
		if (h === 'timeframe' && ['line','column'].find(e => e === alias.printer.toLowerCase()) !== undefined) {
			data.rows = data.rows.map(r => {
				r[i] = new Date(r[i]);
				return r;
			});
		}
	});

	// Todo: fix this horrible labelling hack
	data.headings = data.headings.map(h => h === 'timeframe' ? h : alias.label);

	var mergedData = [data.headings].concat(data.rows);
	let dataTable = new google.visualization.arrayToDataTable(mergedData); // eslint-disable-line new-cap

	chart.draw(dataTable, options);
	chartui.renderChartUI(el, alias);
}

module.exports = {
	drawChart : drawChart
}
