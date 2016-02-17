'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

module.exports = (req, res, next) => {
	let dashboards = [];
	const directory = `${__dirname}/dashboards/`;
	try {
		fs.readdir(directory, (err, files) => {
			if (err) {
				throw(err);
			}
			else {
				files.forEach(file => {
					try {
						const dashboard = yaml.load(fs.readFileSync(`${directory}${file}`, 'utf8'));
						dashboards.push(dashboard);
					}
					catch (e) {
						console.log(`Error loading dashboard file: ${directory}${file}`);
					}
				});

				if (dashboards.length) {
					res.locals.dashboards = dashboards;

					let primaryDashboards = [];
					dashboards.forEach(d => {
						if (d.isprimary) primaryDashboards.push ({
							id: d.id,
							title: d.title
						});
					});
					res.locals.primaryDashboards = primaryDashboards;
				}

				next();
			}
		});
	}
	catch (e) {
		console.log(`Error loading dashboard file/s`);
		next();
	}
};
