/**
 * Block Adapter for the visible COMMAND -> SAY block.
 *
 * MakeCode UI values are converted to the command AST here. The visible block
 * definition remains in custom.ts so the tested Blocks <-> JavaScript shape is
 * not changed.
 */
namespace CommandBlockAdapter {
    export function say(message: string): CommandAST.SayCommand {
        return CommandAST.createSay(message)
    }
}
