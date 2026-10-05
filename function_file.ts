/**
 * Represents one .mcfunction file in Blocks/JavaScript.
 *
 * Converter meaning:
 *   FunctionFile.define("main", ...) -> functions/main.mcfunction
 *
 * Minecraft Education runtime preview:
 *   typing `main` in chat runs the nested blocks.
 */
//% color=#9966FF weight=95 icon="\uf15b"
namespace FunctionFile {
    /**
     * Define one mcfunction file.
     * The callback body becomes the command list for that file in Converter Edition.
     */
    //% blockId=function_file_define
    //% block="mcfunction file %name"
    //% name.shadow="text"
    //% name.defl="main"
    //% handlerStatement=1
    export function define(name: string, handler: () => void): void {
        player.onChat(name, handler);
    }
}
