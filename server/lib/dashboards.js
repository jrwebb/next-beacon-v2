'use strict';

const yaml = require('js-yaml');
const fs = require('fs');
const directory = `${process.cwd()}/dashboards/`;
let dashboards = [];
let primaryDashboards = [];

try {
	fs.readdir(directory, (err, files) => {
		if (err) {
			throw(err);
		} else {
			files.forEach(file => {
				try {
					const dashboard = yaml.load(fs.readFileSync(`${directory}${file}`, 'utf8'));
					dashboards.push(dashboard);
					dashboard.charts.forEach(c => {
						c.queryname = c.name;
						c.name = `${dashboard.id}/${c.queryname}`;
						c.dashboardfeature = dashboard.id;
						if (c.question && c.question.charAt(c.question.length -1) !== '?') {
							c.question = c.question + '?';
						}
						// disable configuring timeframe in the UI if timeframe set to false
						// (generally meaning that the query string manually sets a fixed value for it)
						c.hasConfigurableTimeframe = c.timeframe !== false; //eslint-disable-line
						// disable configuring interval in the UI if any value at all set for interval
						c.hasConfigurableInterval = c.interval == null; //eslint-disable-line

						c.colspan = c.colspan || '12 L6'
					});
				} catch (e) {
					console.log(`Error loading dashboard file: ${directory}${file}`);
					throw e;
				}
			});

			primaryDashboards = dashboards.filter(d => d.isPrimary);
		}
	});
} catch (e) {
	console.log(`Error loading dashboard file/s`);
}


module.exports.middleware = function (req, res, next) {
	res.locals.dashboards = dashboards;
	res.locals.primaryDashboards = primaryDashboards;
	next();
}
