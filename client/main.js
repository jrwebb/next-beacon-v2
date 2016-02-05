/* global google */

'use strict';

require('./printers');
require('./components/feature-search');

import {init as dashboard} from './pages/dashboard';

if (document.querySelector('.query-wizard')) {
	require('./pages/query-wizard').init();
} else {
	dashboard();
}

google.charts.load('current', {
	packages: ['corechart', 'table']
});
