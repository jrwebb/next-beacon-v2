'use strict';

// Render a group of charts in a dashboard
const aliases = require('../middleware/aliases');

function getDashboardTitle (req) {
	let title = req.params[0].replace(/\/$/, '');
	return title.charAt(0).toUpperCase() + title.slice(1);
}

module.exports = function(req, res) {

	const dashboardname = req.params[0].split('/')[0];

	// find dashboardname in res.locals.dashboards
	let dashboard = res.locals.dashboards.filter(d => {
		return d.id === dashboardname;
	})[0] || {};

	// Append from the spreadsheet of destiny
	dashboard.charts = dashboard.charts || [];
	aliases.get(req.params[0]).forEach((a) => {
		const result = dashboard.charts.filter(p => {
			return p.queryname === a.queryname;
		});
		if (!result.length) {
			dashboard.charts.push(a);
		}
	});

	// Todo: Consider better ways to do this
	dashboard.charts.forEach(p => {
		res.locals.aliases[p.name] = p;
	});

	if (req.view && req.view === 'presentation') {
		res.render('presentation', {
			layout: null,
			title: dashboard.title || getDashboardTitle(req),
			description: dashboard.description || undefined,
			charts: dashboard.charts
		});
	}
	else {
		res.render('dashboard', {
			layout: req.layout || 'beacon',
			title: dashboard.title || getDashboardTitle(req),
			description: dashboard.description || undefined,
			charts: dashboard.charts,
			timeframe: req.query.timeframe || 'this_14_days',
			interval: req.query.interval,
			printer: req.query.printer === 'Table' ? 'Table' : undefined,
			isStandaloneChart: /^\/chart/.test(req.path)
		});
	}
}
