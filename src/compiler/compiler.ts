/** Minecraft command compiler: AST -> .mcfunction command line. */
namespace MCFunctionCompiler {
    export function compileCommand(command: MCFunctionAST.CommandNode): string {
        switch (command.kind) {
            case MCFunctionAST.CommandKind.Say:
                return compileSay(<MCFunctionAST.SayCommand>command);

            case MCFunctionAST.CommandKind.McFunction:
                return compileMcFunction(<MCFunctionAST.McFunctionCommand>command);

            default:
                return "";
        }
    }

    function compileSay(command: MCFunctionAST.SayCommand): string {
        return "say " + command.message;
    }

    function compileMcFunction(command: MCFunctionAST.McFunctionCommand): string {
        return "function " + command.functionId;
    }
}
