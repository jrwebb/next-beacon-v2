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
						console.log(`Error with dashboard file: ${directory}${file}`, e);
					}
				});

				if (dashboards.length) {
					res.locals.dashboards = dashboards;

					let primaryDashboards = [];
					dashboards.forEach(d => {
						if (d.isprimary) {
							let primaryMenu = {
								id: d.id,
								title: d.title
							};
							if (d.dashboards && d.dashboards.length) primaryMenu.dashboards = d.dashboards.map(c => {
								return {
									id: c.id,
									title: c.title,
									path: `${d.id}/${c.id}`
								}
							});
							primaryDashboards.push(primaryMenu);
						}
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
