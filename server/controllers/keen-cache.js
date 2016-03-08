'use strict';

const cache = require('../lib/cache');

// Accepts a keen-io API URL.
// Example: /keen-cache/3.0/projects/{project ID}/queries/count_unique?api_key={API key}
module.exports = (req, res, next) => {
	cache.init();

	let keenURL = req.originalUrl
		.replace(/https:\/\/api\.keen\.io\/3\.0\//i, '')
		.replace(/\/keen-cache\/3\.0\//i,'https://api.keen.io/3.0/');

	let cacheItem = cache.retrieve(keenURL);
	if (cacheItem) {
		// console.log("Cache:hit")
		res.json(cacheItem);
		next();
	}
	else {
		// console.log("Cache:miss")
		fetch(keenURL)
			.then(response => {
				res.status(response.status);
				return response.json();
			})
			.then(json => {
				res.json(json);

				// Only cache if there's a result (that is, there's no error)
				if (json.result !== undefined) {
					let ttl = /interval=minutely/.test(keenURL) ? 60 : 60*60;
					cache.store(keenURL, json, ttl);
				}
				next();
			});
	}
}
