'use strict';

require('./printers');
require('./components/feature-search').init();

if (document.querySelector('.kq-repl')) {
	require('./components/kq-repl').init();
} else {
	require('./components/render').init();
}
