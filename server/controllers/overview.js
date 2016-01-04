module.exports = function(req, res) {
	res.render('overview', {
		layout: 'beacon',
		keen_project: process.env.KEEN_PROJECT_ID,
		keen_read_key: process.env.KEEN_READ_KEY,
		keen_master_key: process.env.KEEN_MASTER_KEY
	});
}
