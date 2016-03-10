import KeenQuery from 'keen-query';


KeenQuery.setFetchOptions({credentials: 'include'});

// exclude staff by default
KeenQuery.forceQuery(function () {
	return this.filter('user.isStaff=false');
});

// define some shortcut queries
KeenQuery.defineQuery('anon', function () {
	return this.filter('!user.uuid');
});

KeenQuery.defineQuery('subs', function () {
	return this.filter('user.uuid');
});

