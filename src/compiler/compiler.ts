/**
 * M0 Minecraft command compiler.
 *
 * AST -> command text / .mcfunction text
 */
namespace MCFunctionCompiler {
    export function compileCommand(command: MCFunctionAST.CommandNode): string {
        switch (command.kind) {
            case MCFunctionAST.CommandKind.Say:
                return compileSay(<MCFunctionAST.SayCommand>command);

            case MCFunctionAST.CommandKind.Raw:
                return (<MCFunctionAST.RawCommand>command).raw;

            default:
                return "";
        }
    }

    function compileSay(command: MCFunctionAST.SayCommand): string {
        return "say " + singleLine(command.message);
    }

    function singleLine(value: string): string {
        return value
            .split("\r\n").join(" ")
            .split("\r").join(" ")
            .split("\n").join(" ");
    }

    export function compileFunction(file: MCFunctionAST.FunctionFile): string {
        let result = "";

        for (let i = 0; i < file.lines.length; i++) {
            if (i > 0) {
                result = result + "\n";
            }

            const line = file.lines[i];

            if (line.kind == MCFunctionAST.FunctionLineKind.Empty) {
                // Keep the line empty.
            } else if (line.kind == MCFunctionAST.FunctionLineKind.Comment) {
                result = result + line.text;
            } else if (line.command) {
                result = result + compileCommand(line.command);
            }
        }

        return result;
    }
}
