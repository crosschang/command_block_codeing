/**
 * M0 Block Adapter for say.
 *
 * MakeCode block input -> AST
 * AST -> block-compatible primitive value
 */
namespace MCFunctionBlockAdapter {
    export function sayFromBlock(message: string): MCFunctionAST.SayCommand {
        return MCFunctionAST.createSayCommand(message);
    }

    export function sayMessageForBlock(command: MCFunctionAST.SayCommand): string {
        return command.message;
    }
}
