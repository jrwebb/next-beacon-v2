/* global google */

'use strict';

const chartui = require('../components/chartui');
const colors = require('../colors');

module.exports = function () {
	const data = this.getTable().humanize('shortest');
	return (el, alias) => {
		const drawChart = () => {
			let dataTable = new google.visualization.DataTable();
			dataTable.addColumn('string', data.headings[0]);
			dataTable.addColumn('number', data.headings[1]);

			data.rows.forEach(row => {
				dataTable.addRow(row);
			});

			// TODO: Abstract global options at some point
			let options = {
				title: alias.label,
				is3D: true,
				height: 450,
				chartArea: {
					top: '5%',
					left: '5%',
					width: '95%',
					height: '85%'
				},
				legend: { position: 'bottom' },
				pieSliceTextStyle: {
					color: 'black'
				},
				colors: colors.getColors()
			};

			let chart = new google.visualization.PieChart(el);
			chart.draw(dataTable, options);
			chartui.renderChartUI(el, alias);
		}

		// Todo: Improve performance
		google.charts.setOnLoadCallback(drawChart);
		google.charts.load('current', {packages: ['corechart']});
	}
}
