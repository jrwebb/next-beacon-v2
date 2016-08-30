const nWebpack = require('@financial-times/n-webpack');

module.exports = nWebpack({
	withHashedAssets: true,
	withBabelPolyfills: true,
	entry: {
		'./public/main.js': './client/main.js',
		'./public/worker.js': './client/worker.js',
		'./public/main.css': './client/main.scss'
	}
})
