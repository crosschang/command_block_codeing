/**
 * M0 .mcfunction parser.
 *
 * Supported structured command:
 *   say <message>
 *
 * Unsupported commands are preserved as RawCommand.
 */
namespace MCFunctionParser {
    function normalizeNewlines(source: string): string {
        return source.split("\r\n").join("\n").split("\r").join("\n");
    }

    function trimLeftSpaces(value: string): string {
        let index = 0;
        while (index < value.length) {
            const ch = value.charAt(index);
            if (ch != " " && ch != "\t") {
                break;
            }
            index++;
        }
        return value.substr(index);
    }

    function parseCommandLine(line: string): MCFunctionAST.CommandNode {
        let commandText = trimLeftSpaces(line);

        // A real .mcfunction command normally has no leading '/'.
        // Accept it in M0 input for convenience, but compile back without '/'.
        if (commandText.length > 0 && commandText.charAt(0) == "/") {
            commandText = commandText.substr(1);
        }

        if (commandText.substr(0, 4) == "say ") {
            return MCFunctionAST.createSayCommand(commandText.substr(4));
        }

        return MCFunctionAST.createRawCommand(line);
    }

    export function parseFunction(source: string): MCFunctionAST.FunctionFile {
        const result = MCFunctionAST.createFunctionFile();
        const normalized = normalizeNewlines(source);
        const lines = normalized.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const leftTrimmed = trimLeftSpaces(line);

            if (line.length == 0) {
                result.lines.push(MCFunctionAST.createEmptyLine());
            } else if (leftTrimmed.length > 0 && leftTrimmed.charAt(0) == "#") {
                result.lines.push(MCFunctionAST.createCommentLine(line));
            } else {
                result.lines.push(
                    MCFunctionAST.createCommandLine(parseCommandLine(line))
                );
            }
        }

        return result;
    }

    export function firstSayMessage(source: string): string {
        const file = parseFunction(source);

        for (let i = 0; i < file.lines.length; i++) {
            const line = file.lines[i];
            if (
                line.kind == MCFunctionAST.FunctionLineKind.Command
                && line.command
                && line.command.kind == MCFunctionAST.CommandKind.Say
            ) {
                return (<MCFunctionAST.SayCommand>line.command).message;
            }
        }

        return "";
    }

    export function countSayCommands(source: string): number {
        const file = parseFunction(source);
        let count = 0;

        for (let i = 0; i < file.lines.length; i++) {
            const line = file.lines[i];
            if (
                line.kind == MCFunctionAST.FunctionLineKind.Command
                && line.command
                && line.command.kind == MCFunctionAST.CommandKind.Say
            ) {
                count++;
            }
        }

        return count;
    }
}
