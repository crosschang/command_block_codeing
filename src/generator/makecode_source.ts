/**
 * M0 MakeCode source generator.
 *
 * .mcfunction AST -> MakeCode TypeScript source that the native MakeCode
 * JavaScript -> Blocks decompiler can understand.
 *
 * This does NOT mutate the host Blockly workspace. It only produces source
 * text for the next capability test.
 */
namespace MCFunctionMakeCodeSource {
    function quoteString(value: string): string {
        let result = "\"";

        for (let i = 0; i < value.length; i++) {
            const ch = value.charAt(i);

            if (ch == "\\") {
                result = result + "\\\\";
            } else if (ch == "\"") {
                result = result + "\\\"";
            } else if (ch == "\t") {
                result = result + "\\t";
            } else {
                result = result + ch;
            }
        }

        return result + "\"";
    }

    export function compileSayToMakeCode(command: MCFunctionAST.SayCommand): string {
        return "MCFunction.sayCommand(" + quoteString(command.message) + ");";
    }

    export function compileFunctionToMakeCode(file: MCFunctionAST.FunctionFile): string {
        let result = "";
        let first = true;

        for (let i = 0; i < file.lines.length; i++) {
            const line = file.lines[i];

            if (
                line.kind == MCFunctionAST.FunctionLineKind.Command
                && line.command
                && line.command.kind == MCFunctionAST.CommandKind.Say
            ) {
                if (!first) {
                    result = result + "\n";
                }
                result = result + compileSayToMakeCode(<MCFunctionAST.SayCommand>line.command);
                first = false;
            }
        }

        return result;
    }

    export function mcfunctionToMakeCode(source: string): string {
        return compileFunctionToMakeCode(MCFunctionParser.parseFunction(source));
    }
}
