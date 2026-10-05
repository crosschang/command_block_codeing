/**
 * Minecraft command AST core.
 * Command meaning lives here, not in block text or raw strings.
 */
namespace MCFunctionAST {
    export enum CommandKind {
        Say = 1,
        McFunction = 2
    }

    export interface CommandNode {
        kind: CommandKind;
    }
}
