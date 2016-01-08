'use strict';

const KeenQuery = require('n-keen-query');
KeenQuery.definePrinter('line', require('./printers/line'));
KeenQuery.definePrinter('metric', require('./printers/metric'));

[].slice.call(document.querySelectorAll('[data-keen-query]')).forEach(el => {

	KeenQuery.build(el.getAttribute('data-keen-query'))
		.print(el.getAttribute('data-keen-printer'))
		.then(res => {
			if (typeof res === 'string') {
				el.innerHTML = res;
			} else if (typeof res === 'function') {
				res(el);
			} else {
				throw 'There was a problem executing the alias.'
			}
		});
});

require('./components/feature-search').init();
