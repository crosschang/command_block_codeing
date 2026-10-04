/**
 * command_block_codeing
 *
 * M0-1: Command category + SAY block only.
 *
 * Current verification target:
 * 1. Command category appears in Minecraft MakeCode.
 * 2. SAY block appears and accepts text.
 * 3. Blocks -> JavaScript -> Blocks keeps the block.
 * 4. The message is printed in Minecraft Education.
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
        player.say(message)
    }
}
