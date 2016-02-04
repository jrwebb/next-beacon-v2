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

		const expectsDateObjects = ['LineChart','ColumnChart', 'Table'].indexOf(chartType) > -1;
		const kqData = kq.getTable().humanize(expectsDateObjects ? 'dateObject' : 'human');
		const vizData = google.visualization.arrayToDataTable([kqData.headings].concat(kqData.rows)); // eslint-disable-line new-cap

		const chart = new google.visualization[chartType](el);

		let options = Object.assign({}, defaultChartOptions);

		// if only one data set we can try to plot a trend line
		if (vizData.dimensions === 1) {
			options.trendlines = { 0: {
				color: colorsMap['Light green']
			}};
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
