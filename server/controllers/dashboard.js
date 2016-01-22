'use strict';

// Render a group of charts in a dashboard

module.exports = function(req, res) {
	const dashboardName = req.params[0].replace(/\/$/, '')
	let dashboardAliases = {}
	Object.keys(res.locals.aliases).forEach(a => {
		if (new RegExp(dashboardName, 'gi').test(a)) {
			dashboardAliases[a] = res.locals.aliases[a];
		}
	});
	res.render('dashboard', {
		layout: 'beacon',
		dashboardAliases: dashboardAliases
	});
}
