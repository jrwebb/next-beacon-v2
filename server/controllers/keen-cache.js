'use strict';

// Accepts a keen-io API URL.
// Example: /keen-cache/3.0/projects/{project ID}/queries/count_unique?api_key={API key}

module.exports = (req, res, next) => {
	let keenURL = req.originalUrl
		.replace(/https:\/\/api\.keen\.io\//i, '')
		.replace(/\/keen-cache\//i,'https://api.keen.io/');

	fetch(keenURL)
		.then(response => {
			if (response.status >= 400) {
				res.sendStatus(500).send('Error. Bad response from keen.');
			}
			return response.json();
		})
		.then(json => {
			res.json(json);
			next();
		});
}
