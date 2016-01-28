'use strict';

// Render multiple print()s of a standalone chart

module.exports = function(req, res) {
	res.render('chart', {
		layout: 'beacon',
		alias: res.locals.aliases[req.params[0]]
	});
}
