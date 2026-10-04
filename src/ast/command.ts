/**
 * Minimal Minecraft Command AST for M0.
 *
 * The AST, not MakeCode block text, is the command meaning source of truth.
 */
namespace MCFunctionAST {
    export enum CommandKind {
        Raw = 0,
        Say = 1
    }

    export interface CommandNode {
        kind: CommandKind;
    }

    export interface RawCommand extends CommandNode {
        raw: string;
    }

    export function createRawCommand(raw: string): RawCommand {
        return {
            kind: CommandKind.Raw,
            raw: raw
        };
    }
}
