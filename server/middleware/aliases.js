'use strict';

const KeenQuery = require('../../n-keen-query/lib/with-aliases');

module.exports = function (req, res, next) {

	res.locals.aliases = KeenQuery.aliases.get().reduce((alias,item) => {
		alias[item.name] = item;
		return alias;
	}, {});

	next();
}

