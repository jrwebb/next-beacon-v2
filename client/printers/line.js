/* global google */

'use strict';

const chartui = require('../components/chartui');

module.exports = function (data) {
	return function (el, alias) {
		console.log('line',el,alias,data);

		const drawChart = () => {
			let dataTable = new google.visualization.DataTable();
			dataTable.addColumn('date', 'Date');
			dataTable.addColumn('number', alias.label);
			data.result.forEach(function (row) {
				dataTable.addRow([new Date(row.timeframe.start), row.value]);
			});

			let options = {
				title: alias.question,
				height: 450,
				trendlines: { 0: {
					color: 'green'
				}},
				curveType:'function',
				chartArea: {
					top: '5%',
					left: '5%',
					width: '95%',
					height: '85%'
				},
				legend: { position: 'bottom' },
				vAxis: {
					viewWindow: { min: 0 }
				}
			};

			let chart = new google.visualization.LineChart(el);
			chart.draw(dataTable, options);

			if (alias.explorerURL) {
				chartui.renderExplorerLink(el, alias);
			}
			chartui.renderChartLink(el, alias);
		}

		if (window.googleChartsLoaded) {
			drawChart();
		} else {
			window.addEventListener('googleChartsLoaded', (e) => {
				// console.log('drawing google chart');
				drawChart();
			}, false);
		}
	}
}
