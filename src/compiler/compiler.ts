/**
 * Minecraft command compiler - M0 SAY only.
 */
namespace CommandCompiler {
    /** Compiles a SAY AST node to one executable .mcfunction command line. */
    export function compileSay(command: CommandAST.SayCommand): string {
        return "say " + command.message
    }
}
