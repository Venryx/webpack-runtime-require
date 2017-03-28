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

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.GetIDForModule = GetIDForModule;
	exports.Require = Require;
	var g = window;
	function MakeGlobal(props) {
	    for (var key in props) {
	        g[key] = props[key];
	    }
	}
	var WebpackData = exports.WebpackData = undefined;
	MakeGlobal({ WebpackData: WebpackData });
	g.webpackJsonp([], { 0: function _(module, exports, __webpack_require__) {
	        exports.WebpackData = WebpackData = __webpack_require__;
	    } }, [0]);
	var allModulesText = exports.allModulesText = undefined;
	MakeGlobal({ allModulesText: allModulesText });
	var moduleIDs = exports.moduleIDs = {};
	MakeGlobal({ moduleIDs: moduleIDs });
	function GetIDForModule(name) {
	    if (allModulesText == null) {
	        var moduleWrapperFuncs = Object.keys(WebpackData.m).map(function (moduleID) {
	            return WebpackData.m[moduleID];
	        });
	        exports.allModulesText = allModulesText = moduleWrapperFuncs.map(function (a) {
	            return a.toString();
	        }).join("\n\n\n");
	        MakeGlobal({ allModulesText: allModulesText });
	        // these are examples of before and after webpack's transformation: (which the regex below finds the var-name of)
	        // 		require("react-redux-firebase") => var _reactReduxFirebase = __webpack_require__(100);
	        // 		require("./Source/MyComponent") => var _MyComponent = __webpack_require__(200);
	        var regex = /var ([a-zA-Z_]+) = __webpack_require__\(([0-9]+)\)/g;
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
	                    varName = _step$value[1],
	                    id = _step$value[2];

	                // these are examples of before and after the below regex's transformation:
	                // 		_reactReduxFirebase => react-redux-firebase
	                // 		_MyComponent => my-component
	                // 		_MyComponent_New => my-component-new
	                // 		_JSONHelper => json-helper
	                var moduleName = varName.replace(/^_/g, "") // remove starting "_"
	                .replace(new RegExp( // convert chars where:
	                "(?<!(^|_))" // is not preceded by a start-of-line or underscore
	                + "[A-Z]" // is a capital-letter
	                + "(?![A-Z_])", // is not followed by a capital-letter or underscore
	                "g"), function (ch) {
	                    return "-" + ch;
	                } // to: "-" + char
	                ).replace(/_/g, "-") // convert all "_" to "-"
	                .toLowerCase(); // convert all letters to lowercase
	                moduleIDs[moduleName] = parseInt(id);
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
	    }
	    return moduleIDs[name];
	}
	MakeGlobal({ GetIDForModule: GetIDForModule });
	function Require(name) {
	    var id = GetIDForModule(name);
	    return WebpackData.c[id].exports;
	}
	MakeGlobal({ Require: Require });

/***/ }
/******/ ])
});
;