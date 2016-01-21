'use strict';

const Poller = require('ft-poller');

module.exports = new Poller({
	url: `https://api.keen.io/3.0/projects/${process.env.KEEN_PROJECT_ID}?api_key=${process.env.KEEN_MASTER_KEY}`,
	defaultData: [],
	autostart: true,
	parseData: data => {
		const map = data.events.reduce((obj, e) => {
			const parts = e.name.split(':');
			obj[parts[0]] = obj[parts[0]] || {};
			obj[parts[0]][parts[1]] = parts[1];
			return obj;
		}, {});
		return map;
	}
})
