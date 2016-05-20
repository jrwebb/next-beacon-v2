'use strict';

const keenCollections = require('../../jobs/keen-collections');
const keenProperties = require('../../jobs/keen-properties');

module.exports = (req, res) => {
	const activeEventCollection = req.params.event_collection || 'feedback:submit';
	let collections = keenCollections.getData();

	/* eslint-disable no-loop-func */
	for (var collection in collections) {
		if (Array.isArray(collections[collection])) {
			collections[collection] = collections[collection].reduce((result, row) => {
				let eventCollection = `${row.category}:${row.action}`;
				row.class = (eventCollection === activeEventCollection) ? "active" : "";
				return result.concat(row);
			}, []);
		}
	}
	/* eslint-enable no-loop-func */

	// E.g. /data/extract/site:optin/user.uuid,user.rfv.score,user.isStaff,user.geo.continent,time.timestamp
	const selectedEventProperties = (req.params.event_properties && req.params.event_properties.split(',')) || [];
	let properties = keenProperties.get(activeEventCollection);
	properties = properties.reduce((result, row) => {
		row.selected = (selectedEventProperties.indexOf(row.name) > -1) ? "checked" : "";
		return result.concat(row);
	}, []);

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
