'use strict';

// Render a group of charts in a dashboard
const aliases = require('../middleware/aliases');
const coreChartTypes = ['LineChart','PieChart','BarChart','ColumnChart','AreaChart','SteppedAreaChart','Table'];
const yaml = require('js-yaml');
const fs = require('fs');

function getDashboardTitle (req) {
	let title =  req.params[0].replace(/\/$/, '');
	return title.charAt(0).toUpperCase() + title.slice(1);
}

module.exports = function(req, res) {
	let dashboard = {};
	const dashboardname = req.params[0].split('/')[0];
	const file = `${__dirname}/dashboards/${dashboardname}.yml`;

	try {
		dashboard = yaml.load(fs.readFileSync(file, 'utf8'));
	}
	catch (e) {
		console.log(`Dashboard file not found: ${dashboardname}.yml`);
	}

	let dashboardAliases = aliases.get(req.params[0])
		.map(alias => {
			if (coreChartTypes.indexOf(alias.printer) !== -1) {
				alias.class = 'core-chart';
			}
			return alias;
		});

	if (dashboard.aliases && dashboard.aliases.length) {
		dashboardAliases = dashboardAliases.filter((a) => {
			return dashboard.aliases.indexOf(a.queryname) !== -1;
		});
	}

	res.render('dashboard', {
		layout: 'beacon',
		title: dashboard.title || getDashboardTitle(req),
		description: dashboard.description || undefined,
		dashboardAliases: dashboardAliases,
		timeframe: req.query.timeframe || 'this_14_days',
		interval: req.query.interval,
		printer: req.query.printer === 'Table' ? 'Table' : undefined,
		isStandaloneChart: /^\/chart/.test(req.path)
	});
}
