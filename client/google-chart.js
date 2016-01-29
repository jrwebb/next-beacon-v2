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

// Todo: Consider moving some of this logic to n-keen-query or keen-query.
const getDataTable = (alias, kq) => {
	let kqTable = kq.getTable().humanize('shortISO'); // 'ISO' or 'dateObject' would be better but is not yet available
	let headings = kqTable.headings;
	let rows = kqTable.rows;

	const interval = alias.interval || 'day';
	headings = headings.map(h => {
		h = h || '';
		if (typeof(h) === 'object' && h.start) {
			h = utils.formatTime(h, interval, 'shortISO')
		}
		return h;
	});

	// Google line, column and table charts expect times to be date objects.
	if (['LineChart', 'ColumnChart', 'Table'].find(e => e === alias.printer) !== undefined) {

		// Convert any valid shortISO time string into a date object.
		// Todo: Maybe do something like `kq.getTable().humanize('dateObject')`
		const formats = [
			'MMM DD, YYYY',
			'YYYY-MM-DD'
		]
		rows = rows.map(r => r.map(c => {
			if (moment(c, formats, true).isValid()) {
				c = new Date(c);
			}
			return c;
		}));
	}

	// Ugly hack for google pie/bar charts.
	if (['PieChart', 'BarChart'].find(e => e === alias.printer) !== undefined) {
		rows = rows.map(r => {
			if (r[0] === 0) r[0] = '';
			return r;
		});
	}

	let mergedData = [headings].concat(rows);
	let dataTable = new google.visualization.arrayToDataTable(mergedData); // eslint-disable-line new-cap
	return dataTable;
}

const drawChart = (alias, el, data) => {
	if (!(alias || el || data) || coreChartTypes.find(e => e === alias.printer) === undefined) {
		throw 'Error drawing google chart.';
	}

	const chart = new google.visualization[alias.printer](el);

	let options = defaultOptions;
	options.title = alias.question;

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
