import {GetModuleNameFromPath, GetModuleNameFromVarName, ModuleInfo, ParseModuleInfoFromModuleFuncs as ParseModuleInfoFromModuleFuncs, StoreValueWithUniqueName} from "./Utils.js";
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

	// webpack data-structures/functions
	// ==========

	// custom construct to standardize data access across webpack versions
	webpackData: {
		requireFunc: Function; // the "__webpack_require__" object; in wp v<5, this contains the "modules" and "moduleCache" fields as well (as "m" and "c")
		modules: {[key: string]: Function}; // the "__webpack_modules__" object, in wp 5+ 
		moduleCache: {[key: string]: {id: string; exports: any; loaded: boolean}}; // the "__webpack_module_cache__" object, in wp 5+
	};

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

	// WRR data-structures, and low-level functions
	// ==========

	allModulesCode: string;
	modules = [] as ModuleInfo[];
	modules_byID = {} as {[key: string]: ModuleInfo};
	modules_byLongName = {} as {[key: string]: ModuleInfo};
	modules_byShortName = {} as {[key: string]: ModuleInfo};
	/** module.name_long -> module.exports */
	moduleExports = {} as {[key: string]: any};
	/** module.name_short -> module.exports */
	moduleExports_byShortName = {} as {[key: string]: any};
	/** The result of combining `module.exports` of every module into one collection. [key clashes have "_" appended] */
	moduleExports_flat = {} as {[key: string]: any};

	ParseModuleData = (forceRefresh = false)=>{
		if (this.allModulesCode != null && !forceRefresh) return;

		//let moduleWrapperFuncs = Object.keys(this.webpackData.modules).map(moduleID=>this.webpackData.modules[moduleID]);
		let moduleFuncs_flat = Object.values(this.webpackData.modules);
		this.allModulesCode = moduleFuncs_flat.map(a=>a.toString()).join("\n\n\n").replace(/\\"/g, `"`);

		const modules = ParseModuleInfoFromModuleFuncs(this.webpackData.modules, this.allModulesCode);
		for (const module of modules) {
			module.exports = this.GetModuleExports(module.id);
			this.AddModuleEntry(module);
		}
	}
	AddModuleEntry = (module: ModuleInfo)=>{
		this.modules.push(module);
		this.modules_byID[module.id] = module;
		this.modules_byLongName[module.name_long] = module;
		this.modules_byShortName[module.name_short] = module;
	
		StoreValueWithUniqueName(this.moduleExports, module.name_long, module.exports);
		StoreValueWithUniqueName(this.moduleExports_byShortName, module.name_short, module.exports);

		if (typeof module.exports == "string" && module.exports.startsWith("[module exports not found;")) return;

		// store the module's individual exports on the global "moduleExports_flat" collection
		for (const [key, value] of Object.entries(module.exports)) {
			StoreValueWithUniqueName(this.moduleExports_flat, key, value);
		}
		//let defaultExport = moduleExports.default || moduleExports;
		if (module.exports.default != null) {
			StoreValueWithUniqueName(this.moduleExports_flat, module.name_short, module.exports.default);
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
		return (this.modules_byLongName[name] ?? this.modules_byShortName[name])?.id;
	}

	// WRR high-level functions
	// ==========

	Start = this.ParseModuleData; // convenience alias
	Module = (name?: string, opts?: {allowImportNew: boolean})=>{
		this.ParseModuleData();
		if (name === undefined) return;
		let id = this.GetIDForModule(name);
		if (id == null) return "[could not find the given module]";
		return this.GetModuleExports(id, opts?.allowImportNew);
	};
	Require = this.Module; // legacy alias
	Export = (name?: string)=>{
		this.ParseModuleData();
		if (name === undefined) return;
		return this.moduleExports[name];
	};
}
export const wrr = new WRR();

// make library's data-store singleton accessible on window/global
globalThis.wrr = wrr;

// try to find the webpack-data automatically (if it's not accessible here directly, the user can supply the data manually using the Init function)
declare var __webpack_require__, __webpack_modules__, __webpack_module_cache__;
if (typeof __webpack_require__ != "undefined") {
	WRR.main.AddWebpackData({
		__webpack_require__,
		__webpack_modules__: typeof __webpack_modules__ != "undefined" ? __webpack_modules__ : null,
		__webpack_module_cache__: typeof __webpack_module_cache__ != "undefined" ? __webpack_module_cache__ : null,
	});
}