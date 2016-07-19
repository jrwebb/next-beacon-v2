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
	}, 10000);
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

export function getRecordings ({el, queryStr, eventLimit, messagesEl, configuration, chartName}={}) {

	console.log('\n\nGetting recordings');

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
	console.log('kq', kq)

	console.log('timeframe', kq.timeframe);

	let timeframe;
	let period;
	let fromdate;
	let todate;

	try {
		timeframe = kq.timeframe || 'this_14_days';

		if (timeframe.indexOf('start') !== -1 && timeframe.indexOf('end') !== -1) {
			const timeframeObj = JSON.parse(timeframe);
			fromdate = timeframeObj.start;
			todate = timeframeObj.end;
		}
		else {
			period = parseInt(timeframe.match(/\d+/)[0]);
		}
	}
	catch (e) {
		// TODO hadle nicely
		throw e;
	}

	console.log('period', period)
	console.log('from, to', fromdate, todate)
	console.log('latest', latest)

	const query = new keenIO.Query('extraction', {
		timeframe: timeframe,
		event_collection: kq.query.event_collection,
		target_property: kq.query.target_property,
		filters: kq.filters,
		latest: latest,
		property_names: ['device.spoorId'],
		group_by: kq.groupedBy
	});


	console.log('running query', query)

	predictSluggishness(period, latest, messagesEl);

	const keen = keenIO.configure({
		projectId: window.KEEN_PROJECT_ID,
		readKey: window.KEEN_READ_KEY
	});

	return new Promise((resolve, reject) => {
		try {
			boredYet(messagesEl);
			keen.run(query, function (err, response){
				clearMessages(messagesEl);
				if (err) {
					reject(err);
				}
				resolve(response.result)
			});
		} catch (error) {
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

		fromdate = fromdate || formatDate(fromtime);

		let entry;

		for (const filter of kq.filters) {
			if (filter.property_name.toLowerCase().indexOf('normalizedpath') !== -1) { //TODO other paths
				entry = filter.property_value;
			}
		}

		const body = {
			'spoorIds': spoorIds, //['ciq0ydlwu00003j5giv9zzfji'],//
			'params' : {
				'fromdate': fromdate, //'2016-06-17',//

				// FROM THE MOUSEFLOW DOCS
				// todate: The end date of the query. This date is not included in the query.
				'todate': todate || (timeframe && timeframe.indexOf('this') === 0 ? tomorrow : today) //'2016-07-18'//
			}
		}

		if (entry) {
			body.entry = entry;
		}

		console.log('Calling mouseflow with:', body)

		return fetch(`${window.location.protocol}//${window.location.host}/api/mouseflow`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})
			.then((response) => {
				return response.text()
			})
			.then((tableMarkup) => {

				// console.log('tableMarkup')
				// console.log(tableMarkup)

				doneLoading(el);

				el.innerHTML = tableMarkup;

				const tableEl = window.$('.recordings');
				tableEl.stupidtable();

				return true;
			})
			.catch((error) => {
				doneLoading(el);
				el.innerHTML = error;
				return;
			});
	});
}