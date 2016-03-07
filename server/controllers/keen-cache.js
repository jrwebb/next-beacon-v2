'use strict';

// Accepts a keen-io API URL.
// Todo: Cache cleverly.

module.exports = (req, res, next) => {
	const keenURL = req.params.url;
	if (!/^https:\/\/api\.keen\.io/.test(keenURL)) {
		res.sendStatus(500).send('Error. Incompatible URL.')
	}
	else {
		fetch(keenURL)
			.then(response => {
				if (response.status >= 400) {
					throw new Error("Bad response from server");
				}
				return response.json();
			})
			.then(json => {
				res.json(json);
				next();
			});
	}
}
