'use strict';

const fetchKeenCollections = () => {
	return new Promise((resolve, reject) => {
		fetch(`https://keen-proxy.ft.com/3.0/projects/${process.env.KEEN_PROJECT_ID}/events?api_key=${process.env.KEEN_MASTER}`)
			.then(response => {
				if (response.status >= 400) {
					reject(Error("Bad response from server"));
				}
				return response.json();
			})
			.then(response => {
				resolve(response);
			});
	});
}

const getCollections = (req, response) => {
	let collections = response || [];

	// Move the active event collection to the top of the list
	let activeEventCollection = req.params.event_collection || collections[0].name;
	req.activeEventCollection = activeEventCollection;

	let activeCollectionIndex = collections.findIndex(row => {
		return row.name === activeEventCollection;
	});
	let activeCollection = collections.splice(activeCollectionIndex, 1);
	activeCollection[0].class = 'active';
	collections.unshift(activeCollection[0]);
	return collections;
}

// E.g. /data/extract/site:optin/user.uuid,user.rfv.score,user.isStaff,user.geo.continent,time.timestamp
const getProperties = (req, collection) => {
	const selectedEventProperties = (req.params.event_properties && req.params.event_properties.split(',')) || [];
	let properties = Object.keys(collection.properties).sort();
	properties = properties.reduce((result, property) => {
		property = {
			name: property,
			checked: (selectedEventProperties.indexOf(property) > -1) ? "checked" : ""
		};
		return result.concat(property);
	}, []);
	return properties;
}

module.exports = (req, res) => {
	fetchKeenCollections().then(response => {
		const collections = getCollections(req, response);
		const properties = getProperties(req, collections[0]);

		// Todo: Handle CSV requests
		res.render('extract', {
			layout: 'beacon',
			title: 'Extract',
			isExtraction: true,
			activeEventCollection: req.activeEventCollection,
			collections: collections,
			properties: properties
		});
	}).catch(err => {
		next(err);
	});
};
