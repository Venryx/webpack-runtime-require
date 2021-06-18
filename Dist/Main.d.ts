import { GetModuleNameFromPath, GetModuleNameFromVarName } from "./Utils.js";
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
    moduleIDs: {
        [key: string]: string | number;
    };
    moduleNames: {
        [key: number]: string;
    };
    moduleExports: {
        [key: string]: any;
    };
    moduleExports_flat: {
        [key: string]: any;
    };
    ParseModuleData: (forceRefresh?: boolean) => void;
    Start: (forceRefresh?: boolean) => void;
    AddModuleEntry: (moduleID: string | number, moduleName: string) => void;
    GetModuleExports: (moduleID: number | string, allowImportNew?: boolean) => any;
    GetIDForModule: (name: string) => string | number;
    Require: (name?: string, opts?: {
        allowImportNew: boolean;
    }) => any;
}
export declare const wrr: WRR;
declare var __webpack_require__: any, __webpack_modules__: any, __webpack_module_cache__: any;
