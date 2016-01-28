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
	if (!(alias || el || data) || coreChartTypes.indexOf(alias.printer) === -1) {
		throw 'Error drawing google chart.';
	}
	const chart = new google.visualization[alias.printer](el);

	let options = defaultOptions;
	options.title = alias.question;

	// Google line and column charts expect times to be date objects
	// (Also: See hAxis.ticks for a possible alternative)
	let headings;
	if (data.headings) {
		headings = data.headings;
		headings.forEach((h, i) => {
			if (h === 'timeframe' && ['LineChart','ColumnChart'].indexOf(alias.printer) > -1) {
				data.rows = data.rows.map(r => {
					r[i] = new Date(r[i]);
					return r;
				});
			}
		});

		headings[0] = alias.label;
	} else {
		headings = ['', alias.label]
	}

	var mergedData = [headings].concat(data.rows);
	let dataTable = new google.visualization.arrayToDataTable(mergedData); // eslint-disable-line new-cap

	chart.draw(dataTable, options);

	chartui.renderChartUI(el, alias);
}

module.exports = {
	drawChart : drawChart,
	getCoreChartTypes : () => coreChartTypes
}
