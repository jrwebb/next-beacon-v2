/* global google */

'use strict';

import chartui from './components/chartui';
import colors from './colors';
import utils from 'keen-query/lib/utils';
import moment from 'moment';

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

const getDataTable = (alias, kq) => {
	const expectsDateObjects = ['LineChart','ColumnChart', 'Table'].indexOf(alias.printer) > -1;
	const kqTable = kq.getTable().humanize(expectsDateObjects ? 'dateObject' : 'human');
	const mergedData = [kqTable.headings].concat(kqTable.rows);
	return new google.visualization.arrayToDataTable(mergedData); // eslint-disable-line new-cap
}

const drawChart = (alias, el, data) => {
	if (!(alias || el || data) || coreChartTypes.find(e => e === alias.printer) === undefined) {
		throw 'Error drawing google chart.';
	}

	const chart = new google.visualization[alias.printer](el);

	let options = Object.assign({}, defaultOptions);
	options.title = alias.question;

	// if only one data set we can try to plot a trend line
	if (data.dimensions === 1) {
		options.trendlines = { 0: {
			color: '#a1dbb2' // Todo: Get this color from colors.js ('Light green')
		}};
	}

	chart.draw(data, options);

	if (alias.printer === 'Table') {
		let childEl = document.createElement('h2');
		childEl.innerHTML = alias.question;
		el.insertBefore(childEl, el.firstChild);
	}

	chartui.renderChartUI(el, alias);
}

module.exports = {
	drawChart : drawChart,
	getDataTable : getDataTable,
	getCoreChartTypes : () => coreChartTypes
}
