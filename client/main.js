'use strict';

require('./chartjs');

const KeenQuery = require('n-keen-query');
KeenQuery.definePrinter('line', require('./printers/line'));
KeenQuery.definePrinter('html', require('./printers/html'));

[].slice.call(document.querySelectorAll('[data-keen-alias]')).forEach(el => {
	const aliasAttribute = el.getAttribute('data-keen-alias');
	if (window.aliases && window.aliases[aliasAttribute]) {
		const alias = window.aliases[aliasAttribute];
		const printer = alias.printer || 'html';
		KeenQuery.buildFromAlias(alias)
			.print(printer)
			.then(res => {
				if (typeof res === 'string') {
					el.innerHTML = res;
				} else if (typeof res === 'function') {
					res(el, alias);
				} else {
					throw 'There is a problem with the query response.'
				}
			});
	}
});

require('./components/feature-search').init();
