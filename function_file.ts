/**
 * Represents .mcfunction files and function metadata in Blocks/JavaScript.
 *
 * Converter meaning:
 *   FunctionFile.define("main", ...) -> functions/main.mcfunction
 *   FunctionFile.tickJson(...)       -> functions/tick.json
 *
 * Minecraft Education runtime preview:
 *   - FunctionFile.define() registers preview handlers for MakeCode-defined files
 *   - Command.mcFunction("id") resolves those handlers first
 *   - FunctionFile.tickJson() approximates tick.json by running every registered
 *     tickValue() entry in declaration order about every 50 ms
 *
 * The runtime registries below are PREVIEW ONLY. The canonical project declarations
 * are define()/tickJson()/tickValue(), which the future Converter maps to files.
 */
//% color=#9966FF weight=95 icon="\uf15b"
//% groups='["FUNCTION FILE", "TICK.JSON"]'
namespace FunctionFile {
    let functionNames: string[] = [];
    let functionHandlers: (() => void)[] = [];

    // Project-level representation of functions/tick.json.
    // Keep declaration order because Minecraft executes the listed functions in order.
    let tickFile: MCFunctionProject.TickFile = MCFunctionProject.createTickFile();
    let tickPreviewStarted = false;
    let collectingTickValues = false;

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
     * Define the project-level functions/tick.json file.
     *
     * Put one or more FunctionFile.tickValue("path/to/function") blocks inside.
     * Their order becomes the order of the future tick.json "values" array.
     *
     * This is project/function metadata, not a Minecraft command AST node.
     */
    //% blockId=function_file_tick_json
    //% group="TICK.JSON" weight=100
    //% block="tick.json"
    export function tickJson(handler: () => void): void {
        // There is only one functions/tick.json per Behavior Pack. If the MakeCode
        // workspace contains another tickJson() declaration, preview treats the
        // latest declaration as the active file instead of merging hidden state.
        tickFile = MCFunctionProject.createTickFile();
        collectingTickValues = true;
        handler();
        collectingTickValues = false;

        startTickPreview();
    }

    /**
     * Add one function path to the current tick.json "values" array.
     * This block is intended to be nested inside FunctionFile.tickJson().
     */
    //% blockId=function_file_tick_value
    //% group="TICK.JSON" weight=90
    //% block="function %name"
    //% name.shadow="text"
    //% name.defl="tick/main"
    //% blockAllowMultiple=1
    export function tickValue(name: string): void {
        // Keep runtime preview safe when this statement is accidentally detached
        // from its tick.json container. The Converter can report a structural
        // validation issue later; preview simply ignores the orphan entry.
        if (!collectingTickValues) {
            return;
        }

        // Preserve declaration order. Do not de-duplicate here: tick.json is an
        // ordered JSON array, and repeating the same function ID is meaningful data
        // that should survive a round-trip exactly as authored.
        MCFunctionProject.addTickValue(tickFile, name);
    }

    function startTickPreview(): void {
        if (tickPreviewStarted) {
            return;
        }

        tickPreviewStarted = true;

        loops.forever(function () {
            // Approximate Minecraft's 20 TPS gameplay tick for editor preview.
            // The exported Behavior Pack tick.json remains the runtime authority.
            loops.pause(50);

            for (let i = 0; i < tickFile.values.length; i++) {
                let functionId = tickFile.values[i];

                // Prefer MakeCode-defined FunctionFile handlers. If the function
                // only exists in an active Behavior Pack, reuse the normal function
                // command path so fallback still uses AST -> Validator -> Compiler.
                if (!runPreview(functionId)) {
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
