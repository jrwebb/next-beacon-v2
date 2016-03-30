"use strict";

var oTracking = require('o-tracking');

// oTracking is only desired for the production environment.
if (!!document.querySelector("html[data-next-is-production]")) {
	oTracking.init({
		server: 'https://spoor-api.ft.com/ingest',
		context: {
			product: 'next'
		},
		user: {}
	});

	oTracking.event({
		detail: {
			category: 'beacon-dashboard',
			action: 'view'
		}
	});
}
