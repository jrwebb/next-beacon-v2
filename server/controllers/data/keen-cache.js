'use strict';

// Accepts a keen-io API URL.
// Example: /data/keen-cache/3.0/projects/{project ID}/queries/count_unique?api_key={API key}
module.exports = (req, res, next) => {

	const keenURL = req.originalUrl
		.replace(/https:\/\/api\.keen\.io\/3\.0\//i, '') // <- for debugging
		.replace(/\/data\/keen-cache\/3\.0\//i,'https://api.keen.io/3.0/');

	const ttl = /interval=minutely/.test(keenURL) ? 60 : 60 * 60;

	fetch(keenURL)
		.then(response => {
			if (!response.ok) {
				throw 'Bad response from keen';
			}
			return response.json();
		})
		.then(json => {
			res.json(json);
		})
		.catch(next);
}
