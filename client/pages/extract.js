/* global activeEventCollection, KEEN_PROJECT_ID, KEEN_READ_KEY */

'use strict';

import keenIO from 'keen.io';
import flat from 'flat';
// import csv from 'csv';
import csvUtils from '../../server/lib/csv-utils';

const outputElement = document.querySelector('.extract__output');
const tableHead = outputElement.querySelector('thead tr');
const tableBody = outputElement.querySelector('tbody');

window.outputUpdate = function(value) {
	document.querySelector('.extract__numberOfEvents').value = value;
	const submitBtn = document.querySelector('.extract__submit');

	if (!submitBtn) {
		return;
	}

	if (value < 1000) {
		submitBtn.innerHTML = "Click here to extract data"
	} else if (value < 3000) {
		submitBtn.innerHTML = "This'll take a while"
	} else if (value < 6000) {
		submitBtn.innerHTML = "Might as well go put the kettle on"
	} else if (value < 10000) {
		submitBtn.innerHTML = "It should be done by Christmas"
	} else {
		submitBtn.innerHTML = "Warning: This may crash your browser"
	}
}

function getSelectedProperties(){
	let selectedProperties = [].filter.call(document.querySelectorAll('.extract__properties input[type=checkbox]'), input_element => {
		return input_element.checked === true;
	}).map(input_element => {
		return encodeURIComponent(input_element.value);
	});
	return selectedProperties;
}

function updateHistory() {
	let pathnameSlugs = location.pathname.split('/');
	pathnameSlugs[3] = activeEventCollection;

	let selectedProperties = getSelectedProperties().join(',');
	pathnameSlugs[4] = selectedProperties;
	history.pushState({}, "Extract", pathnameSlugs.join('/'));
}

function buildExtractionQuery(){

	// `activeEventCollection` comes via the controller and is assigned to the window oject.
	if (!activeEventCollection) {
		throw 'An event collection is required for keen.io extractions.';
	}

	// Todo: Allow for a configurable timeframe (and perhaps `filters` and `email`)
	// See https://keen.io/docs/api/#extractions
	let timeframe = timeframe || 'this_90_days';
	const query = new keenIO.Query('extraction', {
		timeframe: timeframe,
		event_collection: activeEventCollection,
		property_names: `["${getSelectedProperties().join('","')}"]`,
		latest: document.querySelector('.extract__numberOfEvents').value || 100
	});
	return query;
}

function runExtractionQuery(query){
	return new Promise((resolve, reject) => {
		try {
			const keen = keenIO.configure({
				projectId: KEEN_PROJECT_ID,
				readKey: KEEN_READ_KEY
			});
			keen.run(query, (error, response) => {
				if (error) {
					throw 'Error response from keen API: ' + error;
				}
				resolve(response);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function renderToDom(response){
	outputElement.classList.remove('chart--loading');

	// Columns -> table headings
	let flattened = response.result.map(function(event) {
		return flat(event);
	});

	// Any data processing (sorting, time formatting, null-value defaulting) would go here.
	const propertyNames = Object.keys(csvUtils.columns(flattened));
	propertyNames.forEach(propertyName => {
		tableHead.insertAdjacentHTML('beforeend', `<th>${propertyName}</th>`);
	});

	// Properties -> table rows
	flattened.forEach(row => {
		let html = '<tr>';
		propertyNames.forEach(propertyName => {
			html += `<td>${row[propertyName] || ''}</td>`;
		});
		html += '</tr>';
		tableBody.insertAdjacentHTML('beforeend', html);
	});
}

function punchItChewie() {
	if (outputElement.classList.contains('chart--loading')) {
		return false;
	}
	let selectedProperties = getSelectedProperties();
	if (!selectedProperties || selectedProperties.length < 1) {
		document.querySelector('.extract__submit').innerHTML = "⬅ Select some properties please";
		return false;
	}
	tableHead.innerHTML = '';
	tableBody.innerHTML = '';
	outputElement.classList.add('chart--loading');
	updateHistory();
	let query = buildExtractionQuery()
	if (query) {
		runExtractionQuery(query)
			.then(response => {

				// Todo: Render differently depending on if CSV format's required ..?
				renderToDom(response);
			});
	}
}

function init() {
	window.outputUpdate(document.querySelector('.extract__numberOfEvents').value);
	document.querySelector('.extract__submit').onclick = punchItChewie;
	[].forEach.call(document.querySelectorAll('.extract__properties input[type=checkbox]'), input_element => {
		input_element.onclick = event => {
			event.srcElement.parentElement.classList.toggle('checked');
			window.outputUpdate(document.querySelector('.extract__numberOfEvents').value);
		}
	});
}

module.exports = {
	init: init
}
