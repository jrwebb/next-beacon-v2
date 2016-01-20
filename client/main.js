'use strict';

// require('./googlechart');

const KeenQuery = require('n-keen-query');
KeenQuery.definePrinter('line', require('./printers/line'));
KeenQuery.definePrinter('html', require('./printers/html'));



require('./components/feature-search').init();

if (document.querySelector('.kq-repl')) {
	require('./components/kq-repl').init();
} else {
	require('./components/render').init();
}
