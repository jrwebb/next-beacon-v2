'use strict';

const aliases = require('./aliases');

module.exports = (req, res, next) => {

	res.locals.dashboards = aliases.get().reduce((dashboard,item) => {
		dashboard[item.dashboardfeature] = item;
		return dashboard;
	}, {});

	next();
};
