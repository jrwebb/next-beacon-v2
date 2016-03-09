'use strict';

const cache = require('../../lib/cache');
cache.init();

// Accepts a keen-io API URL.
// Example: /data/keen-cache/3.0/projects/{project ID}/queries/count_unique?api_key={API key}
module.exports = (req, res, next) => {

	const keenURL = req.originalUrl
		.replace(/https:\/\/api\.keen\.io\/3\.0\//i, '') // <- for debugging
		.replace(/\/data\/keen-cache\/3\.0\//i,'https://api.keen.io/3.0/');

	const cacheItem = cache.retrieve(keenURL);
	const ttl = /interval=minutely/.test(keenURL) ? 60 : 60 * 60;

	if (cacheItem) {
		// console.log("Cache:hit")
		res.set('Cache-Control', `max-age=${ttl}`);
		res.json(cacheItem);
	} else {
		// console.log("Cache:miss")
		fetch(keenURL)
			.then(response => {
				if (!response.ok) {
					throw 'Bad response from keen';
				}
				return response.json();
			})
			.then(json => {

				// Only cache if there's a result (that is, there's no error)
				if (json.result !== undefined) {
					res.set('Cache-Control', `max-age=${ttl}`);
					cache.store(keenURL, json, ttl);
				}
				res.json(json);

			})
			.catch(next);
	}
}
