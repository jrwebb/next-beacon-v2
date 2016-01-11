/* global Chart */

'use strict';

const colors = require('../colors');

module.exports = function (aliasData) {
	let color01 = colors.getColor();
	let chartData = {
		labels: [],
		datasets: [
			{
				label: "Total counts of identified users",
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

	let tabulatedData = this.tabulate(aliasData, 'ISO'); //'human'
	tabulatedData.rows.forEach(function (row) {
		chartData.labels.push(row[0]);
		chartData.datasets[0].data.push(row[1]);
	});

	return function (el){
		console.log('line',el,aliasData);

		let c = document.createElement('canvas');
		el.appendChild(c);

		const ctx = c.getContext("2d"); // For handling retina
		ctx.canvas.width = el.parentNode.offsetWidth;
		ctx.canvas.height = window.innerHeight - el.parentElement.offsetTop - 200;

		let myLineChart = new Chart(ctx).Line(chartData, Chart.defaults.global); //eslint-disable-line

		el.insertAdjacentHTML('afterEnd', myLineChart.generateLegend());
	}
}
