'use strict';

// To see the logs, run this at a bash prompt:
// heroku logs -ta ft-next-beacon-dashboard | grep S3O

var authS3O = require('s3o-middleware');

var auth = function(req, res, next) {
	authS3O(req, res, next);
};

module.exports = auth;
