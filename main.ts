/**
 * command_block_codeing
 *
 * M0 SAY bidirectional round-trip POC.
 *
 * Current verified architecture target:
 * MakeCode Block -> Block Adapter -> AST -> Compiler -> .mcfunction text
 * .mcfunction text -> Parser -> AST -> Block Adapter -> block-compatible value
 *
 * Actual host Blockly workspace insertion and physical file import/export are
 * intentionally the next capability test, not faked in this layer.
 */

//% color=#4C97FF weight=100 icon="\uf1b2"
//% groups=['SAY 왕복 POC', '테스트']
namespace MCFunction {
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
     * Empty string means that no supported SAY command was found.
     */
    //% block="mcfunction에서 첫 SAY 메시지 읽기 %source"
    //% source.shadow="text"
    //% source.defl="say Hello World"
    //% group="SAY 왕복 POC"
    export function firstSayMessage(source: string): string {
        return MCFunctionParser.firstSayMessage(source);
    }

    /**
     * Parse and compile a complete .mcfunction text again.
     * SAY becomes structured AST; comments, blanks and unsupported commands
     * are preserved by the M0 Raw fallback.
     */
    //% block="mcfunction SAY 왕복 %source"
    //% source.shadow="text"
    //% source.defl="say Hello World"
    //% group="SAY 왕복 POC"
    export function roundTripMcfunction(source: string): string {
        const file = MCFunctionParser.parseFunction(source);
        return MCFunctionCompiler.compileFunction(file);
    }

    /**
     * Count SAY commands parsed as structured AST nodes.
     */
    //% block="mcfunction의 SAY 개수 %source"
    //% source.shadow="text"
    //% source.defl="say one\nsay two"
    //% group="테스트"
    export function countSay(source: string): number {
        return MCFunctionParser.countSayCommands(source);
    }

    /**
     * Compile SAY through AST/Compiler and execute the generated command.
     * This is only an M0 smoke-test helper.
     */
    //% block="컴파일한 SAY 실행 %message"
    //% message.shadow="text"
    //% message.defl="Hello World"
    //% group="테스트"
    export function testRunCompiledSay(message: string): void {
        const command = sayToMcfunction(message);
        player.execute(command);
    }
}
