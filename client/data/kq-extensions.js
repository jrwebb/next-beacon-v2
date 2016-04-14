import KeenQuery from 'keen-query';

KeenQuery.setConfig({
	KEEN_PROJECT_ID: window.KEEN_PROJECT_ID,
	KEEN_READ_KEY: window.KEEN_READ_KEY,
	KEEN_HOST: 'https://keen-proxy.ft.com/3.0',
	fetchHandler: res => {
		if (res.type === 'opaqueredirect') {
			location.reload();
			throw new Error('Single sign on expiry - reloading page');
		}
		return res.json();
	}
})

// define some shortcut queries
KeenQuery.defineQuery('anon', function () {
	return this.filter('!user.uuid');
});

KeenQuery.defineQuery('subs', function () {
	return this.filter('user.uuid');
});

KeenQuery.defineQuery('screenSize', function () {
	return this.group('device.oGridLayout').reorder('device.oGridLayout', 'default', 'XS', 'S', 'M', 'L', 'XL').setPrinter('ColumnChart');
});

