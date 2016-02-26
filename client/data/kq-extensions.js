import KeenQuery from 'keen-query';

// exclude staff by default
KeenQuery.forceQuery(function () {
	const instance = this.filter('user.isStaff=false');
});

// define some shortcut queries
KeenQuery.defineQuery('anon', function () {
	return this.filter('!user.uuid');
});

KeenQuery.defineQuery('subs', function () {
	return this.filter('user.uuid');
});

