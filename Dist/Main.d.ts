import { GetModuleNameFromPath, GetModuleNameFromVarName } from "./Utils";
export { GetModuleNameFromPath, GetModuleNameFromVarName };
export declare var allModulesText: string;
export declare var moduleIDs: {
    [key: string]: string | number;
};
export declare var moduleNames: {
    [key: number]: string;
};
export declare function ParseModuleData(forceRefresh?: boolean): void;
export declare function GetIDForModule(name: string): string | number;
export declare function Require(name: string): any;
