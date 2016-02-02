/* global google */

'use strict';

require('./printers');
require('./components/feature-search');

if (document.querySelector('.query-wizard')) {
	require('./components/query-wizard').init();
} else {
	require('./components/render').init();
}

// Note: google.charts.load() cannot be called more than once.
(() => google.charts.load('current', {packages: ['corechart','table']}))();
