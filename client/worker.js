/* globals self, caches, clients */
'use strict';
const cacheName = 'beacon-v2';

function putInCache(request, res) {
	const copy = res.clone();
	return caches.open(cacheName)
		.then(function (cache) {
			return cache.put(request, copy);
		});
}

self.addEventListener('install', function () {
	// console.log('install')
});

self.addEventListener('activate', function() {
	// console.log('activate')
	if (self.clients && clients.claim) {
		clients.claim();
	}
});

self.addEventListener('fetch', function (event) {
	var request = event.request;
	// console.log('real fetch', request.url)
	if (/www\.gstatic\.com\//.test(request.url)) {
		console.log('trying to find in cache', request.url)
		return event.respondWith(
		      caches.match(request)
		        .then(function (response) {
				if (response) {
					// console.log('delivering cached', request.url);
					return response.clone();
				}
					// console.log('failed to find in cache', request.url)
				return fetch(request)
					.then(res => {
						putInCache(request, res);
						return res.clone();
					})
        })
    );
	}

	event.respondWith(fetch(request))
	return;
});
