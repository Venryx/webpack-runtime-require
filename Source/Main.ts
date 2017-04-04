declare var window, global;
var g = typeof window != "undefined" ? window : global;
function MakeGlobal(props) {
	for (let key in props)
		g[key] = props[key];
}

console.assert(g.webpackJsonp, `"window.webpackJsonp" must be set for webpack-runtime-require to function.`);

export var webpackData_; // needs to have different name, so that window.webpackData can be set (Chrome seems to have a bug, when name is shared)
let webpackVersion = g.webpackJsonp.length == 2 ? 1 : 2;
if (webpackVersion == 1) {
	g.webpackJsonp([],
		{0: function(module, exports, __webpack_require__) {
			webpackData_ = __webpack_require__;
			//MakeGlobal({webpackData: webpackData_});
			g.webpackData = webpackData_;
		}}
	);
} else {
	g.webpackJsonp([],
		{123456: function(module, exports, __webpack_require__) {
			webpackData_ = __webpack_require__;
			//MakeGlobal({webpackData: webpackData_});
			g.webpackData = webpackData_;
		}},
		[123456]
	);
}

export var allModulesText: string;
export var moduleIDs = {} as {[key: string]: number};
export var moduleNames = {} as {[key: number]: string};
export function GetIDForModule(name: string) {
	if (allModulesText == null) {
		let moduleWrapperFuncs = Object.keys(webpackData_.m).map(moduleID=>webpackData_.m[moduleID]);
		allModulesText = moduleWrapperFuncs.map(a=>a.toString()).join("\n\n\n");
		MakeGlobal({allModulesText});

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
			Require[moduleName.replace(/-/g, "_")] = webpackData_.c[id] ? webpackData_.c[id].exports : "[failed to retrieve module exports]";
		}
		MakeGlobal({moduleIDs});
		MakeGlobal({moduleNames});
	}
	return moduleIDs[name];
}
MakeGlobal({GetIDForModule});

export function Require(name: string) {
	let id = GetIDForModule(name);
	return webpackData_.c[id] ? webpackData_.c[id].exports : "[failed to retrieve module exports]";
}
MakeGlobal({Require});