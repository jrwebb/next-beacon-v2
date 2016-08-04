/* global google */

import {colorsMap} from '../config/colors';
import {defaultChartOptions} from '../config/google-chart';
import {renderBigNumber} from './big-number';
import {getDefaultMeta} from './util';
import viewport from 'o-viewport';

function hasDimension (kq) {
	return kq.getData().dimension;
}

export function googleChartPrinterFactory (chartType) {
	let stacked;

	if (chartType.indexOf('Stacked') === 0) {
		chartType = chartType.substr(7);
		stacked = true;
	} else if (chartType.indexOf('Percent') === 0) {
		chartType = chartType.substr(7);
		stacked = 'percent';
	}

	function chartBuilder (el, kq, meta) {
		return new Promise((resolve, reject) => {

			const expectsDateObjects = ['AreaChart','LineChart','ColumnChart'].indexOf(chartType) > -1;
			const kqTable = kq.getData();
			const kqData = kqTable.unflatten(expectsDateObjects ? 'dateObject' : 'human');

			if (meta.datalabel && kqTable.dimension === 1) {
				kqData.headings[1] = meta.datalabel;
			}
			kqData.headings = kqData.headings.map(r => r === undefined ? "" : r);

			const vizData = google.visualization.arrayToDataTable([kqData.headings].concat(kqData.rows)); // eslint-disable-line new-cap
			const chart = new google.visualization[chartType](el);

			const options = Object.assign({}, defaultChartOptions);

			options.chartArea = Object.assign({}, options.chartArea);

			const labelAxis = Object.assign({}, options.hAxis, {
				title: kqTable.axes[0].property === 'timeframe' ? undefined : kqTable.axes[0].property,
				format: kqTable.axes[0].property !== 'timeframe' ? undefined :
					kq.intervalUnit === 'minute' ? 'h:mma' :
					kq.intervalUnit === 'hour' ? 'd/M ha' : 'd/M'
			});

			const valueAxis = Object.assign({}, options.vAxis, {
				title: meta.datalabel || kqTable.valueLabel
			});

			options.hAxis = labelAxis;
			options.vAxis = valueAxis;

			if (chartType === 'BarChart') {
				options.hAxis = valueAxis;
				options.vAxis = labelAxis;
				options.vAxis.textPosition = 'in';
				options.chartArea.left = '50';
			}

			options.isStacked = stacked || meta.isStacked || false;

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

			if (chartType === 'Table') {
				el.setAttribute('style', `max-height: 400px; overflow: scroll`);
			} else {
				el.removeAttribute('style');
			}

			if (kqTable.dimension > 1) {
				options.legend = { position: 'top' };
			}

			if (window.view && window.view === 'presentation') {
				options.height = viewport.getSize().height * 0.8;
			} else {
				options.height = Math.min(viewport.getSize().height / 3, 450);
			}
			google.visualization.events.addListener(chart, 'ready', () => {
				resolve(chart);
			});
			google.visualization.events.addListener(chart, 'error', () => {
				reject(chart);
			});
			chart.draw(vizData, options);
		});
	}

	return function () {
		return (el, meta) => {
			meta = meta || getDefaultMeta();
			if (hasDimension(this)) {
				return new Promise((resolve, reject) => {
					google.charts.setOnLoadCallback(() => {
						chartBuilder(el, this, meta)
							.then(resolve, reject);
					});
				});
			} else {
				return renderBigNumber(el, this, meta)
			}
		}
	}
}
