import KeenQuery from 'keen-query';


KeenQuery.setFetchOptions({
	// credentials: 'include',
	// redirect: 'manual'
});

KeenQuery.setFetchHandler(res => {
	if (res.type === 'opaqueredirect') {
		location.reload();
		throw new Error('Single sign on expiry - reloading page');
	}
	return res.json();
});

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

