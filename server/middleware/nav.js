
module.exports = function (req, res, next) {
	res.locals.nav = {
		flags: Object.keys(res.locals.flags).map(k => {
			return {
				name: k,
				lc: k.toLowerCase()
			}
		})
	};
	next();
}
