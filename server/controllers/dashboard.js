'use strict';

// Render a group of charts in a dashboard
const aliases = require('../middleware/aliases');
const coreChartTypes = ['LineChart','PieChart','BarChart','ColumnChart','AreaChart','SteppedAreaChart','Table'];

function getDashboardTitle (req) {
	let title = req.params[0].replace(/\/$/, '');
	return title.charAt(0).toUpperCase() + title.slice(1);
}

module.exports = function(req, res) {

	const dashboardID = req.params[0].split('/')[0];

	// find dashboardname in res.locals.dashboards
	let dashboard = res.locals.dashboards.filter(d => {
		return d.id === dashboardID;
	})[0];

	if (dashboard.dashboards && dashboard.dashboards.length) {
		const childDashboardID = req.params[0].split('/')[1];
		let childDashboard = dashboard.dashboards.filter(d => {
			return d.id === childDashboardID;
		})[0];
		if (childDashboard)	dashboard = childDashboard;
	}

	dashboard.charts = dashboard.charts || [];
	dashboard.charts = dashboard.charts.map(c => {
		c.name = dashboardID;
		c.name += (dashboard.id !== dashboardID) ? `/${dashboard.id}/${c.id}` : `/${c.id}`;
		if (c.parent) {
			const parentChart = dashboard.charts.filter(p => {
				return p.name === c.parent;
			})[0];
			if (parentChart) {
				c = Object.assign(c, parentChart);
			}
		}
		return c;
	});

	// Append from the spreadsheet of destiny
	aliases.get(req.params[0]).forEach((a) => {
		const result = dashboard.charts.filter(c => {
			return c.name === a.queryname;
		});
		if (!result.length) {
			dashboard.charts.push(a);
		}
	});

	dashboard.charts = dashboard.charts.map(c => {
		if (coreChartTypes.indexOf(c.printer) !== -1) {
			c.class = 'core-chart';
		}
		return c;
	});

	// Todo: Consider better ways to do this
	dashboard.charts.forEach(c => {
		res.locals.aliases[c.name] = c;
	});

	res.render('dashboard', {
		layout: 'beacon',
		title: dashboard.title || getDashboardTitle(req),
		description: dashboard.description || undefined,
		charts: dashboard.charts,
		timeframe: req.query.timeframe || 'this_14_days',
		interval: req.query.interval,
		printer: req.query.printer === 'Table' ? 'Table' : undefined,
		isStandaloneChart: /^\/chart/.test(req.path)
	});
}
