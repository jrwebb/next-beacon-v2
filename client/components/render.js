'use strict';

import KeenQuery from 'n-keen-query';

module.exports = {
	init: () => {
		[].slice.call(document.querySelectorAll('[data-keen-alias]')).forEach(el => {
			const aliasAttribute = el.getAttribute('data-keen-alias');
			if (window.aliases && window.aliases[aliasAttribute]) {
				const alias = window.aliases[aliasAttribute];

				// Todo: Check that the printer has been defined in KeenQuery and/or BeaconV2
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

							// Remove the loading spinner
							el.parentElement.classList.remove('core-chart-loading');
						} else {
							throw 'There is a problem with the keen-query response.'
						}
					});
			}
		});
	}
}
