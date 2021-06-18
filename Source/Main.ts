import {GetModuleNameFromPath, GetModuleNameFromVarName, ParseModuleEntriesFromAllModulesText as ParseModuleEntriesFromAllModulesCode, StoreValueWithUniqueName} from "./Utils.js";
export {GetModuleNameFromPath, GetModuleNameFromVarName};

// convenience/stable-api function
export function Init(opts: {__webpack_require__, __webpack_modules__, __webpack_module_cache__}) {
	WRR.main.AddWebpackData(opts);
}

export class WRR {
	static main: WRR;
	constructor() {
		WRR.main = WRR.main ?? this;
	}

	// custom construct to standardize data access across webpack versions
	webpackData: {
		requireFunc: Function; // the "__webpack_require__" object; in wp v<5, this contains the "modules" and "moduleCache" fields as well (as "m" and "c")
		modules: {[key: string]: Function}; // the "__webpack_modules__" object, in wp 5+ 
		moduleCache: {[key: string]: {id: string; exports: any; loaded: boolean}}; // the "__webpack_module_cache__" object, in wp 5+
	};

	// wrr data-structures

	// func for supplying webpack-data; preferably user will call this function directly (as seen in readme), to ensure the special variables are accessible
	AddWebpackData = (data: {__webpack_require__, __webpack_modules__, __webpack_module_cache__})=>{
		this.webpackData = {
			requireFunc: data.__webpack_require__,
			modules: data.__webpack_modules__ ?? data.__webpack_require__.m,
			moduleCache: data.__webpack_module_cache__ ?? data.__webpack_require__.c,
		};
		if (this.webpackData.requireFunc == null) console.warn("webpackData.requireFunc is null! webpack-runtime-require needs this to function.");
		if (this.webpackData.modules == null) console.warn("webpackData.modules is null! webpack-runtime-require needs this to function.");
		if (this.webpackData.moduleCache == null) console.warn("webpackData.moduleCache is null! webpack-runtime-require needs this to function.");
		/*if (this.webpackData.modules?.length <= 2) {
			console.warn("webpackData.modules appears to have 2 or fewer modules. Did you call Init(...) from the correct chunk?")
		}*/
	}

	allModulesCode: string;
	moduleIDs = {} as {[key: string]: number | string};
	moduleNames = {} as {[key: number]: string};
	moduleExports = {} as {[key: string]: any};
	moduleExports_flat = {} as {[key: string]: any};
	ParseModuleData = (forceRefresh = false)=>{
		if (this.allModulesCode != null && !forceRefresh) return;

		//let moduleWrapperFuncs = Object.keys(this.webpackData.modules).map(moduleID=>this.webpackData.modules[moduleID]);
		let moduleWrapperFuncs = Object.values(this.webpackData.modules);
		this.allModulesCode = moduleWrapperFuncs.map(a=>a.toString()).join("\n\n\n").replace(/\\"/g, `"`);

		const moduleEntries = ParseModuleEntriesFromAllModulesCode(this.allModulesCode);
		for (const entry of moduleEntries) {
			this.AddModuleEntry(entry.moduleID, entry.moduleName);
		}

		// todo: either replace or augment the parsing-from-code system above with a parsing-from-webpack-module-cache system (the latter is much more simple/robust)
	}
	Start = this.ParseModuleData; // convenience alias
	AddModuleEntry = (moduleID: string | number, moduleName: string)=>{
		this.moduleIDs[moduleName] = moduleID;
		this.moduleNames[moduleID] = moduleName;

		const thisModuleExports = this.GetModuleExports(moduleID);
	
		// replace certain characters with underscores, so the module-entries can show in console auto-complete
		let moduleName_simple = moduleName.replace(/-/g, "_");
		StoreValueWithUniqueName(this.moduleExports, moduleName_simple, thisModuleExports);

		if (typeof thisModuleExports == "string" && thisModuleExports.startsWith("[module exports not found;")) return;

		// store the module's individual exports on the global "moduleExports_flat" collection
		for (const [key, value] of Object.entries(thisModuleExports)) {
			StoreValueWithUniqueName(this.moduleExports_flat, key, value);
		}
		//let defaultExport = moduleExports.default || moduleExports;
		if (thisModuleExports.default != null) {
			StoreValueWithUniqueName(this.moduleExports_flat, moduleName, thisModuleExports.default);
		}
	}
	GetModuleExports = (moduleID: number | string, allowImportNew = false)=>{
		if (this.webpackData.moduleCache[moduleID] == null && allowImportNew) {
			// haven't checked if this actually works yet (anyway it's disabled by default)
			this.webpackData.requireFunc(moduleID);
		}
		return this.webpackData.moduleCache[moduleID]?.exports ?? "[module exports not found; this module has probably not yet been imported/run]";
	}
	GetIDForModule = (name: string)=>{
		this.ParseModuleData();
		return this.moduleIDs[name];
	}

	// wrr functions
	Require = (name?: string, opts?: {allowImportNew: boolean})=>{
		if (name === undefined) {
			return void this.ParseModuleData();
		}
	
		let id = this.GetIDForModule(name);
		if (id == null) return "[could not find the given module]";
		return this.GetModuleExports(id, opts?.allowImportNew);
	};
}
export const wrr = new WRR();

// make library's data-store singleton accessible on window
declare var window, global;
var g = typeof window != "undefined" ? window : global;
g.wrr = wrr;

// try to find the webpack-data automatically (if it's not accessible here directly, the user can supply the data manually using the Init function)
declare var __webpack_require__, __webpack_modules__, __webpack_module_cache__;
if (typeof __webpack_require__ != "undefined") {
	WRR.main.AddWebpackData({
		__webpack_require__,
		__webpack_modules__: typeof __webpack_modules__ != "undefined" ? __webpack_modules__ : null,
		__webpack_module_cache__: typeof __webpack_module_cache__ != "undefined" ? __webpack_module_cache__ : null,
	});
}