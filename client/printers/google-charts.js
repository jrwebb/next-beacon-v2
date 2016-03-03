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

		if (meta.datalabel && kqTable.dimension === 1) {
			kqData.headings[1] = meta.datalabel;
		}

		const vizData = google.visualization.arrayToDataTable([kqData.headings].concat(kqData.rows)); // eslint-disable-line new-cap
		const chart = new google.visualization[chartType](el);

		const options = Object.assign({}, defaultChartOptions);
		const labelAxis = Object.assign({}, options.hAxis, {title: kqTable.axes[0].property === 'timeframe' ? undefined : kqTable.axes[0].property});
		const valueAxis = Object.assign({}, options.vAxis, {title: meta.datalabel || kqTable.valueLabel});



		options.hAxis = labelAxis;
		options.vAxis = valueAxis;

		if (chartType === 'BarChart') {
			options.hAxis = valueAxis;
			options.vAxis = labelAxis;
			options.vAxis.textPosition = 'in';
		}

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
			options.legend = { position: 'top' };
		}

		if (window.view && window.view === 'presentation') {
			const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			options.height = viewportHeight * 0.8;
		}

		chart.draw(vizData, options);

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
