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
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.ParseModuleData = ParseModuleData;
	exports.GetIDForModule = GetIDForModule;
	exports.Require = Require;
	var g = typeof window != "undefined" ? window : global;
	function MakeGlobal(props) {
	    for (var key in props) {
	        g[key] = props[key];
	    }
	}
	console.assert(g.webpackJsonp, "\"window.webpackJsonp\" must be set for webpack-runtime-require to function.");
	var webpackData_ = exports.webpackData_ = undefined; // needs to have different name, so that window.webpackData can be set (Chrome seems to have a bug, when name is shared)
	var webpackVersion = g.webpackJsonp.length == 2 ? 1 : 2;
	if (webpackVersion == 1) {
	    g.webpackJsonp([], { 0: function _(module, exports, __webpack_require__) {
	            exports.webpackData_ = webpackData_ = __webpack_require__;
	            //MakeGlobal({webpackData: webpackData_});
	            g.webpackData = webpackData_;
	        } });
	} else {
	    g.webpackJsonp([], { 123456: function _(module, exports, __webpack_require__) {
	            exports.webpackData_ = webpackData_ = __webpack_require__;
	            //MakeGlobal({webpackData: webpackData_});
	            g.webpackData = webpackData_;
	        } }, [123456]);
	}
	var allModulesText = exports.allModulesText = undefined;
	var moduleIDs = exports.moduleIDs = {};
	var moduleNames = exports.moduleNames = {};
	function ParseModuleData() {
	    if (allModulesText != null) return;
	    var moduleWrapperFuncs = Object.keys(webpackData_.m).map(function (moduleID) {
	        return webpackData_.m[moduleID];
	    });
	    exports.allModulesText = allModulesText = moduleWrapperFuncs.map(function (a) {
	        return a.toString();
	    }).join("\n\n\n");
	    var hasPathInfo = allModulesText.indexOf("__webpack_require__(/*! ") != -1;
	    // if has path-info embedded, just use that! (set using `webpackConfig.output.pathinfo: true`)
	    if (hasPathInfo) {
	        // these are examples of before and after webpack's transformation: (which the regex below finds the path-comment of)
	        // 		require("react-redux-firebase") => var _reactReduxFirebase = __webpack_require__(/*! react-redux-firebase */ 100);
	        // 		require("./Source/MyComponent") => var _MyComponent = __webpack_require__(/*! ./Source/MyComponent */ 200);
	        var regex = /__webpack_require__\(\/\*! ((?:.(?!\*))+) \*\/ ([0-9]+)\)/g;
	        var matches = [];
	        var match = void 0;
	        while (match = regex.exec(allModulesText)) {
	            matches.push(match);
	        }var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = matches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var _step$value = _slicedToArray(_step.value, 3),
	                    _ = _step$value[0],
	                    path = _step$value[1],
	                    id = _step$value[2];

	                var moduleName = path.match(/[^/]+\/?$/)[0]; // if ends with /, it's a folder-require (resolves to folder/index)
	                moduleIDs[moduleName] = parseInt(id);
	                moduleNames[parseInt(id)] = moduleName;
	                // also add module onto Require() function, using "_" as the delimiter instead of "-" (so shows in console auto-complete)
	                Require[moduleName.replace(/-/g, "_")] = webpackData_.c[id] ? webpackData_.c[id].exports : "[failed to retrieve module exports]";
	            }
	        } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion && _iterator.return) {
	                    _iterator.return();
	                }
	            } finally {
	                if (_didIteratorError) {
	                    throw _iteratorError;
	                }
	            }
	        }
	    } else {
	        // these are examples of before and after webpack's transformation: (which the regex below finds the var-name of)
	        // 		require("react-redux-firebase") => var _reactReduxFirebase = __webpack_require__(100);
	        // 		require("./Source/MyComponent") => var _MyComponent = __webpack_require__(200);
	        var _regex = /var ([a-zA-Z_]+) = __webpack_require__\(([0-9]+)\)/g;
	        var _matches = [];
	        var _match = void 0;
	        while (_match = _regex.exec(allModulesText)) {
	            _matches.push(_match);
	        }var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = _matches[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var _step2$value = _slicedToArray(_step2.value, 3),
	                    _ = _step2$value[0],
	                    varName = _step2$value[1],
	                    id = _step2$value[2];

	                // these are examples of before and after the below regex's transformation:
	                // 		_reactReduxFirebase => react-redux-firebase
	                // 		_MyComponent => my-component
	                // 		_MyComponent_New => my-component-new
	                // 		_JSONHelper => json-helper
	                var _moduleName = varName.replace(/^_/g, "") // remove starting "_"
	                .replace(new RegExp( // convert chars where:
	                "([^_])" // is preceded by a non-underscore char
	                + "[A-Z]" // is a capital-letter
	                + "([^A-Z_])", // is followed by a non-capital-letter, non-underscore char
	                "g"), function (str) {
	                    return str[0] + "-" + str[1] + str[2];
	                } // to: "-" + char
	                ).replace(/_/g, "-") // convert all "_" to "-"
	                .toLowerCase(); // convert all letters to lowercase
	                moduleIDs[_moduleName] = parseInt(id);
	                moduleNames[parseInt(id)] = _moduleName;
	                // also add module onto Require() function, using "_" as the delimiter instead of "-" (so shows in console auto-complete)
	                Require[_moduleName.replace(/-/g, "_")] = webpackData_.c[id] ? webpackData_.c[id].exports : "[failed to retrieve module exports]";
	            }
	        } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                    _iterator2.return();
	                }
	            } finally {
	                if (_didIteratorError2) {
	                    throw _iteratorError2;
	                }
	            }
	        }
	    }
	    MakeGlobal({ allModulesText: allModulesText, moduleIDs: moduleIDs, moduleNames: moduleNames });
	}
	MakeGlobal({ GetIDForModule: GetIDForModule });
	function GetIDForModule(name) {
	    ParseModuleData();
	    return moduleIDs[name];
	}
	MakeGlobal({ Require: Require });
	function Require(name) {
	    var id = GetIDForModule(name);
	    return webpackData_.c[id] ? webpackData_.c[id].exports : "[failed to retrieve module exports]";
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
});
;