export function GetModuleNameFromPath(path: string) {
	let parts = path.split("/");
	// last part might be empty, so find last part with content (path might end with /, if it's a folder-require -- which resolves to folder/index)
	let lastPartWithContent = parts[parts.length - 1] || parts[parts.length - 2];
	return lastPartWithContent.replace(/\.[^.]+/, ""); // remove extension
}
export function GetModuleNameFromVarName(varName: string) {
	// these are examples of before and after the below transformation code:
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
	return moduleName;
}

export function ParseModuleEntriesFromAllModulesText(allModulesText: string) {
	const entries = [] as {moduleID: string | number, moduleName: string}[];

	// these are examples of before and after webpack's transformation: (based on which the 1st regex below finds path-comments)
	// 		require("react-redux-firebase") => var _reactReduxFirebase = __webpack_require__(/*! react-redux-firebase */ 100);
	// 		require("./Source/MyComponent") => var _MyComponent = __webpack_require__(/*! ./Source/MyComponent */ 200);
	//let requiresWithPathCommentsRegex = /__webpack_require__\(\/\*! ((?:.(?!\*))+) \*\/ (["'0-9a-zA-Z\/.-]+)\)/g;
	//let requiresWithPathCommentsRegex = /__webpack_require__\(\/\*! ((?:.(?!\*))+) \*\/ ["']?([^"'\)]+)["']?\)/g;
	let requiresWithPathCommentsRegex = /__webpack_require__\(\/\*! (.+?) \*\/ ["']?([^"'\)]+?)["']?\)/g;
	// these are examples of before and after webpack's transformation: (based on which the 2nd regex below finds paths)
	// 		require("jquery") => __webpack_require__("jquery")
	//let requiresWithPathsRegex = /__webpack_require__\([^")]*"(.+?)"\)/g;
	let requiresWithPathsRegex = /__webpack_require__\("(.+?)"\)/g; // only process plain requires-with-paths (ie. ignore ones that also have path-comments)

	// if requires have path-info embedded, use that (set using [webpackConfig.output.pathinfo: true])
	if (allModulesText.match(requiresWithPathCommentsRegex)) {
		for (let match; match = requiresWithPathCommentsRegex.exec(allModulesText);) {
			let [_, path, idStr] = match;
			entries.push({
				moduleID: idStr,
				moduleName: GetModuleNameFromPath(path),
			});
		}
	}
	// if requires themselves are by-path, use that (set using [config.mode: "development"] or [config.optimization.namedModules: true])
	if (allModulesText.match(requiresWithPathsRegex)) {
		for (let match; match = requiresWithPathsRegex.exec(allModulesText);) {
			let [_, path] = match;
			entries.push({
				moduleID: path,
				moduleName: GetModuleNameFromPath(path),
			});
		}
	}
	// else, infer it from the var-names of the imports
	if (!allModulesText.match(requiresWithPathsRegex) && !allModulesText.match(requiresWithPathCommentsRegex)) {
		// these are examples of before and after webpack's transformation: (which the regex below finds the var-name of)
		// 		require("react-redux-firebase") => var _reactReduxFirebase = __webpack_require__(100);
		// 		require("./Source/MyComponent") => var _MyComponent = __webpack_require__(200);
		let regex = /var ([a-zA-Z_]+) = __webpack_require__\(([0-9]+)\)/g;
		for (let match; match = regex.exec(allModulesText);) {
			let [_, varName, idStr] = match;
			entries.push({
				moduleID: parseInt(idStr),
				moduleName: GetModuleNameFromVarName(varName),
			});
		}
	}

	// add modules from vendor chunk as well
	/*if (addFromVendorDLL) {
		const vendorChunkEntry = entries.find(a=>a.moduleName == "dll_reference vendor");
		for (const [key, value] of Object.entries(vendorChunkEntry)) {
			const moduleName = GetModuleNameFromPath(key);
			entries.push({key: moduleName, value: value.exports});
		}
	}*/

	return entries;
}

export function StoreValueWithUniqueName(collection: {[key: string]: any}, baseKey: string, value: any) {
	// check for invalid keys
	if (baseKey == "length") return; // needed fsr
	if (baseKey.match(/^[0-9]+$/)) return; // don't remember why this was needed

	let finalKey = baseKey;
	while (finalKey in collection) {
		// if exact value is found already present, return now (no need for a duplicate entry)
		if (collection[finalKey] === value) return;
		finalKey += "_";
	}
	collection[finalKey] = value;
}