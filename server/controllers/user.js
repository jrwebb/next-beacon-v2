'use strict';

// Render a group of charts in a dashboard
const yaml = require('js-yaml');

module.exports = function(req, res) {
	const uuid = req.query.uuid;

	if (!uuid) {
		return res.render('dashboard', {
			layout: 'beacon',
			isUserDashboard: true,
			uuid: '',
			title: 'User data',
			charts: []
		});
	}

	res.render('dashboard', {
		layout: 'beacon',
		isUserDashboard: true,
		uuid: uuid,
		title: 'User data',
		charts: yaml.load(`-
	question: When has this user visited next?
	name: user/usage
	query: "page:view->count()->group(page.location.type)->filter(user.uuid=${uuid})"
	colspan: 12 L4
-
	question: Which non-article pages has this user visited?
	name: user/pages-viewed
	query: "page:view->count()->filter(page.location.type!=article)->group(page.location.path)->filter(user.uuid=${uuid})->sortDesc()"
	interval: false
	datalabel: Article views
	colspan: 12 L4
	printer: Table
-
	question: What articles has this user read?
	name: user/articles-read
	query: "page:view->count()->filter(page.location.type=article)->group(content.title)->filter(user.uuid=${uuid})"
	datalabel: Article views
	colspan: 12 L4
	printer: Table
-
	question: Which browsers does this user use?
	name: user/browsers
	query: "page:view->count()->group(device.browserName,device.browserVersion.major)->filter(user.uuid=${uuid})"
	colspan: 12 L4
	printer: Table
-
	question: Which devices does this user use?
	name: user/devices
	query: "page:view->count()->group(device.primaryHardwareType,device.osName)->filter(user.uuid=${uuid})"
	colspan: 12 L4
	printer: Table
`.replace(/^\t/gm, '  ')).map(c => {
			c.hasConfigurableTimeframe = c.timeframe !== false; //eslint-disable-line
			c.hasConfigurableInterval = c.interval == null; //eslint-disable-line
			c.colspan = c.colspan || '12 L6'
			return c;
		}),
		timeframe: req.query.timeframe || 'this_14_days',
		interval: req.query.interval,
		printer: req.query.printer === 'Table' ? 'Table' : undefined
	});
-
	question: Which barriers have the user seen?
	name: user/barriers-viewed
	query: "barrier:view->count()->group(context.type)->filter(context.type)->filter(user.uuid=${uuid})"
	colspan: 12 L4
	printer: Table
}
