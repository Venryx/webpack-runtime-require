var webpack = require("webpack");

module.exports = {
	mode: "production",
	entry: ["./Source/Main.ts"],
	output: {
		path: __dirname + "/dist",
		publicPath: "http://localhost:8080/",
		filename: "Main.js",
		libraryTarget: "umd",
	},
	resolve: {
		//root: "Source",
		extensions: ["", ".ts"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: [
						[
							"@babel/env",
							{
								//targets: {esmodules: true}, // target es2015
								targets: {node: "6.5"}, // target es2015
							},
						],
					],
				}
			},
			{test: /\.ts$/, loader: "ts-loader"},
		]
	},
	plugins: [
		//new webpack.NoErrorsPlugin(),
	]
};