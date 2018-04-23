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