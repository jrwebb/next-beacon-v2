/* global google */

'use strict';

require('./printers');
require('./components/feature-search').init();

if (document.querySelector('.kq-repl')) {
	require('./components/kq-repl').init();
} else {
	require('./components/render').init();
}

(() => {
	// Error: google.charts.load() cannot be called more than once.
	google.charts.load('current', {packages: ['corechart','table']});
})();
