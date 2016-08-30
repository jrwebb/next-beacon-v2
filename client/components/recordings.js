import keenIO from 'keen.io';
import KeenQuery from 'keen-query';
import {retrieveKq} from '../data/kq-cache';

function formatDate (timestamp) {
	return timestamp.getUTCFullYear() +'-'+ (timestamp.getUTCMonth() + 1) +'-'+ timestamp.getUTCDate();
}

let randomMessageGenerator;

function boredYet (messagesEl) {

	if (!messagesEl) {
		return;
	}

	messagesEl.classList.remove('hidden');

	const messages = [
		'We are processing loads of events to match your query 🐝',
		'Crunching data...',
		'KeenIO is working on your query 🐌...',
		'Working on it...',
		'That is one complex query! Almost there...'
	]
	randomMessageGenerator = setInterval(function () {
		const idx = Math.round(Math.random() * (messages.length - 1));
		const message = messages[idx];
		messagesEl.innerHTML = message;
	}, 20000);
}

function clearMessages (messagesEl) {
	clearInterval(randomMessageGenerator);
	if (!messagesEl) {
		return;
	}
	messagesEl.innerHTML = '';
	messagesEl.classList.add('hidden');
}

function startLoading (el) {
	el.classList.add('chart--loading');
}

function doneLoading (el) {
	el.classList.remove('chart--loading');
}

function predictSluggishness (period, latest, messagesEl) {

	if (!messagesEl) {
		return;
	}

	let message;

	if (latest <= 200 || period <= 2) {
		message = 'This query will take a few seconds to complete ⏱';
	}
	else if (period > 14 || latest > 1000) {
		message = 'This query will be very slow 🐌 Please consider adjusting your timeframe and range';
	}
	else if (period <= 14 & latest <= 1000) {
		message = 'This query will take a few minutes to complete ⌛ (Try a smaller timeframe for faster results)';
	}

	messagesEl.innerHTML = message;
}

export function getRecordings ({el, queryStr, eventLimit, messagesEl, userTimeframe, configuration, chartName}={}) {

	const start = (new Date()).getTime();

	el.innerHtml = '';
	startLoading(el);

	const latest = eventLimit || 1;

	let kq;

	if (configuration && chartName) {
		kq = configuration(retrieveKq(chartName));
	}
	else {
		kq = KeenQuery.build(queryStr);
	}

	// TODO handle multiple queries
	if (kq.query && kq.query.length) {
		return new Promise((resolve, reject) => {
			reject('Sorry! Cannot fetch recordings for complex queries just yet (i.e. @concat, @pct)')
		})
	}

	const query = new keenIO.Query('extraction', {
		timeframe: kq.timeframe,
		event_collection: kq.query.event_collection,
		target_property: kq.query.target_property,
		filters: kq.filters,
		latest: latest,
		property_names: ['device.spoorId']
	});

	let period;

	try {
		const timeframe = userTimeframe || kq.timeframe || 'this_7_days';
		period = parseInt(timeframe.match(/\d+/)[0]);
	}
	catch (e) {
		// TODO hadle nicely
		throw e;
	}

	predictSluggishness(period, latest, messagesEl);

	const keen = keenIO.configure({
		projectId: window.KEEN_PROJECT_ID,
		readKey: window.KEEN_READ_KEY
	});

	return new Promise((resolve, reject) => {
		try {
			console.log('run query');
			console.log(query);
			boredYet(messagesEl);
			keen.run(query, function (err, response){
				clearMessages(messagesEl);
				if (err) {
					console.log('error from keen');
					reject(err);
				}
				resolve(response.result)
			});
		} catch (error) {
			console.log('error running query');
			reject(error);
			clearMessages(messagesEl);
		}
	})
	.then((result) => {
		console.log('Keen extraction took', ((new Date()).getTime() - start)/1000 + 's');

		const spoorIds = result.map(function (item) {
			return item.device.spoorId;
		});

		const now = new Date();
		const today = formatDate(now);
		const day = 1000 * 60 * 60 * 24;
		const tomorrowTime = new Date(now + day);
		const tomorrow = formatDate(tomorrowTime);

		// FROM THE MOUSEFLOW DOCS
		// fromdate: The start date of the query. The actual start time is midnight on the selected date, according to the user’s selected time zone.
		const fromtime = new Date(now - period * day - day);
		const fromdate = formatDate(fromtime);

		let entry;

		for (const filter of kq.filters) {
			if (filter.property_name.toLowerCase().indexOf('normalizedpath') !== -1) { //TODO other paths
				entry = filter.property_value;
			}
		}
		console.log(spoorIds)

		const body = {
			'spoorIds': spoorIds,
			'params' : {
				'fromdate': fromdate,

				// FROM THE MOUSEFLOW DOCS
				// todate: The end date of the query. This date is not included in the query.
				'todate': kq.timeframe && kq.timeframe.indexOf('this') === 0 ? tomorrow : today
			}
		}

		if (entry) {
			body.entry = entry;
		}

		console.log('calling that api!')
		console.log(body)

		return fetch(`${window.location.protocol}//${window.location.host}/api/mouseflow`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})
			.then((response) => {
				console.log('got response')
				return response.text()
			})
			.then((tableMarkup) => {
				console.log('it\'s a table!')
				doneLoading(el);

				el.innerHTML = tableMarkup;

				const tableEl = window.$('.recordings');
				tableEl.stupidtable();

				return true;
			})
			.catch((error) => {
				console.log('it\'s an error!')
				doneLoading(el);
				el.innerHTML = error;
				return;
			});
	});
}
