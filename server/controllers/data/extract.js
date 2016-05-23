'use strict';

const keenCollections = require('../../jobs/keen-collections');
const keenProperties = require('../../jobs/keen-properties');

module.exports = (req, res) => {
	let collections = keenCollections.getData();

	// Flatten the collections and sort alphabetically
	/* eslint-disable no-loop-func */
	let flattenedCollections = [];
	for (var collection in collections) {
		if (Array.isArray(collections[collection])) {
			collections[collection].map(row => {
				flattenedCollections.push(`${row.category}:${row.action}`);
			});
		}
	}
	collections = flattenedCollections
		.sort()
		.reduce((result, row) => {
			return result.concat({
				name:row
			})
		},[]);
	/* eslint-enable no-loop-func */

	// Move the active event collection to the top of the list
	let activeEventCollection = req.params.event_collection || collections[0].name;
	let activeCollectionIndex = collections.findIndex(row => {
		return row.name === activeEventCollection;
	});
	collections.splice(activeCollectionIndex, 1);
	collections.unshift({
		name: activeEventCollection,
		class: 'active'
	});

	// E.g. /data/extract/site:optin/user.uuid,user.rfv.score,user.isStaff,user.geo.continent,time.timestamp
	const selectedEventProperties = (req.params.event_properties && req.params.event_properties.split(',')) || [];
	let properties = keenProperties.get(activeEventCollection);

	// Make sure properties are sorted alphabetically
	properties.sort(function(a, b) {
		if (a.lowerCase < b.lowerCase) {
			return -1;
		}
		if (a.lowerCase > b.lowerCase) {
			return 1;
		}
		return 0;
	});
	properties = properties.reduce((result, row) => {
		row.checked = (selectedEventProperties.indexOf(row.name) > -1) ? "checked" : "";
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
