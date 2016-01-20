'use strict';

const KeenQuery = require('n-keen-query');

module.exports = {
	init: () => {
		[].slice.call(document.querySelectorAll('[data-keen-alias]')).forEach(el => {
			const aliasAttribute = el.getAttribute('data-keen-alias');
			if (window.aliases && window.aliases[aliasAttribute]) {
				const alias = window.aliases[aliasAttribute];
				const printer = alias.printer || 'html';

				// Build the Keen API query
				const builtQuery = KeenQuery.buildFromAlias(alias);

				// Generate the keen explorer Url for the chart
				alias.explorerURL = '/data/explorer?' + KeenQuery.generateExplorerUrl(builtQuery);

				// Fetch the data from Keen API and call the printer function
				builtQuery.print(printer)

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
	}
}
