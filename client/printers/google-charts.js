/* global google */

import {colorsMap} from '../config/colors';
import {defaultChartOptions} from '../config/google-chart';
import {renderBigNumber} from './big-number';
import {getDefaultMeta} from './util';

function hasDimension (kq) {
	return kq.getTable().dimension;
}

export function googleChartPrinterFactory (chartType) {

	function chartBuilder (el, kq, meta) {
		const expectsDateObjects = ['AreaChart','LineChart','ColumnChart'].indexOf(chartType) > -1;
		const kqTable = kq.getTable();
		const kqData = kqTable.humanize(expectsDateObjects ? 'dateObject' : 'human');

		if (kqTable.dimension === 1 && meta.datalabel) {
			kqData.headings[1] = meta.datalabel;
		}

		const vizData = google.visualization.arrayToDataTable([kqData.headings].concat(kqData.rows)); // eslint-disable-line new-cap
		const chart = new google.visualization[chartType](el);

		const options = Object.assign({}, defaultChartOptions);

		options.hAxis = Object.assign({}, options.hAxis, {title: kqTable.axes[0].property});
		options.vAxis = Object.assign({}, options.vAxis, {title: kqTable.valueLabel});

		if (meta.isStacked) options.isStacked = meta.isStacked;

		// if only one data set we can try to plot a trend line
		if (kqTable.dimension === 1) {
			options.trendlines = {
				0: {
					color: colorsMap['Light Green'],
					pointSize: 0,
					tooltip: false
				}
			};
		}
		if (chartType === 'PieChart') {
			options.legend = { position: 'right' };
		}

		if (kqTable.dimension > 1) {
			options.legend = { position: 'in' };
		}

		chart.draw(vizData, options);

		if (meta.question) {
			el.insertAdjacentHTML('afterbegin', `<h2>${meta.question}</h2>`);
		}
	}

	return function () {
		return (el, meta) => {
			meta = meta || getDefaultMeta();
			if (hasDimension(this)) {
				google.charts.setOnLoadCallback(() => chartBuilder(el, this, meta));
			} else {
				return renderBigNumber(el, this, meta);
			}
		}
	}
}
