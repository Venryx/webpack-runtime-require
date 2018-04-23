export declare var allModulesText: string;
export declare var moduleIDs: {
    [key: string]: string | number;
};
export declare var moduleNames: {
    [key: number]: string;
};
export declare function ParseModuleData(): void;
export declare function GetIDForModule(name: string): string | number;
export declare function Require(name: string): any;
