/**
 * Minecraft command AST - M0 SAY only.
 *
 * This file intentionally contains no MakeCode block annotations and no
 * Minecraft runtime calls. It is the command data model used by adapters and
 * compilers.
 */
namespace CommandAST {
    /** SAY command node. */
    export interface SayCommand {
        message: string
    }

    /** Creates a SAY command node. */
    export function createSay(message: string): SayCommand {
        return {
            message: message
        }
    }
}
