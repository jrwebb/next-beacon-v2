'use strict';

require('./googlechart');

const KeenQuery = require('n-keen-query');
KeenQuery.definePrinter('line', require('./printers/line'));
KeenQuery.definePrinter('html', require('./printers/html'));

[].slice.call(document.querySelectorAll('[data-keen-alias]')).forEach(el => {
	const aliasAttribute = el.getAttribute('data-keen-alias');
	if (window.aliases && window.aliases[aliasAttribute]) {
		const alias = window.aliases[aliasAttribute];
		const printer = alias.printer || 'html';

		KeenQuery
			// Build the Keen API query
			.buildFromAlias(alias)

			// Fetch the data from Keen API and call the printer function
			.print(printer)

			// Handle the response from the printer function
			.then(res => {
				if (typeof res === 'function') {
					res(el, alias);
				} else {
					throw 'There is a problem with the query response.'
				}
			});
	}
});

require('./components/feature-search').init();
