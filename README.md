# Webpack Runtime Require

Exposes a way to require module exports at runtime. (eg. in browser consoles)

Supports Webpack versions 1, 2, 3?, 4, and 5.

### Install

```
npm install --save webpack-runtime-require
```

### Usage

* 1\) Tweak your `webpack.config.js` file, to expose the information necessary for "runtime module requiring/importing".
	* 1.1\) Ensure that one of the following are set, to have webpack provide module path info: (otherwise this library falls back to guessing the module's name from the variables where it's imported)
		* 1.1.A) Set `config.optimization.moduleIds: "named"` (in wp <=4: `config.optimization.namedModules: true`). [this is the cleanest way; and it's enabled by default when `config.mode == "development"`]
		* 1.1.B) Set `config.output.pathinfo: true`. [not as clean, since relies on regular-expressions, but should work]
	* 1.2\) The setting tweaks below are only relevant for prod builds, and only if you're using a recent webpack version. (where prod builds have these optimizations enabled by default; ie. no need to tweak these if WRR usage is undesired in prod)
		* 1.2.1\) Recommended config, if you want WRR usable in prod:
			```js
			// disable concatenation/merging of modules, even in prod
			// (otherwise webpack merges many modules, causing exports between them to be removed/privatized)
			config.optimization.concatenateModules = false;
			```
		* 1.2.2\) You *may* also want to tell webpack prod-builds to never remove unused exports -- for example, if there's a class that is only used in a single file, but you still want runtime access to inspect static variables or the like. To do so:
			```js
			// disable removal/privatizing of unused exports, even in prod
			// (otherwise webpack-runtime-require can't access unused-from-other-module exports)
			config.optimization.usedExports = false;
			```
		* Note: These two tweaks will likely increase the size of your builds slightly (in my project, by ~10%). So weigh whether the slight size increase is worth it relative to improved inspection/debugging in your prod builds.

* 2\) Add some way for the library to access the webpack data.

	This is generally as simple as importing it from one of the files in your main project/chunk:
	```
	import "webpack-runtime-require";
	```
	If that fails, try the following: (make sure the below runs before any uses of the `wrr` fields/functions)
	```
	import {Init} from "webpack-runtime-require";

	// if you're using typescript, uncomment the line below
	//declare var __webpack_require__, __webpack_modules__, __webpack_module_cache__;

	Init({
		__webpack_require__,
		// omit the two below if on Webpack 4 or below
		__webpack_modules__: __webpack_modules__, // don't collapse this; can confuse babel/webpack
		__webpack_module_cache__,
	});
	```
	(If even that fails, try using one of the older versions of webpack-runtime-require [0.3.3 or older], which has a couple other approaches for finding/supplying the data.)

	After importing/initialization, the library will create a `window.wrr` object. This object exposes structures and functions for accessing the contents of any module within the Webpack bundle.

* 3\) Use the `window.wrr` object in dev-tools (or the `wrr` export in compile-time code) to access module contents.
	* 3.A\) A dev-tools example, of importing based on module/file name:
		```
		// for libraries, you can usually just use the library name
		// (replacing any non-variable-safe characters with underscores)
		// (in some cases, the name's more complicated; can inspect first, as seen in "Additional usage" section)
		let React = wrr.Module("react");
		console.log("Retrieved Component class from react:", React.Component);

		// if path was "./Path/To/MyComponent.js", specify just the file-name
		// (replacing any non-variable-safe characters with underscores)
		let MyComponent = wrr.Module("MyComponent_js");
		console.log("Retrieved MyComponent:", MyComponent);

		// if you want to import by path instead of file-name, see here:
		//   https://github.com/Venryx/webpack-runtime-require/issues/3#issuecomment-864035793
		```
	* 3.B\) A dev-tools example, of importing based on export name:
		```
		wrr.Start();
		let Component = wrr.Export("Component"); // retrieved from the "react" library
		console.log("Retrieved Component class from react:", Component);
		```
	* 3.C\) A compile-time code example, of doing some of the operations above:
		```
		import {wrr} from "webpack-runtime-require";
		console.log("Retrieved Component class from react:", wrr.Export("Component"));
		console.log("All react exports:", Object.entries(wrr.Module("react")));
		```

### Additional usage

If you're using the dev-tools console, you can see autocomplete for the modules:

* 1\) Type and run: `wrr.Start()` (this triggers the module finding/processing)
* 2\) Type: `wrr.moduleExports.` (or `wrr.moduleExports_byShortName.`)

You should then see all the modules in your app displayed in the autocomplete dropdown.

Other useful contents of the `window.wrr` structure:
* `wrr.moduleExports_flat`: Contains the exports from every module, stored by *export name* rather than module name.
* `wrr.webpackData`: The raw data-structures retrieved from webpack.