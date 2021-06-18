export declare function GetModuleNameFromPath(path: string): string;
export declare function GetModuleNameFromVarName(varName: string): string;
export declare function ParseModuleEntriesFromAllModulesText(allModulesText: string): {
    moduleID: string | number;
    moduleName: string;
}[];
export declare function StoreValueWithUniqueName(collection: {
    [key: string]: any;
}, baseKey: string, value: any): void;
