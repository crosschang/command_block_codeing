/**
 * command_block_codeing
 *
 * M0 SAY bidirectional round-trip POC v2.
 *
 * Core:
 * MakeCode Block -> Block Adapter -> AST -> Compiler -> .mcfunction text
 * .mcfunction text -> Parser -> AST -> MakeCode TypeScript source
 *
 * v2 capability test:
 * generated MakeCode TypeScript uses the public MCFunction.sayCommand(...)
 * API so the native MakeCode JavaScript -> Blocks decompiler can recreate
 * the custom SAY block after the source is placed in the editor.
 *
 * Direct host Blockly workspace mutation is NOT implemented here.
 */

//% color=#4C97FF weight=100 icon="\uf1b2"
//% groups=['SAY 명령', 'SAY 왕복 POC', '테스트']
namespace MCFunction {
    /**
     * Real statement block used as the decompiler target for imported SAY.
     *
     * JavaScript:
     *   MCFunction.sayCommand("Hello World");
     *
     * should decompile back to this MakeCode block.
     */
    //% blockId=mcfunction_say_command
    //% block="SAY %message"
    //% message.shadow="text"
    //% message.defl="Hello World"
    //% group="SAY 명령"
    //% weight=100
    export function sayCommand(message: string): void {
        const ast = MCFunctionBlockAdapter.sayFromBlock(message);
        const command = MCFunctionCompiler.compileCommand(ast);
        player.execute(command);
    }

    /**
     * Compile one MakeCode SAY block input into one .mcfunction command line.
     */
    //% block="SAY %message → mcfunction"
    //% message.shadow="text"
    //% message.defl="Hello World"
    //% group="SAY 왕복 POC"
    export function sayToMcfunction(message: string): string {
        const ast = MCFunctionBlockAdapter.sayFromBlock(message);
        return MCFunctionCompiler.compileCommand(ast);
    }

    /**
     * Parse .mcfunction text and return the first structured SAY message.
     */
    //% block="mcfunction에서 첫 SAY 메시지 읽기 %source"
    //% source.shadow="text"
    //% source.defl="say Hello World"
    //% group="SAY 왕복 POC"
    export function firstSayMessage(source: string): string {
        return MCFunctionParser.firstSayMessage(source);
    }

    /**
     * Convert supported SAY lines from .mcfunction text into MakeCode
     * TypeScript source. Paste the generated source into JavaScript and
     * switch back to Blocks to test the native decompiler path.
     */
    //% block="mcfunction → MakeCode JavaScript %source"
    //% source.shadow="text"
    //% source.defl="say Hello World"
    //% group="SAY 왕복 POC"
    export function mcfunctionToMakeCodeJavaScript(source: string): string {
        return MCFunctionMakeCodeSource.mcfunctionToMakeCode(source);
    }

    /**
     * Parse and compile a complete .mcfunction text again.
     */
    //% block="mcfunction SAY 왕복 %source"
    //% source.shadow="text"
    //% source.defl="say Hello World"
    //% group="SAY 왕복 POC"
    export function roundTripMcfunction(source: string): string {
        const file = MCFunctionParser.parseFunction(source);
        return MCFunctionCompiler.compileFunction(file);
    }

    /** Count SAY commands parsed as structured AST nodes. */
    //% block="mcfunction의 SAY 개수 %source"
    //% source.shadow="text"
    //% source.defl="say one\nsay two"
    //% group="테스트"
    export function countSay(source: string): number {
        return MCFunctionParser.countSayCommands(source);
    }

    /**
     * Show generated MakeCode source in Minecraft chat, one generated line at
     * a time. This helper is only for the M0 capability test.
     */
    //% block="변환된 MakeCode 코드 채팅으로 보기 %source"
    //% source.shadow="text"
    //% source.defl="say Hello World"
    //% group="테스트"
    export function showGeneratedMakeCode(source: string): void {
        const generated = mcfunctionToMakeCodeJavaScript(source);
        const lines = generated.split("\n");

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length > 0) {
                player.say(lines[i]);
            }
        }
    }
}
