'use strict';

// Render a group of charts in a dashboard
const aliases = require('../middleware/aliases');

function getDashboardTitle (req) {
	let title = req.params[0].replace(/\/$/, '');
	return title.charAt(0).toUpperCase() + title.slice(1);
}

module.exports = function(req, res) {
	const dashboardpath = req.params[0];
	const dashboardname = dashboardpath.split('/')[0];

	// find dashboardname in res.locals.dashboards
	let dashboard = res.locals.dashboards.filter(d => {
		return d.id === dashboardname;
	})[0] || {};

	let charts = dashboard.charts || [];

	// Only show a single chart if appropriate
	if (req.view && req.view === 'chart') {
		charts = charts.filter(c => {
			return c.name === dashboardpath;
		}) || [];
	}
	else {

		// Append charts from the spreadsheet of destiny
		aliases.get(req.params[0]).forEach((a) => {
			const result = charts.filter(p => {
				return p.queryname === a.queryname;
			});
			if (!result.length) {
				charts.push(a);
			}
		});

		// Only include charts whose names include the dashboard path
		charts = charts.reduce((charts, c) => {
			if (c.name.indexOf(dashboardpath) !== -1) charts.push(c);
			return charts;
		},[]);
	}

	// Todo: Consider better ways to do this
	charts.forEach(p => {
		res.locals.aliases[p.name] = p;
	});

	if (req.view && req.view === 'presentation') {
		res.render('presentation', {
			layout: null,
			title: dashboard.title || getDashboardTitle(req),
			description: dashboard.description || undefined,
			charts: charts
		});
	}
	else {
		res.render('dashboard', {
			layout: req.layout || 'beacon',
			title: dashboard.title || getDashboardTitle(req),
			description: dashboard.description || undefined,
			charts: charts,
			timeframe: req.query.timeframe || 'this_14_days',
			interval: req.query.interval,
			printer: req.query.printer === 'Table' ? 'Table' : undefined,
			isStandaloneChart: /^\/chart/.test(req.path)
		});
	}
}
