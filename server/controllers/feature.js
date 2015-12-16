'use strict';

const KeenQuery = require('next-keen-query');

module.exports = function (req, res) {
	res.render('feature', {
		layout: 'beacon',
		queries: KeenQuery.aliases.get(req.params.name).filter(q => q.title),
		name: req.params.name,
		keen_project: process.env.KEEN_PROJECT_ID,
		keen_read_key: process.env.KEEN_READ_KEY,
		keen_master_key: process.env.KEEN_MASTER_KEY
	});

};
