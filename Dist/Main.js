import { GetModuleNameFromPath, GetModuleNameFromVarName, ParseModuleInfoFromModuleFuncs as ParseModuleInfoFromModuleFuncs, StoreValueWithUniqueName } from "./Utils.js";
export { GetModuleNameFromPath, GetModuleNameFromVarName };
// convenience/stable-api function
export function Init(opts) {
    WRR.main.AddWebpackData(opts);
}
export class WRR {
    constructor() {
        var _a;
        // func for supplying webpack-data; preferably user will call this function directly (as seen in readme), to ensure the special variables are accessible
        this.AddWebpackData = (data) => {
            var _a, _b;
            this.webpackData = {
                requireFunc: data.__webpack_require__,
                modules: (_a = data.__webpack_modules__) !== null && _a !== void 0 ? _a : data.__webpack_require__.m,
                moduleCache: (_b = data.__webpack_module_cache__) !== null && _b !== void 0 ? _b : data.__webpack_require__.c,
            };
            if (this.webpackData.requireFunc == null)
                console.warn("webpackData.requireFunc is null! webpack-runtime-require needs this to function.");
            if (this.webpackData.modules == null)
                console.warn("webpackData.modules is null! webpack-runtime-require needs this to function.");
            if (this.webpackData.moduleCache == null)
                console.warn("webpackData.moduleCache is null! webpack-runtime-require needs this to function.");
            /*if (this.webpackData.modules?.length <= 2) {
                console.warn("webpackData.modules appears to have 2 or fewer modules. Did you call Init(...) from the correct chunk?")
            }*/
        };
        this.modules = [];
        this.modules_byID = {};
        this.modules_byLongName = {};
        this.modules_byShortName = {};
        /** module.name_long -> module.exports */
        this.moduleExports = {};
        /** module.name_short -> module.exports */
        this.moduleExports_byShortName = {};
        /** The result of combining `module.exports` of every module into one collection. [key clashes have "_" appended] */
        this.moduleExports_flat = {};
        this.ParseModuleData = (forceRefresh = false) => {
            if (this.allModulesCode != null && !forceRefresh)
                return;
            //let moduleWrapperFuncs = Object.keys(this.webpackData.modules).map(moduleID=>this.webpackData.modules[moduleID]);
            let moduleFuncs_flat = Object.values(this.webpackData.modules);
            this.allModulesCode = moduleFuncs_flat.map(a => a.toString()).join("\n\n\n").replace(/\\"/g, `"`);
            const modules = ParseModuleInfoFromModuleFuncs(this.webpackData.modules, this.allModulesCode);
            for (const module of modules) {
                module.exports = this.GetModuleExports(module.id);
                this.AddModuleEntry(module);
            }
        };
        this.AddModuleEntry = (module) => {
            this.modules.push(module);
            this.modules_byID[module.id] = module;
            this.modules_byLongName[module.name_long] = module;
            this.modules_byShortName[module.name_short] = module;
            StoreValueWithUniqueName(this.moduleExports, module.name_long, module.exports);
            StoreValueWithUniqueName(this.moduleExports_byShortName, module.name_short, module.exports);
            if (typeof module.exports == "string" && module.exports.startsWith("[module exports not found;"))
                return;
            // store the module's individual exports on the global "moduleExports_flat" collection
            for (const [key, value] of Object.entries(module.exports)) {
                StoreValueWithUniqueName(this.moduleExports_flat, key, value);
            }
            //let defaultExport = moduleExports.default || moduleExports;
            if (module.exports.default != null) {
                StoreValueWithUniqueName(this.moduleExports_flat, module.name_short, module.exports.default);
            }
        };
        this.GetModuleExports = (moduleID, allowImportNew = false) => {
            var _a, _b;
            if (this.webpackData.moduleCache[moduleID] == null && allowImportNew) {
                // haven't checked if this actually works yet (anyway it's disabled by default)
                this.webpackData.requireFunc(moduleID);
            }
            return (_b = (_a = this.webpackData.moduleCache[moduleID]) === null || _a === void 0 ? void 0 : _a.exports) !== null && _b !== void 0 ? _b : "[module exports not found; this module has probably not yet been imported/run]";
        };
        this.GetIDForModule = (name) => {
            var _a, _b;
            this.ParseModuleData();
            return (_b = ((_a = this.modules_byLongName[name]) !== null && _a !== void 0 ? _a : this.modules_byShortName[name])) === null || _b === void 0 ? void 0 : _b.id;
        };
        // WRR high-level functions
        // ==========
        this.Start = this.ParseModuleData; // convenience alias
        this.Module = (name, opts) => {
            this.ParseModuleData();
            if (name === undefined)
                return;
            let id = this.GetIDForModule(name);
            if (id == null)
                return "[could not find the given module]";
            return this.GetModuleExports(id, opts === null || opts === void 0 ? void 0 : opts.allowImportNew);
        };
        this.Require = this.Module; // legacy alias
        this.Export = (name) => {
            this.ParseModuleData();
            if (name === undefined)
                return;
            return this.moduleExports[name];
        };
        WRR.main = (_a = WRR.main) !== null && _a !== void 0 ? _a : this;
    }
}
export const wrr = new WRR();
// make library's data-store singleton accessible on window/global
globalThis.wrr = wrr;
if (typeof __webpack_require__ != "undefined") {
    WRR.main.AddWebpackData({
        __webpack_require__,
        __webpack_modules__: typeof __webpack_modules__ != "undefined" ? __webpack_modules__ : null,
        __webpack_module_cache__: typeof __webpack_module_cache__ != "undefined" ? __webpack_module_cache__ : null,
    });
}
