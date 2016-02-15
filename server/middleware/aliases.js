'use strict';

let aliases = [];
const Poller = require('ft-poller');
const url = 'http://bertha.ig.ft.com/view/publish/gss/1jH15yE5T6omD-B58UJfu1y4j8qN4QIs17u-52_Jkw7M/aliases';

const poller = new Poller({
	url: url,
	defaultData: [],
	parseData: function (json) {
		aliases = json;
		return json
	}
});

function get (name) {
	if (name) {
		return aliases.filter(a => a.name && a.name.indexOf(name) === 0);
	} else {
		return aliases;
	}
}

module.exports = {
	init: (req, res, next) => {
		res.locals.aliases = get().reduce((alias,item) => {
			alias[item.name] = item;
			return alias;
		}, {});

		res.locals.customDashboards = get().reduce((alias,item) => {
			alias[item.dashboardfeature] = item;
			return alias;
		}, {});

		next();
	},

	get: get,

	poll: () => poller.start({initialRequest: true})
};
