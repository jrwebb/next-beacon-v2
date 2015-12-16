'use strict';

const KeenQuery = require('next-keen-query');

require('next-js-setup')
	.bootstrap(function (res) {
		[].slice.call(document.querySelectorAll('[data-keen-query]')).forEach(el => {
			KeenQuery.execute(el.getAttibute('data-keen-query'))
				.then(str => el.innerHTML = str);
		});
	})

