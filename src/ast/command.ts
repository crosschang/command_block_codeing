/**
 * Minecraft command AST core.
 * Command meaning lives here, not in block text or raw strings.
 */
namespace MCFunctionAST {
    export enum CommandKind {
        Raw = 0,
        Say = 1,
        McFunction = 2,
        Give = 3,
        Teleport = 4,
        Summon = 5
    }

    export interface CommandNode {
        kind: CommandKind;
    }
}
