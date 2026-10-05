/**
 * COMMAND blocks.
 *
 * Runtime preview and Converter export share the same compiler output:
 * Block -> AST -> Compiler -> command string
 */
//% color=#4C97FF weight=100 icon="\uf1b2"
namespace Command {
    function executeCommand(command: MCFunctionAST.CommandNode): void {
        let issues = MCFunctionValidator.validateCommand(command);

        if (MCFunctionValidator.hasError(issues)) {
            if (issues.length > 0) {
                player.say("Command Error: " + issues[0].message);
            }
            return;
        }

        let compiled = MCFunctionCompiler.compileCommand(command);
        if (compiled.length > 0) {
            player.execute(compiled);
        }
    }

    /** Execute a Minecraft `say` command. */
    //% blockId=command_say
    //% block="SAY %message"
    //% message.shadow="text"
    //% message.defl="Hello World"
    export function say(message: string): void {
        let command = MCFunctionBlocks.createSayCommand(message);
        executeCommand(command);
    }

    /** Execute another mcfunction by function ID. */
    //% blockId=command_mcfunction
    //% block="MCFUNCTION %functionId"
    //% functionId.shadow="text"
    //% functionId.defl="sub/test"
    export function mcFunction(functionId: string): void {
        let command = MCFunctionBlocks.createMcFunctionCommand(functionId);
        executeCommand(command);
    }
}
