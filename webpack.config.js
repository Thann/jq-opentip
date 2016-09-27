var webpack = require('webpack');

module.exports = {
	entry: "./index.js",
	output: {
		filename: "jq-opentip.bundle.js"
	},
	module: {
		loaders: [
			{ test:  /\.css$/, loaders: ["style", "css"] },
		]
	},
};

// if (process.argv.indexOf('--minify') >= 0) {
// 	var CompressionPlugin = require("compression-webpack-plugin");

// 	module.exports.plugins.concat([
// 		new webpack.optimize.UglifyJsPlugin({
// 			minimize: true,
// 			compress: {warnings: false}
// 		}),
// 		new CompressionPlugin({
// 			test: /\.js$/,
// 			algorithm: "gzip",
// 			asset: "[path].gz[query]"
// 		})
// 	]);
// }
