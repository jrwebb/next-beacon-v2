'use strict';
// Render a group of charts in a dashboard
const KeenQuery = require('n-keen-query');
const coreChartTypes = ['LineChart','PieChart','BarChart','ColumnChart','AreaChart','SteppedAreaChart','Table'];

module.exports = function(req, res) {
	let dashboardAliases = KeenQuery.aliases.get(req.params[0])
		.map(alias => {
			if (coreChartTypes.find(e => e === alias.printer) !== undefined) {
				alias.class = 'core-chart';
			}
			return alias;
		});

	res.render('dashboard', {
		layout: 'beacon',
		dashboardAliases: dashboardAliases,
		name: req.params[0].replace(/[a-z][A-Z][a-z]/g, function($1) {
			return $1.charAt(0) + ' ' + $1.substr(1).toLowerCase();
		}).replace(/\/$/, ''),
		timeframe: req.query.timeframe || {}
	});
}
