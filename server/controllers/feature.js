'use strict';

const KeenQuery = require('next-keen-query');

module.exports = function (req, res) {
	const featureName = req.params[0].replace(/\/$/, '')
	res.render('feature', {
		layout: 'beacon',
		queries: KeenQuery.aliases.get(featureName).filter(q => q.title),
		name: featureName.replace(/[a-z][A-Z][a-z]/g, function($1) {
			return $1.charAt(0) + ' ' + $1.substr(1).toLowerCase();
		}),
		KEEN_PROJECT_ID: process.env.KEEN_PROJECT_ID,
		KEEN_READ_KEY: process.env.KEEN_READ_KEY,
		KEEN_MASTER_KEY: process.env.KEEN_MASTER_KEY
	});

};
