'use strict';

const keenIO		= require('keen.io');
const flat		= require('flat');
const csv			= require('csv');
const csvUtils	= require('../../lib/csv-utils');

const keen = keenIO.configure({
	projectId: process.env['KEEN_PROJECT_ID'],
	readKey: process.env['KEEN_READ_KEY']
});

// The latest 100 events we've logged
module.exports = function(req, res) {
	const latest = new keenIO.Query('extraction', {
		timeframe: req.query.timeframe || 'this_2_days',
		event_collection: req.query.event_collection || 'dwell',
		latest: req.params.limit || 100
	});

	keen.run(latest, function(err, response) {

		if (err) {
			res.json(err);
			return;
		}

		const flattened = response.result.map(function(event) {
			return flat(event);
		});

		if (req.query.format === 'csv') {

			const cols = csvUtils.columns(flattened);
			flattened.unshift(cols);

			// The columns as a heading
			const heading = '# ' + Object.keys(cols).join(',');

			// Output data
			csv.stringify(flattened, function(err, data) {

				if (err) {
					res.status(503).body(err);
					return;
				}

				res.set('Content-Type: text/plain');
				res.send(heading + "\n" + data);
			});

		} else {
			res.json(flattened);
		}
	});
};
