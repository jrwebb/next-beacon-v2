'use strict';

const KeenQuery = require('n-keen-query');
KeenQuery.definePrinter('line', require('./printers/line'));
KeenQuery.definePrinter('html', require('./printers/html'));

[].slice.call(document.querySelectorAll('[data-keen-query]')).forEach(el => {

	let alias = el.getAttribute('data-keen-query');
	if (el.getAttribute('data-keen-timeframe')) {
		alias += `->relTime(${el.getAttribute('data-keen-timeframe')})`;
	}
	if (el.getAttribute('data-keen-interval')) {
		alias += `->interval(${el.getAttribute('data-keen-interval')})`;
	}

	const printer = el.getAttribute('data-keen-printer') || 'html';
	KeenQuery.build(alias)
		.print(printer)
		.then(res => {
			if (typeof res === 'string') {
				el.innerHTML = res;
			} else if (typeof res === 'function') {
				res(el);
			} else {
				throw 'There is a problem with the query response.'
			}
		});
});

require('./components/feature-search').init();
