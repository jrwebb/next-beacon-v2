const nPerspective = require('@financial-times/n-perspective');

module.exports = function (req, res) {
	nPerspective(req.body)
		.then((result) => {
			res.render('recordings', result);
		}).
		catch((err) => {
			//TODO
			console.log('error fetching from mouseflow', err);
		})
};
