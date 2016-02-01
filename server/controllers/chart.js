'use strict';

// Render a standalone chart

const coreChartTypes = ['LineChart','PieChart','BarChart','ColumnChart','AreaChart','SteppedAreaChart','Table'];

module.exports = function(req, res) {
	let alias = res.locals.aliases[req.params[0]];
	if (coreChartTypes.find(e => e === alias.printer) !== undefined) {
		alias.class = 'core-chart';
	}
	res.render('chart', {
		layout: 'beacon',
		alias: alias
	});
}
