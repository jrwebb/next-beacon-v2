'use strict';
// Render a group of charts in a dashboard
const KeenQuery = require('n-keen-query');

module.exports = function(req, res) {
	res.render('dashboard', {
		layout: 'beacon',
		dashboardAliases: KeenQuery.aliases.get(req.params[0]),
		name: req.params[0].replace(/[a-z][A-Z][a-z]/g, function($1) {
			return $1.charAt(0) + ' ' + $1.substr(1).toLowerCase();
		}).replace(/\/$/, ''),
		timeframe: req.query.timeframe || {}
	});
}
