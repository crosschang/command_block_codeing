/**
 * Represents one .mcfunction file in Blocks/JavaScript.
 *
 * Converter meaning:
 *   FunctionFile.define("main", ...) -> functions/main.mcfunction
 *
 * Minecraft Education runtime preview:
 *   - top-level simple IDs can be triggered from chat
 *   - Command.mcFunction("id") resolves MakeCode-defined files here first
 *
 * The handler registry is PREVIEW ONLY.
 * FunctionFile.define()/tick() are canonical project declarations that the
 * future Converter maps to .mcfunction files and functions/tick.json.
 */
//% color=#9966FF weight=95 icon="\uf15b"
//% groups='["FUNCTION FILE", "TICK.JSON"]'
namespace FunctionFile {
    let functionNames: string[] = [];
    let functionHandlers: (() => void)[] = [];

    // Runtime-preview representation of functions/tick.json.
    // Converter will map these IDs to the ordered `values` array.
    let tickFunctionNames: string[] = [];
    let tickPreviewStarted = false;

    /**
     * Define one mcfunction file.
     * The callback body becomes the command list for that file in Converter Edition.
     */
    //% blockId=function_file_define
    //% group="FUNCTION FILE" weight=100
    //% block="mcfunction file %name"
    //% name.shadow="text"
    //% name.defl="main"
    //% blockAllowMultiple=1
    export function define(name: string, handler: () => void): void {
        register(name, handler);

        // Keep the convenient direct chat preview used for simple function IDs.
        // Nested IDs such as sub/test are invoked reliably through Command.mcFunction().
        player.onChat(name, handler);
    }

    /**
     * Runtime-preview resolver.
     * Returns true when the requested function is defined in this MakeCode project.
     */
    export function runPreview(name: string): boolean {
        for (let i = 0; i < functionNames.length; i++) {
            if (functionNames[i] == name) {
                functionHandlers[i]();
                return true;
            }
        }

        return false;
    }

    /**
     * Add a function to functions/tick.json.
     *
     * Converter meaning:
     *   FunctionFile.tick("game/update")
     *   -> functions/tick.json { "values": ["game/update"] }
     *
     * Runtime preview:
     *   repeats the registered function about every 50 ms (20 TPS target).
     *   This approximates tick.json for editing/testing only; Minecraft's real
     *   gameplay tick scheduler remains the authority after export.
     */
    //% blockId=function_file_tick
    //% group="TICK.JSON" weight=90
    //% block="tick.json run function %name every tick"
    //% name.shadow="text"
    //% name.defl="tick/main"
    //% blockAllowMultiple=1
    export function tick(name: string): void {
        registerTick(name);
        startTickPreview();
    }

    function registerTick(name: string): void {
        // Avoid accidental runaway registration when this declaration is placed
        // inside a function body. A tick.json values entry is treated as unique
        // in the editor model.
        for (let i = 0; i < tickFunctionNames.length; i++) {
            if (tickFunctionNames[i] == name) {
                return;
            }
        }

        tickFunctionNames.push(name);
    }

    function startTickPreview(): void {
        if (tickPreviewStarted) {
            return;
        }

        tickPreviewStarted = true;

        loops.forever(function () {
            // Let project-level FunctionFile.define()/tick() declarations finish
            // before the first preview tick runs.
            loops.pause(50);

            for (let i = 0; i < tickFunctionNames.length; i++) {
                let functionId = tickFunctionNames[i];

                // Prefer MakeCode-defined FunctionFile handlers. If the function
                // only exists in an active Behavior Pack, use the real command as
                // the same fallback policy as Command.mcFunction().
                if (!runPreview(functionId)) {
                    // Reuse the normal Function command path so preview fallback
                    // still goes through AST -> Validator -> Compiler.
                    Command.mcFunction(functionId);
                }
            }
        });
    }

    function register(name: string, handler: () => void): void {
        // If Blocks <-> JavaScript is refreshed, replace an existing definition
        // rather than keeping duplicate preview callbacks in our own registry.
        for (let i = 0; i < functionNames.length; i++) {
            if (functionNames[i] == name) {
                functionHandlers[i] = handler;
                return;
            }
        }

        functionNames.push(name);
        functionHandlers.push(handler);
    }
}

/**
 * Minecraft Education runtime preview helper.
 *
 * Place this as the first statement of a FunctionFile while testing in-game.
 * It is PREVIEW metadata and must be ignored by the future .mcfunction Converter.
 */
//% color="#00A67E" weight=96 icon="\uf144" block="PREVIEW"
namespace Preview {
    //% blockId=mcfunction_preview_ready
    //% block="▶ PREVIEW READY"
    //% weight=100
    export function ready(): void {
        Command.say("MCFunction Preview Ready")
    }
}
