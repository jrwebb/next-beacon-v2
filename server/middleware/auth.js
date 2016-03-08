'use strict';

// To see the logs, run this at a bash prompt:
// heroku logs -ta ft-next-beacon-dashboard | grep S3O

var logger = require('ft-next-logger').logger;
var authS3O = require('s3o-middleware');
const IPwhitelist = (process.env.IP_WHITELIST || '').split(',');

const IPorS3O = function (req, res, next) {
	if (IPwhitelist.indexOf(req.get('Fastly-Client-IP') || req.ip) > -1 || process.env.NODE_ENV !== 'production') {
		next();
	} else {
		authS3O(req, res, next);
	}
};

var auth = function(req, res, next) {
	if (process.env.NODE_ENV !== 'production') {
		return next();
	}
	IPorS3O(req, res, next);
};

module.exports = auth;
