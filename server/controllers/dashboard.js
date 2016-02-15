'use strict';

// Render a group of charts in a dashboard
const aliases = require('../middleware/aliases');
const coreChartTypes = ['LineChart','PieChart','BarChart','ColumnChart','AreaChart','SteppedAreaChart','Table'];

function getDashboardTitle (req) {
	let title =  req.params[0].replace(/\/$/, '');
	return title.charAt(0).toUpperCase() + title.slice(1);
}

module.exports = function(req, res) {
	let dashboard = {};
	const dashboardname = req.params[0].split('/')[0];

	// Append from the spreadsheet of destiny
	dashboard.postulates = dashboard.postulates || [];

	aliases.get(req.params[0]).forEach((a) => {
		var result = dashboard.postulates.filter(function( obj ) {
			return obj.queryname === a.queryname;
		});

		if (!result.length) {
			dashboard.postulates.push(a);
		}
	});

	dashboard.postulates = dashboard.postulates
		.map(postulate => {
			if (coreChartTypes.indexOf(postulate.printer) !== -1) {
				postulate.class = 'core-chart';
			}
			return postulate;
		});

// console.log(dashboard)

	res.render('dashboard', {
		layout: 'beacon',
		title: dashboard.title || getDashboardTitle(req),
		description: dashboard.description || undefined,
		postulates: dashboard.postulates,
		timeframe: req.query.timeframe || 'this_14_days',
		interval: req.query.interval,
		printer: req.query.printer === 'Table' ? 'Table' : undefined,
		isStandaloneChart: /^\/chart/.test(req.path)
	});
}
