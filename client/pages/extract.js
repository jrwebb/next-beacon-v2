// Client-side UI

'use strict';

import querystring from 'querystring';
import keenIO from 'keen.io';
import flat from 'flat';

window.outputUpdate = function(value) {
	document.querySelector('.extract__numberOfEvents').value = value;

	// if (true) {
	// 	document.querySelector('.extract__submit').innerHTML = "⬅ Select some properties plz";
	// 	return;
	// }

	if (value < 1000) {
		document.querySelector('.extract__submit').innerHTML = "Punch it Chewie"
	} else if (value < 5000) {
		document.querySelector('.extract__submit').innerHTML = "This'll take a while"
	} else if (value < 10000) {
		document.querySelector('.extract__submit').innerHTML = "Might as well go put the kettle on"
	} else {
		document.querySelector('.extract__submit').innerHTML = "It should be done by Christmas"
	}
}

// Todo: On click of event property elements,
// (a) update the location

function updateUI() {
	let parameters = querystring.parse(location.search.substr(1));
	console.log("updating UI. parameters: ",parameters);

	// Focus on the approprate event collection
	let event_collection = parameters.event_collection || 'page:view';

	// Load the property names for the event_collection
	// fetch(`/data/keen-properties/${event_collection}`)
	// 	.then(response => {
	// 		if (!response.ok) {
	// 			throw "Can't load properties for the event collection.";
	// 		}
	// 		return response.json()
	// 	})
	// 	.then(properties => {
	// 		// properties = properties.sort();
	// 		properties.forEach(p => {
	// 			// Add event_collection properties to the DOM here.
	// 			console.log(p.name);
	// 		});


	// 		if (parameters.property_names) {
	// 			// Select all appropriate property_names
	// 		}
	// 	});
}

function buildExtractionQuery(parameters){
	console.log("building extraction query. parameters: ",parameters)

	let event_collection;
	if (!event_collection) {
		return;
	}
	let timeframe = timeframe || 'this_2_days';
	let limit = limit || 100;

	const query = new keenIO.Query('extraction', {
		timeframe: timeframe,
		event_collection: event_collection,
		latest: limit
	});

	runExtractionQuery(query);
}

function runExtractionQuery(query){
	console.log("running extraction.")
	const keen = keenIO.configure({
		projectId: process.env['KEEN_PROJECT_ID'],
		readKey: process.env['KEEN_READ_KEY']
	});
	keen.run(query, function(err, response) {
		if (err) {
			res.json(err);
			return;
		}
		const flattened = response.result.map(function(event) {
			return flat(event);
		});

		console.log(flattened);
	// 		res.json(flattened);
	});
}

module.exports = {
	init: updateUI
}



// import csv from 'csv';
// import csvUtils from '../../lib/csv-utils';

	// 	if (req.query.format === 'csv') {

	// 		const cols = csvUtils.columns(flattened);
	// 		flattened.unshift(cols);

	// 		// The columns as a heading
	// 		const heading = '# ' + Object.keys(cols).join(',');

	// 		// Output data
	// 		csv.stringify(flattened, function(err, data) {

	// 			if (err) {
	// 				res.status(503).body(err);
	// 				return;
	// 			}

	// 			res.set('Content-Type: text/plain');
	// 			res.send(heading + "\n" + data);
	// 		});

	// 	} else {
	// 		res.json(flattened);
	// 	}
	// });
