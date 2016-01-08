/* global Chart */

'use strict';

module.exports = function (keenAPIresponse) {

	let tabulatedData = this.tabulate(keenAPIresponse, 'ISO'); //'human'

	let chartData = {
		labels: [],
		datasets: [
			{
				label: "Total counts of identified users",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: []
			}
		]
	};
	tabulatedData.rows.forEach(function (row) {
		chartData.labels.push(row[0]);
		chartData.datasets[0].data.push(row[1]);
	});

	return function (el){

		console.log('line',el,keenAPIresponse);

		const options = {
			responsive: true,
			maintainAspectRatio: true,
			pointDotRadius : 2,
			legendTemplate : "<ul style=\"list-style-type: none;\" class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\">&nbsp;</span>&nbsp;<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
		};

		const ctx = el.getContext("2d"); // For handling retina
		ctx.canvas.width = el.parentNode.offsetWidth;
		ctx.canvas.height = window.innerHeight - el.parentElement.offsetTop - 200;

		let myLineChart = new Chart(ctx).Line(chartData, options); //eslint-disable-line

		el.insertAdjacentHTML('afterEnd', myLineChart.generateLegend())
	}
}
