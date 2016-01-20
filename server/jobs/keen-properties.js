'use strict';

const Poller = require('ft-poller');

module.exports = new Poller({
	url: `https://api.keen.io/3.0/projects/${process.env.KEEN_PROJECT_ID}/events/cta:click?api_key=${process.env.KEEN_READ_KEY}`,
	defaultData: [],
	autostart: true,
	parseData: data => Object.keys(data.properties)
	.filter(name => name.indexOf('.querystring') === -1)
	.sort()
	.map(name => {
		return {
			name,
			lowerCase: name.toLowerCase()
		}
	})
})


