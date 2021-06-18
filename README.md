# Webpack Runtime Require

Exposes a way to require module exports at runtime. (eg. in browser consoles)

Supports Webpack versions 1, 2, 3?, 4, and 5.

### Install

```
npm install --save webpack-runtime-require
```

### Usage

1) In your `webpack.config.js` file, do one of the following: (otherwise it falls back to guessing the module's name from the variables where it's imported)  
	A) Set `config.optimization.moduleIds: "named"` (in wp <=4: `config.optimization.namedModules: true`). [this is the default if `config.mode == "development"`]  
	B) Set `config.output.pathinfo: true`.  

2) Add some way for the library to access the webpack data.

	This is generally as simple as importing it from one of the files in your main project/chunk:
	```
	import "webpack-runtime-require";
	```
	If that fails, try the following: (make sure the below runs before any uses of the `wrr` fields/functions)
	```
	import {Init} from "webpack-runtime-require";
	Init({
		__webpack_require__,
		// omit the two below if on Webpack 4 or below
		__webpack_modules__: __webpack_modules__, // don't collapse this; can confuse babel/webpack
		__webpack_module_cache__,
	});
	```
	(If even that fails, try using one of the older versions of webpack-runtime-require [3.3.1 or older], which has a couple other approaches for finding/supplying the data.)

	After importing/initialization, the library will create a `window.wrr` object. This object exposes structures and functions for accessing the contents of any module within the Webpack bundle.

3) Use the `window.wrr` object to access module contents, like so: (eg. from the dev-tools console)
	```
	let React = wrr.Require("react");
	console.log("Retrieved React.Component: " + React.Component);

	// if path was "./Path/To/MyComponent", specify just the file-name
	let MyComponent = wrr.Require("MyComponent");
	console.log("Retrieved MyComponent: " + MyComponent);
	```

	Alternately, you can import the `wrr` object from compile-time code, and use it that way:
	```
	import {wrr} from "webpack-runtime-require";
	wrr.Require("react");
	```

### Additional usage

If you're using the dev-tools console, you can see autocomplete for the modules:

1) Type and run: `wrr.Start()` (this triggers the module finding/processing)
2) Type: `wrr.moduleExports.`

You should then see all the modules in your app displayed in the autocomplete dropdown.

Other useful contents of the `window.wrr` structure:
* `wrr.moduleExports_flat`: Contains the exports from every module, stored by *export name* rather than *module name*.