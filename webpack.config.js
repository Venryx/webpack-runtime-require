var webpack = require("webpack");

module.exports = {
	entry: ["./Source/Main.ts"],
	output: {
		path: __dirname + "/dist",
		publicPath: "http://localhost:8080/",
		filename: "Main.js",
		libraryTarget: "umd",
	},
	resolve: {
		root: "Source",
		extensions: ["", ".ts"],
	},
    module: {
        loaders: [
			{
				test: /\.ts$/,
				loader: "babel",
				exclude: /node_modules/,
				query: {
					presets: ["es2015"]
				}
			},
			{test: /\.ts$/, loader: "ts-loader"},
		]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
    ]
};