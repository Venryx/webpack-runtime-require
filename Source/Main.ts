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

		// example in-bundle js: var _reactReduxFirebase = __webpack_require__(230);\n
		let regex = /var ([a-zA-Z_]+) = __webpack_require__\(([0-9]+)\)/g;
		let matches = [] as RegExpMatchArray[];
		let match;
		while (match = regex.exec(allModulesText))
			matches.push(match);

		for (let [_, name, id] of matches) {
			// this transforms the camel-case "_reactReduxFirebase" into "react-redux-firebase", since this is the most common format
			let name_fixed = name.replace(/[^a-zA-Z]/g, "").replace(/[A-Z]/g, ch=>"-" + ch.toLowerCase());
			moduleIDs[name_fixed] = parseInt(id);
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