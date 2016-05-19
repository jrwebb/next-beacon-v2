/* global google */

'use strict';

import './beacon-tracker';
import './data/kq-extensions';
import './printers';
import {init as dashboard} from './pages/dashboard';

if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('/worker.js')
			.catch(function(err) {
				throw err;
			});
}

window.timer = {
	start: function () {
		this.startDate = new Date();
	},
	log: function (name) {
		console.log(name, new Date() - this.startDate);
	}
}

if (isExtraction) {
	require('./pages/extract').init();
} else if (document.querySelector('.query-wizard')) {
	require('./pages/query-wizard').init();
} else {
	dashboard();
}

if (document.querySelector('.feature-search')) {
	require('./components/feature-search');
}

google.charts.load('43', { // version 44 is VERY broken
	packages: ['corechart', 'table']
});


