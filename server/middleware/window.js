
module.exports = function (req, res, next) {
	res.locals.KEEN_PROJECT_ID = process.env.KEEN_PROJECT_ID;
	res.locals.KEEN_READ_KEY = process.env.KEEN_READ_KEY;
	res.locals.KEEN_MASTER_KEY = process.env.KEEN_MASTER_KEY;
	next();
}
