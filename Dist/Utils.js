export class ModuleInfo {
    constructor(data) {
        Object.assign(this, data);
    }
}
// Real example paths, on webpack 5.90.3 (with `optimization.moduleIds=named` and `output.pathinfo=true`): (also shows the module name that this function should return)
// ./Resources/SVGs/arrow-up.svg                                      -> Resources_SVGs_arrow_up_svg
// ../../node_modules/lodash/_cloneDataView.js                        -> lodash_cloneDataView_js
// ../../node_modules/tiny-invariant/dist/tiny-invariant.esm.js       -> tiny_invariant_esm_js
// ../../node_modules/ajv-keywords/dist/index.js                      -> ajv_keywords
// ../../node_modules/ajv-keywords/dist/keywords/deepProperties.js    -> ajv_keywords_keywords_deepProperties_js
export function GetModuleNameFromPath(path, asSingleSegmentName = false) {
    let segments = path.split("/");
    let segmentsForName = segments.filter(a => {
        const aLower = a.toLowerCase();
        // exclude folder-related parts (path might end with /, if it's a folder-require -- which resolves to folder/index)
        if (a == "" || a == "." || a == "..")
            return false;
        // exclude "dist", "esm", and "cjs" folders (meaningless for naming purposes)
        if (aLower == "dist" || aLower == "esm" || aLower == "cjs")
            return false;
        // exclude "index" files (meaningless for naming purposes)
        if (aLower.startsWith("index."))
            return false;
        return true;
    });
    // simplify each segment to only characters that are valid for variable-names (so they can show in the autocomplete dropdown)
    const simplifySegmentForVarName = (a) => a.replace(/[^a-zA-Z0-9_]/g, "_");
    // if only want the last segment, return it now
    if (asSingleSegmentName) {
        segmentsForName = segmentsForName.map(a => simplifySegmentForVarName(a));
        return segmentsForName[segmentsForName.length - 1];
    }
    // else: we'll do additional processing and turn it into a path-like long string
    // exclude node_modules part (and parts before that)
    let nodeModulesIndex = segmentsForName.indexOf("node_modules");
    if (nodeModulesIndex != -1)
        segmentsForName = segmentsForName.slice(nodeModulesIndex + 1);
    segmentsForName = segmentsForName.map((part, i) => {
        let result = part;
        // for last part, remove extension
        if (i == segmentsForName.length - 1)
            result = result.replace(/\.[^.]+$/, "");
        // for all parts, do the processing below
        result =
            // do general simplification-for-var-name
            simplifySegmentForVarName(result)
                // remove prefix/postfix underscores (since these would end up as double-underscores when parts are joined)
                .replace(/^_+/, "").replace(/_+$/, "")
                // remove double underscores
                .replace(/_+/g, "_");
        return result;
    });
    // always end the name with "__" (to make targeting a specific filename easy, eg. `Todo__` to target `Todo.tsx` but not `Todo/[various other files].tsx`)
    return segmentsForName.join("_") + "__";
}
export function GetModuleNameFromVarName(varName) {
    // these are examples of before and after the below transformation code:
    // 		_reactReduxFirebase => react-redux-firebase
    // 		_MyComponent => my-component
    // 		_MyComponent_New => my-component-new
    // 		_JSONHelper => json-helper
    let moduleName = varName
        .replace(/^_/g, "") // remove starting "_"
        .replace(new RegExp(// convert chars where:
    "([^_])" // is preceded by a non-underscore char
        + "[A-Z]" // is a capital-letter
        + "([^A-Z_])", // is followed by a non-capital-letter, non-underscore char
    "g"), str => str[0] + "-" + str[1] + str[2] // to: "-" + char
    )
        .replace(/_/g, "-") // convert all "_" to "-"
        .toLowerCase(); // convert all letters to lowercase
    return moduleName;
}
export function ParseModuleInfoFromModuleFuncs(moduleFuncs, allModulesText) {
    // The easiest way to get module-names is if the module-paths are simply provided. (enabled using optimization.moduleIds=named)
    // So try this route first. (this way also works even with minification enabled)
    // ----------
    var _a, _b, _c, _d;
    const moduleFuncEntries = Object.entries(moduleFuncs);
    const moduleIDs = moduleFuncEntries.map(([moduleID, moduleFunc]) => moduleID);
    const moduleFullNames = moduleFuncEntries.map(([moduleID, moduleFunc]) => moduleFunc.name);
    const modulePaths_fromIDs = ((_a = moduleIDs[0]) === null || _a === void 0 ? void 0 : _a.includes("/")) || ((_b = moduleIDs[1]) === null || _b === void 0 ? void 0 : _b.includes("/")) ? moduleIDs : null;
    const modulePaths_fromFullNames = ((_c = moduleFullNames[0]) === null || _c === void 0 ? void 0 : _c.includes("/")) || ((_d = moduleFullNames[1]) === null || _d === void 0 ? void 0 : _d.includes("/")) ? moduleFullNames : null;
    const modulePaths = modulePaths_fromIDs !== null && modulePaths_fromIDs !== void 0 ? modulePaths_fromIDs : modulePaths_fromFullNames;
    if (modulePaths) {
        return moduleFuncEntries.map((entry, index) => {
            const modulePath = modulePaths[index];
            return new ModuleInfo({
                id: entry[0],
                name_long: GetModuleNameFromPath(modulePath, false),
                name_short: GetModuleNameFromPath(modulePath, true),
            });
        });
    }
    // else, fall back to trying to extract the module-names using regular-expressions on the code (eg. the import lines)
    // ----------
    const entries = [];
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
            entries.push(new ModuleInfo({
                id: idStr,
                name_long: GetModuleNameFromPath(path, false),
                name_short: GetModuleNameFromPath(path, true),
            }));
        }
    }
    // if requires themselves are by-path, use that (set using [config.mode: "development"] or [config.optimization.namedModules: true])
    if (allModulesText.match(requiresWithPathsRegex)) {
        for (let match; match = requiresWithPathsRegex.exec(allModulesText);) {
            let [_, path] = match;
            entries.push(new ModuleInfo({
                id: path,
                name_long: GetModuleNameFromPath(path, false),
                name_short: GetModuleNameFromPath(path, true),
            }));
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
            entries.push(new ModuleInfo({
                id: parseInt(idStr),
                name_long: GetModuleNameFromVarName(varName),
                name_short: GetModuleNameFromVarName(varName),
            }));
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
export function StoreValueWithUniqueName(collection, baseKey, value) {
    // check for invalid keys
    if (baseKey == "length")
        return; // needed fsr
    if (baseKey.match(/^[0-9]+$/))
        return; // don't remember why this was needed
    let finalKey = baseKey;
    while (finalKey in collection) {
        // if exact value is found already present, return now (no need for a duplicate entry)
        if (collection[finalKey] === value)
            return;
        finalKey += "_";
    }
    collection[finalKey] = value;
}
