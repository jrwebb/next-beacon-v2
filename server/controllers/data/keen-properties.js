'use strict';

const keenProperties = require('../../jobs/keen-properties');

// Accepts a keen-io API URL.
// Example: /data/keen-cache/3.0/projects/{project ID}/queries/count_unique?api_key={API key}
module.exports = (req, res, next) => {
	if (!req.params.eventName) {
		return next(new Error('eventNaem must be provided to /data/keen-properties url'));
	}

	if (req.params.propertyName) {
		// TODO
	} else {
		res.json(keenProperties.get(req.params.eventName))
	}
}
