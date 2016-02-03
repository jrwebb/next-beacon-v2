/* global google */

'use strict';

import colors from './colors';

const coreChartTypes = ['LineChart','PieChart','BarChart','ColumnChart','AreaChart','SteppedAreaChart','Table'];

const defaultOptions = {
	width: '100%',
	height: '100%',
	is3D: true,
	pieSliceTextStyle: {
		color: 'black'
	},
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

function getDataTable (alias, kq, printer) {
	printer = printer || alias.printer;
	const expectsDateObjects = ['LineChart','ColumnChart', 'Table'].indexOf(printer) > -1;
	const kqData = kq.getTable().humanize(expectsDateObjects ? 'dateObject' : 'human');
	const mergedData = [kqData.headings].concat(kqData.rows);
	return new google.visualization.arrayToDataTable(mergedData); // eslint-disable-line new-cap
}

const drawChart = (alias, el, data, printer) => {
	printer = printer || alias.printer;
	if (!(alias || el || data) || coreChartTypes.find(e => e === printer) === undefined) {
		throw 'Error drawing google chart.';
	}

	const chart = new google.visualization[printer](el);

	let options = Object.assign({}, defaultOptions);
	options.title = alias.question;

	// if only one data set we can try to plot a trend line
	if (data.dimensions === 1) {
		options.trendlines = { 0: {
			color: '#a1dbb2' // Todo: Get this color from colors.js ('Light green')
		}};
	}

	chart.draw(data, options);

	if (printer === 'Table') {
		let childEl = document.createElement('h2');
		childEl.innerHTML = alias.question;
		el.insertBefore(childEl, el.firstChild);
	}
}

module.exports = {
	drawChart : drawChart,
	getDataTable : getDataTable,
	getCoreChartTypes : () => coreChartTypes
}
