(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8080/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.moduleNames = exports.moduleIDs = exports.allModulesText = exports.GetModuleNameFromVarName = exports.GetModuleNameFromPath = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.ParseModuleData = ParseModuleData;
	exports.GetIDForModule = GetIDForModule;
	exports.Require = Require;

	var _Utils = __webpack_require__(2);

	exports.GetModuleNameFromPath = _Utils.GetModuleNameFromPath;
	exports.GetModuleNameFromVarName = _Utils.GetModuleNameFromVarName;

	var g = typeof window != "undefined" ? window : global;
	function MakeGlobal(props) {
	    for (var key in props) {
	        g[key] = props[key];
	    }
	}
	// if webpack-data was not explicitly specified prior to library import, try to find the data
	if (g.webpackData == null) {
	    // if included using `module: "src/Main.ts"`, we can access webpack-data directly
	    if (typeof __webpack_require__ != "undefined" && __webpack_require__.m.length > 2) {
	        g.webpackData = __webpack_require__;
	    } else if (g.webpackJsonp) {
	        var webpackVersion = g.webpackJsonp.length == 2 ? 1 : 2;
	        if (webpackVersion == 1) {
	            g.webpackJsonp([], { 0: function _(module, exports, __webpack_require__) {
	                    g.webpackData = __webpack_require__;
	                } });
	        } else {
	            g.webpackJsonp([], { 123456: function _(module, exports, __webpack_require__) {
	                    g.webpackData = __webpack_require__;
	                } }, [123456]);
	        }
	    } else {
	        throw new Error("window.webpackData must be set for webpack-runtime-require to function." + "\n" + "You can do so either by setting it directly (to __webpack_require__), or by making window.webpackJsonp available. (eg. using CommonsChunkPlugin)");
	    }
	}
	var allModulesText = exports.allModulesText = undefined;
	var moduleIDs = exports.moduleIDs = {};
	var moduleNames = exports.moduleNames = {};
	function ParseModuleData() {
	    var forceRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	    if (allModulesText != null && !forceRefresh) return;
	    var moduleWrapperFuncs = Object.keys(g.webpackData.m).map(function (moduleID) {
	        return g.webpackData.m[moduleID];
	    });
	    exports.allModulesText = allModulesText = moduleWrapperFuncs.map(function (a) {
	        return a.toString();
	    }).join("\n\n\n").replace(/\\"/g, "\"");
	    // these are examples of before and after webpack's transformation: (which the regex below finds the path of)
	    // 		require("jquery") => __webpack_require__("jquery")
	    var requiresWithPathsRegex = /__webpack_require__\([^")]*"(.+?)"\)/g;
	    // these are examples of before and after webpack's transformation: (which the regex below finds the path-comment of)
	    // 		require("react-redux-firebase") => var _reactReduxFirebase = __webpack_require__(/*! react-redux-firebase */ 100);
	    // 		require("./Source/MyComponent") => var _MyComponent = __webpack_require__(/*! ./Source/MyComponent */ 200);
	    var requiresWithPathCommentsRegex = /__webpack_require__\(\/\*! ((?:.(?!\*))+) \*\/ ([0-9]+)\)/g;
	    // if requires themselves are by-path, just use that (set using [config.mode: "development"] or [config.optimization.namedModules: true])
	    if (allModulesText.match(requiresWithPathsRegex)) {
	        for (var match; match = requiresWithPathsRegex.exec(allModulesText);) {
	            var _match = match,
	                _match2 = _slicedToArray(_match, 2),
	                _ = _match2[0],
	                path = _match2[1];

	            AddModuleEntry(path, (0, _Utils.GetModuleNameFromPath)(path));
	        }
	    }
	    // if requires have path-info embedded, just use that (set using [webpackConfig.output.pathinfo: true])
	    if (allModulesText.match(requiresWithPathCommentsRegex)) {
	        for (var _match3; _match3 = requiresWithPathCommentsRegex.exec(allModulesText);) {
	            var _match4 = _match3,
	                _match5 = _slicedToArray(_match4, 3),
	                _ = _match5[0],
	                path = _match5[1],
	                idStr = _match5[2];

	            AddModuleEntry(parseInt(idStr), (0, _Utils.GetModuleNameFromPath)(path));
	        }
	    }
	    // else, infer it from the var-names of the imports
	    if (!allModulesText.match(requiresWithPathsRegex) && !allModulesText.match(requiresWithPathCommentsRegex)) {
	        // these are examples of before and after webpack's transformation: (which the regex below finds the var-name of)
	        // 		require("react-redux-firebase") => var _reactReduxFirebase = __webpack_require__(100);
	        // 		require("./Source/MyComponent") => var _MyComponent = __webpack_require__(200);
	        var regex = /var ([a-zA-Z_]+) = __webpack_require__\(([0-9]+)\)/g;
	        for (var _match6; _match6 = regex.exec(allModulesText);) {
	            var _match7 = _match6,
	                _match8 = _slicedToArray(_match7, 3),
	                _ = _match8[0],
	                varName = _match8[1],
	                idStr = _match8[2];

	            AddModuleEntry(parseInt(idStr), (0, _Utils.GetModuleNameFromVarName)(varName));
	        }
	    }
	    MakeGlobal({ allModulesText: allModulesText, moduleIDs: moduleIDs, moduleNames: moduleNames });
	}
	function AddModuleEntry(moduleID, moduleName) {
	    moduleIDs[moduleName] = moduleID;
	    moduleNames[moduleID] = moduleName;
	    var moduleName_simple = moduleName.replace(/-/g, "_"); // (so shows in console auto-complete)
	    Require[moduleName_simple] = GetModuleExports(moduleID); // also add module onto Require() function
	}
	function GetModuleExports(moduleID) {
	    return g.webpackData.c[moduleID] ? g.webpackData.c[moduleID].exports : "[failed to retrieve module exports]";
	}
	MakeGlobal({ GetIDForModule: GetIDForModule });
	function GetIDForModule(name) {
	    ParseModuleData();
	    return moduleIDs[name];
	}
	MakeGlobal({ Require: Require });
	function Require(name) {
	    if (name === undefined) return void ParseModuleData();
	    var id = GetIDForModule(name);
	    if (id == null) return "[could not find the given module]";
	    return g.webpackData.c[id] ? g.webpackData.c[id].exports : "[failed to retrieve module exports]";
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.GetModuleNameFromPath = GetModuleNameFromPath;
	exports.GetModuleNameFromVarName = GetModuleNameFromVarName;
	function GetModuleNameFromPath(path) {
	    var parts = path.split("/");
	    // last part might be empty, so find last part with content (path might end with /, if it's a folder-require -- which resolves to folder/index)
	    var lastPartWithContent = parts[parts.length - 1] || parts[parts.length - 2];
	    return lastPartWithContent.replace(/\.[^.]+/, ""); // remove extension
	}
	function GetModuleNameFromVarName(varName) {
	    // these are examples of before and after the below transformation code:
	    // 		_reactReduxFirebase => react-redux-firebase
	    // 		_MyComponent => my-component
	    // 		_MyComponent_New => my-component-new
	    // 		_JSONHelper => json-helper
	    var moduleName = varName.replace(/^_/g, "") // remove starting "_"
	    .replace(new RegExp( // convert chars where:
	    "([^_])" // is preceded by a non-underscore char
	    + "[A-Z]" // is a capital-letter
	    + "([^A-Z_])", // is followed by a non-capital-letter, non-underscore char
	    "g"), function (str) {
	        return str[0] + "-" + str[1] + str[2];
	    } // to: "-" + char
	    ).replace(/_/g, "-") // convert all "_" to "-"
	    .toLowerCase(); // convert all letters to lowercase
	    return moduleName;
	}

/***/ }
/******/ ])
});
;