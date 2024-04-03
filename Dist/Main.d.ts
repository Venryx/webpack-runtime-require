import { GetModuleNameFromPath, GetModuleNameFromVarName, ModuleInfo } from "./Utils.js";
export { GetModuleNameFromPath, GetModuleNameFromVarName };
export declare function Init(opts: {
    __webpack_require__: any;
    __webpack_modules__: any;
    __webpack_module_cache__: any;
}): void;
export declare class WRR {
    static main: WRR;
    constructor();
    webpackData: {
        requireFunc: Function;
        modules: {
            [key: string]: Function;
        };
        moduleCache: {
            [key: string]: {
                id: string;
                exports: any;
                loaded: boolean;
            };
        };
    };
    AddWebpackData: (data: {
        __webpack_require__;
        __webpack_modules__;
        __webpack_module_cache__;
    }) => void;
    allModulesCode: string;
    modules: ModuleInfo[];
    modules_byID: {
        [key: string]: ModuleInfo;
    };
    modules_byLongName: {
        [key: string]: ModuleInfo;
    };
    modules_byShortName: {
        [key: string]: ModuleInfo;
    };
    /** module.name_long -> module.exports */
    moduleExports: {
        [key: string]: any;
    };
    /** module.name_short -> module.exports */
    moduleExports_byShortName: {
        [key: string]: any;
    };
    /** The result of combining `module.exports` of every module into one collection. [key clashes have "_" appended] */
    moduleExports_flat: {
        [key: string]: any;
    };
    ParseModuleData: (forceRefresh?: boolean) => void;
    AddModuleEntry: (module: ModuleInfo) => void;
    GetModuleExports: (moduleID: number | string, allowImportNew?: boolean) => any;
    GetIDForModule: (name: string) => string | number;
    Start: (forceRefresh?: boolean) => void;
    Module: (name?: string, opts?: {
        allowImportNew: boolean;
    }) => any;
    Require: (name?: string, opts?: {
        allowImportNew: boolean;
    }) => any;
    Export: (name?: string) => any;
}
export declare const wrr: WRR;
declare var __webpack_require__: any, __webpack_modules__: any, __webpack_module_cache__: any;
