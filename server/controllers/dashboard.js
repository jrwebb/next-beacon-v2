'use strict';

// Render a group of charts in a dashboard
const aliases = require('../middleware/aliases');

function getDashboardTitle (req) {
	let title = req.params[0].replace(/\/$/, '');
	return title.charAt(0).toUpperCase() + title.slice(1);
}

module.exports = function(req, res) {
	const dashboardPath = req.params[0];
	const dashboardName = dashboardPath.split('/')[0];

	// find dashboardName in res.locals.dashboards
	let dashboard = res.locals.dashboards.filter(d => {
		return d.id === dashboardName;
	})[0] || {};

	let charts = dashboard.charts || [];



	// Only show a single chart if appropriate
	if (req.view && req.view === 'chart') {
		if (req.query.query) {
			const query = decodeURIComponent(req.query.query);
			charts = [{
				question: query,
				name: 'custom-query',
				query: query,
				hasConfigurableTimeframe: false,
				hasConfigurableInterval: false
			}]
		} else {
			charts = charts.filter(c => {
				return c.name === dashboardPath;
			}) || [];
		}
	} else {

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
			if (c.name.indexOf(dashboardPath) !== -1) charts.push(c);
			return charts;
		},[]);
	}

	if (req.view && req.view === 'presentation') {
		res.render('presentation', {
			layout: 'beacon',
			title: dashboard.title || getDashboardTitle(req),
			description: dashboard.description || undefined,
			charts: charts,
			isPresentation: true
		});
	} else {
		res.render('dashboard', {
			layout: 'beacon',
			title: dashboard.title || getDashboardTitle(req),
			description: dashboard.description || undefined,
			charts: charts,
			timeframe: req.query.timeframe || 'this_14_days',
			pagetype: req.query.pagetype || '',
			interval: req.query.interval,
			printer: req.query.printer === 'Table' ? 'Table' : undefined,
			isStandaloneChart: /^\/chart/.test(req.path)
		});
	}
}
