/* global google */

import KeenQuery from 'n-keen-query'
import {colorsMap} from '../config/colors';
import {defaultChartOptions, supportedChartTypes} from '../config/google-chart';
import humanize from 'humanize-plus';

function hasDimension (kq) {
	return kq.getTable().dimension;
}

function getDefaultMeta () {
	return {
		label: undefined,
		question: undefined
	};
}



function bigNumber (el, kq, meta) {
	let html = `<div class="o-big-number o-big-number--standard" title="${meta.question}">`

	if (meta.question) {
		html += `<div class="o-big-number__content o-big-number__content--question chart-question">${meta.question}</div>`;
	}

	const niceNumber = humanize.compactInteger(kq.getTable().data, 1);
	html += `<div class="o-big-number__title chart-data">${niceNumber}</div>`;

	if (meta.label) {
		html += `<div class="o-big-number__content chart-label">${meta.label}</div>`;
	}

	el.innerHTML = html + `</div>`;
}

function googleChartPrinterFactory (chartType) {

	function chartBuilder (el, kq, meta) {

		const expectsDateObjects = ['LineChart','ColumnChart', 'Table'].indexOf(chartType) > -1;
		const kqData = kq.getTable().humanize(expectsDateObjects ? 'dateObject' : 'human');
		const vizData = google.visualization.arrayToDataTable([kqData.headings].concat(kqData.rows)); // eslint-disable-line new-cap

		const chart = new google.visualization[chartType](el);

		let options = Object.assign({}, defaultChartOptions);

		// if only one vizData set we can try to plot a trend line
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
				return bigNumber(el, this, meta);
			}
		}
	}
}

supportedChartTypes.forEach(chartType => KeenQuery.definePrinter(chartType, googleChartPrinterFactory(chartType)))
