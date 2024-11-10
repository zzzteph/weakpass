import { PluginOption } from "vite";
export type Config = {
    useRecommendedBuildConfig?: boolean;
    removeViteModuleLoader?: boolean;
    inlinePattern?: string[];
    deleteInlinedFiles?: boolean;
};
export declare function replaceScript(html: string, scriptFilename: string, scriptCode: string, removeViteModuleLoader?: boolean): string;
export declare function replaceCss(html: string, scriptFilename: string, scriptCode: string): string;
export declare function viteSingleFile({ useRecommendedBuildConfig, removeViteModuleLoader, inlinePattern, deleteInlinedFiles, }?: Config): PluginOption;
