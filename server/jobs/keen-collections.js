'use strict';

const Poller = require('ft-poller');

module.exports = new Poller({
	url: `https://api.keen.io/3.0/projects/${process.env.KEEN_PROJECT_ID}?api_key=${process.env.KEEN_MASTER_KEY}`,
	defaultData: [],
	autostart: true,
	parseData: data => data.events.map(e => e.name)
})
