# Webpack Runtime Require

Exposes a way to require module exports at runtime. (eg. in browser consoles)

Supports Webpack versions 1, 2, 3?, 4, and 5.

### Install

```
npm install --save webpack-runtime-require
```

### Usage

1) Add some way for the library to access the webpack data. You can do this in one of three ways.  
   A) Store the webpack data globally prior to importing this library. (webpack exposes some closure variables to your project modules/code)  
      1) If on Webpack 6+, run:
			```
			window.AddWebpackData({__webpack_require__, __webpack_modules__: __webpack_modules__, __webpack_module_cache__});
			```
	2) If on Webpack 5 or below, run:
		```
		window.AddWebpackData({__webpack_require__});
		```
   B) Load this library's code as a raw TypeScript module (instead of the regular UMD dist output) by adding `module: "Source/Main.ts"` to `node_modules/webpack-runtime-require/package.json`. This gives it direct access to the `__webpack_require__` function, and with it, the attached module list/data.  
   C) Have webpack make the `webpackJsonp` function available on `window`. To do so, add the CommonsChunkPlugin to webpack's config:  
	```
	// Stub, to make the webpackJsonp function available. (you don't actually have to have the plugin do anything)
	// If someone knows of a better way of exposing the function, let me know!
	config.plugins.push(new webpack.optimize.CommonsChunkPlugin({names: ["vendor"]}));
	```

2) In your `webpack.config.js` file, do one of the following: (otherwise it falls back to guessing the module's name from the variables where it's imported)  
A) Set `config.output.pathinfo` to `true`.  
B) Set `config.optimization.namedModules` to `true`. (or `config.mode` to `"development"`)  

3) Require the module at least once.
	```
	import "webpack-runtime-require";
	```

	It will then add a `Require()` function to the `window` object, for use in the console, or anywhere in your code.

4) Then just use it, like so:
	```
	let React = Require("react");
	console.log("Retrieved React.Component: " + React.Component);

	// if path was "./Path/To/MyComponent", specify just the file-name
	let MyComponent = Require("MyComponent");
	console.log("Retrieved MyComponent: " + MyComponent);
	```

	Alternately, you can require the `Require` function (oh, the meta!) from compile-time code and then use it directly:
	```
	import {Require} from "webpack-runtime-require";
	Require("react");
	```

### Additional usage

If you're using the dev-tools Console, you can see autocomplete for the modules:

1) Type and run: `Require()`
2) Type: `Require.`

You should then see all the modules in your app displayed in the autocomplete dropdown.