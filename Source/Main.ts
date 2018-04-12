declare var window, global;
var g = typeof window != "undefined" ? window : global;
function MakeGlobal(props) {
	for (let key in props)
		g[key] = props[key];
}

declare var __webpack_require__;
//export var webpackData_; // needs to have different name, so that window.webpackData can be set (Chrome seems to have a bug, when name is shared)
if (g.webpackData == null) {
	if (typeof __webpack_require__ != "undefined") {
		g.webpackData = __webpack_require__;
	} else if (g.webpackJsonp) {
		let webpackVersion = g.webpackJsonp.length == 2 ? 1 : 2;
		if (webpackVersion == 1) {
			g.webpackJsonp([],
				{0: function(module, exports, __webpack_require__) {
					g.webpackData = __webpack_require__;
				}}
			);
		} else {
			g.webpackJsonp([],
				{123456: function(module, exports, __webpack_require__) {
					g.webpackData = __webpack_require__;
				}},
				[123456]
			);
		}
	} else {
		throw new Error(`window.webpackData must be set for webpack-runtime-require to function.${"\n"
			}You can do so either by setting it directly (to __webpack_require__), or by making window.webpackJsonp available. (eg. using CommonsChunkPlugin)`);
	}
}

export var allModulesText: string;
export var moduleIDs = {} as {[key: string]: number};
export var moduleNames = {} as {[key: number]: string};
export function ParseModuleData() {
	if (allModulesText != null) return;

	let moduleWrapperFuncs = Object.keys(g.webpackData.m).map(moduleID=>g.webpackData.m[moduleID]);
	allModulesText = moduleWrapperFuncs.map(a=>a.toString()).join("\n\n\n");

	let hasPathInfo = allModulesText.indexOf("__webpack_require__(/*! ") != -1;
	// if has path-info embedded, just use that! (set using `webpackConfig.output.pathinfo: true`)
	if (hasPathInfo) {
		// these are examples of before and after webpack's transformation: (which the regex below finds the path-comment of)
		// 		require("react-redux-firebase") => var _reactReduxFirebase = __webpack_require__(/*! react-redux-firebase */ 100);
		// 		require("./Source/MyComponent") => var _MyComponent = __webpack_require__(/*! ./Source/MyComponent */ 200);
		let regex = /__webpack_require__\(\/\*! ((?:.(?!\*))+) \*\/ ([0-9]+)\)/g;
		let matches = [] as RegExpMatchArray[];
		let match;
		while (match = regex.exec(allModulesText))
			matches.push(match);

		for (let [_, path, id] of matches) {
			let moduleName = path.match(/[^/]+\/?$/)[0]; // if ends with /, it's a folder-require (resolves to folder/index)

			moduleIDs[moduleName] = parseInt(id);
			moduleNames[parseInt(id)] = moduleName;
			// also add module onto Require() function, using "_" as the delimiter instead of "-" (so shows in console auto-complete)
			Require[moduleName.replace(/-/g, "_")] = g.webpackData.c[id] ? g.webpackData.c[id].exports : "[failed to retrieve module exports]";
		}
	}
	// else, infer it from the var-names of the imports
	else {
		// these are examples of before and after webpack's transformation: (which the regex below finds the var-name of)
		// 		require("react-redux-firebase") => var _reactReduxFirebase = __webpack_require__(100);
		// 		require("./Source/MyComponent") => var _MyComponent = __webpack_require__(200);
		let regex = /var ([a-zA-Z_]+) = __webpack_require__\(([0-9]+)\)/g;
		let matches = [] as RegExpMatchArray[];
		let match;
		while (match = regex.exec(allModulesText))
			matches.push(match);

		for (let [_, varName, id] of matches) {
			// these are examples of before and after the below regex's transformation:
			// 		_reactReduxFirebase => react-redux-firebase
			// 		_MyComponent => my-component
			// 		_MyComponent_New => my-component-new
			// 		_JSONHelper => json-helper
			let moduleName = varName
				.replace(/^_/g, "") // remove starting "_"
				.replace(new RegExp( // convert chars where:
							"([^_])"		// is preceded by a non-underscore char
						+ "[A-Z]"		// is a capital-letter
						+ "([^A-Z_])",	// is followed by a non-capital-letter, non-underscore char
					"g"),
					str=>str[0] + "-" + str[1] + str[2] // to: "-" + char
				)
				.replace(/_/g, "-") // convert all "_" to "-"
				.toLowerCase(); // convert all letters to lowercase
			
			moduleIDs[moduleName] = parseInt(id);
			moduleNames[parseInt(id)] = moduleName;
			// also add module onto Require() function, using "_" as the delimiter instead of "-" (so shows in console auto-complete)
			Require[moduleName.replace(/-/g, "_")] = g.webpackData.c[id] ? g.webpackData.c[id].exports : "[failed to retrieve module exports]";
		}
	}

	MakeGlobal({allModulesText, moduleIDs, moduleNames});
}

MakeGlobal({GetIDForModule});
export function GetIDForModule(name: string) {
	ParseModuleData();
	return moduleIDs[name];
}

MakeGlobal({Require});
export function Require(name: string) {
	if (name === undefined)
		return void ParseModuleData();

	let id = GetIDForModule(name);
	return g.webpackData.c[id] ? g.webpackData.c[id].exports : "[failed to retrieve module exports]";
}