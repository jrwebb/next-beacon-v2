'use strict';

const KeenQuery = require('keen-query');

// exclude staff by default
KeenQuery.forceQuery(function () {
	this.filter('user.isStaff=false');
});

KeenQuery.defineQuery('anon', function () {
	return this.filter('!user.uuid');
});

KeenQuery.defineQuery('subs', function () {
	return this.filter('user.uuid');
});

KeenQuery.defineQuery('myft', function (n) {
	return this.filter(`user.myft.following>${n || 0}`);
});

KeenQuery.buildFromAlias = (alias) => {
	let query = alias.query;
	query += alias.timeframe ? `->relTime(${alias.timeframe})` : '';
	query += alias.interval ? `->interval(${alias.interval})` : '';
	return KeenQuery.build(query);
}

KeenQuery.generateExplorerUrl = (builtQuery) => {
	console.log('KeenQuery.generateExplorerUrl() is deprecated');
	return builtQuery.generateKeenUrl('');
}

module.exports = KeenQuery;
