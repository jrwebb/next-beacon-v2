'use strict';

const http = require('http');
const https = require('https');
var aws4 = require('aws4');
const auth = require('./middleware/auth');
const window = require('./middleware/window');
const aliases = require('./middleware/aliases');
const dashboards = require('./lib/dashboards');

const cookieParser	= require('cookie-parser');
const app = module.exports = require('ft-next-express')({
	layoutsDir: __dirname + '/../views/layouts',
	withBackendAuthentication: false
});



// Indicates the app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client. NOTE: X-Forwarded-* headers are easily spoofed and the detected IP addresses are unreliable.
// See: http://expressjs.com/api.html
app.enable('trust proxy');

app.get('/__gtg', function (req, res) {
	res.send(200);
});

app.get('/__debug-ssl', function(req, res) {
	res.json({
		protocol: req.protocol,
		headers: req.headers
	});
});

app.get('/hashed-assets/:path*', function(req, res) {
	const path = 'http://ft-next-hashed-assets-prod.s3-website-eu-west-1.amazonaws.com' + req.path;
	http.get(path, function(proxyRes) {
		proxyRes.pipe(res);
	});
});

app.use(cookieParser());
app.use(auth);
app.use(window);
app.use(aliases.init);
app.use(dashboards.middleware);
app.use(require('./middleware/nav'));

app.get('/keen-cache/:url', require('./controllers/keen-cache'));

app.get('/data/export/:limit', require('./controllers/data/export'));

app.get('/data/explorer', function(req, res) {
	res.render('keen', {
		layout: null,
		projectId: process.env.KEEN_PROJECT_ID,
		readKey: process.env.KEEN_READ_KEY,
		masterKey: process.env.KEEN_MASTER
	});
});

const keenCollections = require('./jobs/keen-collections');
const keenProperties = require('./jobs/keen-properties');

app.get('/data/query-wizard', function(req, res) {
	res.render('query-wizard', {
		layout: 'beacon',
		collections: keenCollections.getData(),
		properties: keenProperties.getData()
	});
});

// pipe through to an AWS bucket containing Redshift exports
app.get('/data/reports/*', function(req, res) {
	var signed = aws4.sign({
		service: 's3',
		hostname: process.env.S3_HOST,
		path: '/' + req.params[0],
		signQuery: true,
		region: 'eu-west-1',
	}, {
		accessKeyId: process.env.S3_AWS_ACCESS,
		secretAccessKey: process.env.S3_AWS_SECRET
	});
	https.get(signed, function(proxyRes) {
		proxyRes.pipe(res);
	});
});

app.get(/^\/dashboard\/(.*)/, require('./controllers/dashboard'));

app.get(/^\/chart\/(.*)/, function (req, res, next) {
  req.view = 'chart';
  next();
}, require('./controllers/dashboard'));

app.get(/^\/presentation\/(.*)/, function (req, res, next) {
  req.view = 'presentation';
  next();
}, require('./controllers/dashboard'));

app.get('/', function (req, res, next) {
  req.params[0] = 'overview';
  next();
}, require('./controllers/dashboard'));

aliases.poll()
	.then(() => app.listen(process.env.PORT));
