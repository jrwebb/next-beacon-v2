'use strict';

const blacklist = [];

const propertiesMap = {};

module.exports = {
	update: list => {

		list.forEach(eventName => {
			fetch(`https://keen-proxy.ft.com/3.0/projects/${process.env.KEEN_PROJECT_ID}/events/${eventName}?api_key=${process.env.KEEN_MASTER}`)
				.then(res => {
					if (!res.ok) {
						throw 'keen response not ok';
					}
					return res.json()
				})
				.then(data => {
					propertiesMap[eventName] = Object.keys(data.properties)
						.filter(propName => propName.indexOf('.querystring') === -1)
						.filter(propName => blacklist.indexOf(propName) === -1)
						.sort()
						.map(propName => {
							return {
								name: propName,
								lowerCase: propName.toLowerCase(),
								type: data.properties[propName]
							}
						})
				})

		})
	},

	get: eventName => {
		return propertiesMap[eventName] || [];
	}


}
