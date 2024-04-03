export declare class ModuleInfo {
    constructor(data?: Partial<ModuleInfo>);
    id: number | string;
    name_short: string;
    name_long: string;
    exports: any;
}
export declare function GetModuleNameFromPath(path: string, asSingleSegmentName?: boolean): string;
export declare function GetModuleNameFromVarName(varName: string): string;
export declare function ParseModuleInfoFromModuleFuncs(moduleFuncs: {
    [key: string]: Function;
}, allModulesText: string): ModuleInfo[];
export declare function StoreValueWithUniqueName(collection: {
    [key: string]: any;
}, baseKey: string, value: any): void;
