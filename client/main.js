/* global google */

'use strict';

import './data/kq-extensions';
import './printers';
import {init as dashboard} from './pages/dashboard';


if (document.querySelector('.query-wizard')) {
	require('./pages/query-wizard').init();
} else {
	dashboard();
}

if (document.querySelector('.feature-search')) {
	require('./components/feature-search');
}

google.charts.load('current', {
	packages: ['corechart', 'table']
});
