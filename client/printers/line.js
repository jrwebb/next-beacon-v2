/* global Chart */

'use strict';

const colors = require('../colors');

module.exports = function (data) {
	let tabulatedData = this.tabulate(data, 'ddd DD MMM YYYY'); // Using moment.js

	return function (el, alias) {
		console.log('line',el,alias);

		let color01 = colors.getColor('chartjs-1');
		let chartData = {
			labels: [],
			datasets: [
				{
					label: alias.label,
					fillColor: `rgba(${color01},0.1)`,
					strokeColor: `rgba(${color01},1)`,
					pointColor: `rgba(${color01},1)`,
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: `rgba(${color01},1)`,
					data: []
				}
			]
		};

		tabulatedData.rows.forEach(function (row) {
			chartData.labels.push(row[0]);
			chartData.datasets[0].data.push(row[1]);
		});

		let c = document.createElement('canvas');
		el.appendChild(c);

		const ctx = c.getContext("2d"); // For handling retina
		ctx.canvas.width = el.parentNode.offsetWidth;
		ctx.canvas.height = window.innerHeight - el.parentElement.offsetTop - 200;

		let myLineChart = new Chart(ctx).Line(chartData, Chart.defaults.global); //eslint-disable-line

		el.insertAdjacentHTML('afterEnd', myLineChart.generateLegend());
	}
}
