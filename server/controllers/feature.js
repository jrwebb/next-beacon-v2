'use strict';

const KeenQuery = require('n-keen-query');

module.exports = function (req, res) {
	const featureName = req.params[0].replace(/\/$/, '')
	res.render('feature', {
		layout: 'beacon',
		queries: KeenQuery.aliases.get(featureName).filter(q => q.title),
		name: featureName.replace(/[a-z][A-Z][a-z]/g, function($1) {
			return $1.charAt(0) + ' ' + $1.substr(1).toLowerCase();
		})
	});

};
