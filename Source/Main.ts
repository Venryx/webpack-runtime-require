var g = window as any;
function MakeGlobal(props) {
	for (let key in props)
		g[key] = props[key];
}

export var WebpackData;
MakeGlobal({WebpackData});
g.webpackJsonp(
	[],
	{0: function(module, exports, __webpack_require__) {
		WebpackData = __webpack_require__;
	}},
	[0]
);

export var allModulesText: string;
MakeGlobal({allModulesText});
export var moduleIDs = {} as {[key: string]: number};
MakeGlobal({moduleIDs});
export function GetIDForModule(name: string) {
	if (allModulesText == null) {
		let moduleWrapperFuncs = Object.keys(WebpackData.m).map(moduleID=>WebpackData.m[moduleID]);
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
			// 		_JSONHelper => jsonhelper
			let moduleName = varName
				.replace(/^_/g, "") // remove starting "_"
				.replace(new RegExp( // convert chars where:
						  "(?<!(^|[A-Z_]))"	// is not preceded by a start-of-line, capital-letter, or underscore
						+ "[A-Z]"			// is a capital-letter
						+ "(?![A-Z_])",		// is not followed by a capital-letter or underscore
					"g"),
					ch=>"-" + ch // to: "-" + char
				)
				.replace(/_/g, "-") // convert all "_" to "-"
				.toLowerCase(); // convert all letters to lowercase
			moduleIDs[moduleName] = parseInt(id);
		}
	}
	return moduleIDs[name];
}
MakeGlobal({GetIDForModule});

export function Require(name: string) {
	let id = GetIDForModule(name);
	return WebpackData.c[id].exports;
}
MakeGlobal({Require});