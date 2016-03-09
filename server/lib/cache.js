'use strict';
const NodeCache = require('node-cache');

// Units are in seconds.
// Default to hourly cache as queries are rarely in minute intervals.
const OPTIONS = {
	stdTTL: 60*60,
	checkperiod: 60*60*3
};

let cacheInstance;

function init() {
	if (!cacheInstance) {
		cacheInstance = new NodeCache(OPTIONS);
	}
}

function store(key, value, ttl) {
	return new Promise(function(resolve, reject) {
		cacheInstance.set(key, value, ttl, function(err) {
			if (err) {
				return reject(err);
			}

			resolve();
		})
	});
}

function retrieve(key) {
	return cacheInstance.get(key);
}

module.exports = {
	init: init,
	store: store,
	retrieve: retrieve
};
