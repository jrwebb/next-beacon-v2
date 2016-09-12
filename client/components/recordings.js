import keenIO from 'keen.io';
import KeenQuery from 'keen-query';
import {retrieveKq} from '../data/kq-cache';

function formatDate (timestamp) {
	return timestamp.getUTCFullYear() +'-'+ (timestamp.getUTCMonth() + 1) +'-'+ timestamp.getUTCDate();
}

let progressGenerator;

function updateMessages (messagesEl, source) {
	if (!messagesEl) {
		return;
	}

	messagesEl.classList.remove('hidden');
	messagesEl.innerHTML = `Fetching <b>3 days</b> of data from ${source}...`;

	progressGenerator = setInterval(function () {
		messagesEl.innerHTML += '.';
	}, 5000);
}

function clearMessages (messagesEl) {
	clearInterval(progressGenerator);
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

export function getRecordings ({el, queryStr, messagesEl, userTimeframe, configuration, chartName}={}) {

	const start = (new Date()).getTime();

	el.innerHtml = '';
	startLoading(el);

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
		timeframe: 'this_3_days',
		event_collection: kq.query.event_collection,
		target_property: kq.query.target_property,
		filters: kq.filters,
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

	const keen = keenIO.configure({
		projectId: window.KEEN_PROJECT_ID,
		readKey: window.KEEN_READ_KEY
	});

	return new Promise((resolve, reject) => {
		try {
			console.log('run query');
			console.log(query);
			updateMessages(messagesEl, 'Keen IO');
			keen.run(query, function (err, response){
				if (err) {
					console.log('error from keen');
					throw err;
				}
				resolve(response.result)
			});
		} catch (error) {
			console.log('error running query');
			reject(error);
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
		console.log(spoorIds);

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

		clearMessages(messagesEl);
		updateMessages(messagesEl, 'Mouseflow');
		return fetch(`${window.location.protocol}//${window.location.host}/api/mouseflow`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})
			.then((response) => {
				clearMessages(messagesEl);
				console.log('got response')
				return response.text()
			})
			.then((tableMarkup) => {
				clearMessages(messagesEl);
				console.log('it\'s a table!')
				doneLoading(el);

				el.innerHTML = tableMarkup;

				const tableEl = window.$('.recordings');
				tableEl.stupidtable();

				return true;
			})
			.catch((error) => {
				clearMessages(messagesEl);
				console.log('it\'s an error!')
				doneLoading(el);
				el.innerHTML = error;
				return;
			});
	});
}
