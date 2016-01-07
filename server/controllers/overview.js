'use strict';

const KeenQuery = require('n-keen-query');

module.exports = function(req, res) {
	res.render('overview', {
		layout: 'beacon',
		queries: {
			// todo: abstract the getting of aliases more
			dailyUniques: KeenQuery.aliases.get('dailyUniques')[0].query + "->print(line)"
		}
	});
}
