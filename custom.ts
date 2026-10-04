/**
 * command_block_codeing
 *
 * M0-2: tested COMMAND -> SAY block + minimal AST/Adapter/Compiler wiring.
 *
 * IMPORTANT:
 * - Keep the visible block shape and blockId stable.
 * - main.ts is the user's MakeCode workspace source; block APIs live here.
 */

//% color=#4C97FF weight=100 icon="\uf1b2"
namespace Command {
    /**
     * Says a message in Minecraft chat.
     */
    //% blockId=command_say
    //% block="SAY %message"
    //% message.shadow="text"
    //% message.defl="Hello World"
    export function say(message: string): void {
        // Build the same command through the Core pipeline without changing
        // the already-tested in-game SAY behavior.
        sayToMcfunction(message)
        player.say(message)
    }

    /**
     * Converts a SAY block value to a single .mcfunction command line.
     *
     * This function intentionally has no block annotation in M0-2; it is a
     * JavaScript/Core API used to verify the compiler while the visible SAY
     * block remains unchanged.
     */
    export function sayToMcfunction(message: string): string {
        const command = CommandBlockAdapter.say(message)
        return CommandCompiler.compileSay(command)
    }
}
