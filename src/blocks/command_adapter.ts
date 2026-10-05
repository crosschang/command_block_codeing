/** MakeCode block input -> Minecraft command AST adapter. */
namespace MCFunctionBlocks {
    export function createSayCommand(message: string): MCFunctionAST.SayCommand {
        return MCFunctionAST.createSayCommand(message);
    }

    export function createMcFunctionCommand(functionId: string): MCFunctionAST.McFunctionCommand {
        return MCFunctionAST.createMcFunctionCommand(functionId);
    }
}
