'use strict';

const KeenQuery = require('n-keen-query');

module.exports = function(req, res) {
	res.render('overview', {
		layout: 'beacon',
		queries: {
			uniques: KeenQuery.aliases.get('uniques')[0].query + "->print(html)"
		}
	});
}
