'use strict';

const keenCollections = require('../../jobs/keen-collections');
const keenProperties = require('../../jobs/keen-properties');

module.exports = (req, res, next) => {
	const activeEventCollection = req.params.event_collection || 'feedback:submit';
	let collections = keenCollections.getData();

	for (var collection in collections) {
		if (Array.isArray(collections[collection])) {
			collections[collection] = collections[collection].reduce((result, row) => {
				let eventCollection = `${row.category}:${row.action}`;
				row.class = (eventCollection === activeEventCollection) ? "active" : "";
				return result.concat(row);
			}, []);
		}
	}

	let properties = keenProperties.get(activeEventCollection);
	console.log(properties)

	// Todo: Handle CSV requests
	res.render('extract', {
		layout: 'beacon',
		title: 'Extract',
		isExtraction: true,
		activeEventCollection: activeEventCollection,
		collections: collections,
		properties: properties
	});
};
