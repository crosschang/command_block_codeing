/**
 * Represents one .mcfunction file in Blocks/JavaScript.
 *
 * Converter meaning:
 *   FunctionFile.define("main", ...) -> functions/main.mcfunction
 *
 * Minecraft Education runtime preview:
 *   - top-level simple IDs can be triggered from chat
 *   - Command.mcFunction("id") resolves MakeCode-defined files here first
 *
 * This registry is PREVIEW ONLY.
 * The real export meaning remains a Minecraft .mcfunction file.
 */
//% color=#9966FF weight=95 icon="\uf15b"
namespace FunctionFile {
    let functionNames: string[] = [];
    let functionHandlers: (() => void)[] = [];

    /**
     * Define one mcfunction file.
     * The callback body becomes the command list for that file in Converter Edition.
     */
    //% blockId=function_file_define
    //% block="mcfunction file %name"
    //% name.shadow="text"
    //% name.defl="main"
    //% blockAllowMultiple=1
    export function define(name: string, handler: () => void): void {
        register(name, handler);

        // Keep the convenient direct chat preview used for simple function IDs.
        // Nested IDs such as sub/test are invoked reliably through Command.mcFunction().
        player.onChat(name, handler);

        // Runtime Preview guidance only.
        // Do not export this text to .mcfunction in Converter Edition.
        // For now, only the main entry prints the instruction so multiple
        // FunctionFile blocks do not spam the chat during deployment.
        if (name == "main") {
            player.say("MCFunction Preview: 채팅에 main 입력하여 테스트");
        }
    }

    /**
     * Runtime-preview resolver.
     * Returns true when the requested function is defined in this MakeCode project.
     */
    export function runPreview(name: string): boolean {
        for (let i = 0; i < functionNames.length; i++) {
            if (functionNames[i] == name) {
                functionHandlers[i]();
                return true;
            }
        }

        return false;
    }

    function register(name: string, handler: () => void): void {
        // If Blocks <-> JavaScript is refreshed, replace an existing definition
        // rather than keeping duplicate preview callbacks in our own registry.
        for (let i = 0; i < functionNames.length; i++) {
            if (functionNames[i] == name) {
                functionHandlers[i] = handler;
                return;
            }
        }

        functionNames.push(name);
        functionHandlers.push(handler);
    }
}
