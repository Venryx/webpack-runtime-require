import { GetModuleNameFromPath, GetModuleNameFromVarName, ParseModuleEntriesFromAllModulesText as ParseModuleEntriesFromAllModulesCode, StoreValueWithUniqueName } from "./Utils.js";
export { GetModuleNameFromPath, GetModuleNameFromVarName };
// convenience/stable-api function
export function Init(opts) {
    WRR.main.AddWebpackData(opts);
}
export class WRR {
    constructor() {
        var _a;
        // wrr data-structures
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
        this.moduleIDs = {};
        this.moduleNames = {};
        this.moduleExports = {};
        this.moduleExports_flat = {};
        this.ParseModuleData = (forceRefresh = false) => {
            if (this.allModulesCode != null && !forceRefresh)
                return;
            //let moduleWrapperFuncs = Object.keys(this.webpackData.modules).map(moduleID=>this.webpackData.modules[moduleID]);
            let moduleWrapperFuncs = Object.values(this.webpackData.modules);
            this.allModulesCode = moduleWrapperFuncs.map(a => a.toString()).join("\n\n\n").replace(/\\"/g, `"`);
            const moduleEntries = ParseModuleEntriesFromAllModulesCode(this.allModulesCode);
            for (const entry of moduleEntries) {
                this.AddModuleEntry(entry.moduleID, entry.moduleName);
            }
            // todo: either replace or augment the parsing-from-code system above with a parsing-from-webpack-module-cache system (the latter is much more simple/robust)
        };
        this.Start = this.ParseModuleData; // convenience alias
        this.AddModuleEntry = (moduleID, moduleName) => {
            this.moduleIDs[moduleName] = moduleID;
            this.moduleNames[moduleID] = moduleName;
            const thisModuleExports = this.GetModuleExports(moduleID);
            // replace certain characters with underscores, so the module-entries can show in console auto-complete
            let moduleName_simple = moduleName.replace(/-/g, "_");
            StoreValueWithUniqueName(this.moduleExports, moduleName_simple, thisModuleExports);
            if (typeof thisModuleExports == "string" && thisModuleExports.startsWith("[module exports not found;"))
                return;
            // store the module's individual exports on the global "moduleExports_flat" collection
            for (const [key, value] of Object.entries(thisModuleExports)) {
                StoreValueWithUniqueName(this.moduleExports_flat, key, value);
            }
            //let defaultExport = moduleExports.default || moduleExports;
            if (thisModuleExports.default != null) {
                StoreValueWithUniqueName(this.moduleExports_flat, moduleName, thisModuleExports.default);
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
            this.ParseModuleData();
            return this.moduleIDs[name];
        };
        // wrr functions
        this.Require = (name, opts) => {
            if (name === undefined) {
                return void this.ParseModuleData();
            }
            let id = this.GetIDForModule(name);
            if (id == null)
                return "[could not find the given module]";
            return this.GetModuleExports(id, opts === null || opts === void 0 ? void 0 : opts.allowImportNew);
        };
        WRR.main = (_a = WRR.main) !== null && _a !== void 0 ? _a : this;
    }
}
export const wrr = new WRR();
var g = typeof window != "undefined" ? window : global;
g.wrr = wrr;
if (typeof __webpack_require__ != "undefined") {
    WRR.main.AddWebpackData({
        __webpack_require__,
        __webpack_modules__: typeof __webpack_modules__ != "undefined" ? __webpack_modules__ : null,
        __webpack_module_cache__: typeof __webpack_module_cache__ != "undefined" ? __webpack_module_cache__ : null,
    });
}
