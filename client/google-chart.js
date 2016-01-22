/* global google */

'use strict';

import chartui from './components/chartui';
import colors from './colors';

const coreChartTypes = ['LineChart','PieChart','BarChart','ColumnChart','AreaChart','SteppedAreaChart','Table'];

const defaultOptions = {
	width: '100%',
	height: '100%',
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

// Todo: Add support for tables with less than/more than two dimensions
const drawChart = (data, el, alias) => {

	if (!(alias || el || data) || coreChartTypes.find(e => e === alias.printer) === undefined) {
		throw 'Error drawing google chart.';
	}
	const chart = new google.visualization[alias.printer](el);

	let options = defaultOptions;
	options.title = alias.question;

	// Google line and column charts expect times to be date objects
	// (Also: See hAxis.ticks for a possible alternative)
	let headings = data.headings || [null,null];
	headings.forEach((h, i) => {
		if (h === 'timeframe' && ['LineChart','ColumnChart'].find(e => e === alias.printer) !== undefined) {
			data.rows = data.rows.map(r => {
				r[i] = new Date(r[i]);
				return r;
			});
		}
	});

	// Todo: fix this horrible labelling hack
	headings = headings.map(h => h === 'timeframe' ? h : alias.label);

	var mergedData = [headings].concat(data.rows);
	let dataTable = new google.visualization.arrayToDataTable(mergedData); // eslint-disable-line new-cap

	chart.draw(dataTable, options);

	// Todo: Figure out why UI isn't displayed when multiple charts are on one page.
	chartui.renderChartUI(el, alias);
}

module.exports = {
	drawChart : drawChart,
	getCoreChartTypes : () => coreChartTypes
}
