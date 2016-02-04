/* global google */

'use strict';

require('./printers');
require('./components/feature-search');

if (document.querySelector('.query-wizard')) {
	require('./pages/query-wizard').init();
} else {
	require('./pages/dashboard').init();
}

google.charts.load('current', {
	packages: ['corechart', 'table']
});
