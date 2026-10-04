/**
 * Minimal .mcfunction file AST used by the M0 round-trip POC.
 *
 * Comments and blank lines are preserved. Unsupported commands are retained
 * as RawCommand nodes so importing a file does not silently delete content.
 */
namespace MCFunctionAST {
    export enum FunctionLineKind {
        Command = 0,
        Comment = 1,
        Empty = 2
    }

    export interface FunctionLine {
        kind: FunctionLineKind;
        text: string;
        command?: CommandNode;
    }

    export interface FunctionFile {
        lines: FunctionLine[];
    }

    export function createFunctionFile(): FunctionFile {
        return {
            lines: []
        };
    }

    export function createCommandLine(command: CommandNode): FunctionLine {
        return {
            kind: FunctionLineKind.Command,
            text: "",
            command: command
        };
    }

    export function createCommentLine(text: string): FunctionLine {
        return {
            kind: FunctionLineKind.Comment,
            text: text
        };
    }

    export function createEmptyLine(): FunctionLine {
        return {
            kind: FunctionLineKind.Empty,
            text: ""
        };
    }
}
