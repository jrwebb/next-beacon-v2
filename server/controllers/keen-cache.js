'use strict';

const cache = require('../lib/cache');

// Accepts a keen-io API URL.
// Example: /keen-cache/3.0/projects/{project ID}/queries/count_unique?api_key={API key}
module.exports = (req, res, next) => {
	cache.init();

	let keenURL = req.originalUrl
		.replace(/https:\/\/api\.keen\.io\//i, '')
		.replace(/\/keen-cache\//i,'https://api.keen.io/');

	let cacheItem = cache.retrieve(keenURL);
	if (cacheItem) {
		console.log("hit")
		res.json(cacheItem);
		next();
	}
	else {
		console.log("miss")
		fetch(keenURL)
			.then(response => {
				if (response.status >= 400) {
					res.sendStatus(500).send('Error. Bad response from keen.');
				}
				return response.json();
			})
			.then(json => {
				cache.store(keenURL, json);
				res.json(json);
				next();
			});
	}
}
