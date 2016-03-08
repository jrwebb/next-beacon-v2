'use strict';
const NodeCache = require('node-cache');

// Units are in seconds
const OPTIONS = {
	stdTTL: 30,
	checkperiod: 60
};

let cacheInstance;

function init() {
	if (!cacheInstance) {
		cacheInstance = new NodeCache(OPTIONS);
	}
}

function store(key, value) {
	return new Promise(function(resolve, reject) {
		cacheInstance.set(key, value, function(err) {
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
