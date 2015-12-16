'use strict';

const KeenQuery = require('next-keen-query');

module.exports = function (req, res) {
	res.render('feature', {
		layout: 'beacon',
		queries: KeenQuery.aliases.get(req.params.name).filter(q => q.title),
		name: req.params.name,
		KEEN_PROJECT_ID: process.env.KEEN_PROJECT_ID,
		KEEN_READ_KEY: process.env.KEEN_READ_KEY,
		KEEN_MASTER_KEY: process.env.KEEN_MASTER_KEY
	});

};
