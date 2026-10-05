/**
 * Represents .mcfunction files and function metadata in Blocks/JavaScript.
 *
 * Canonical project meaning:
 *   FunctionFile.define("main", ...) -> functions/main.mcfunction
 *   FunctionFile.tickJson(...)       -> functions/tick.json
 *   FunctionFile.tickValue("main")   -> one tick.json values[] entry
 *
 * Structural policy:
 *   - define() and tickJson() are top-level project containers.
 *   - define() cannot be nested inside define() or tickJson().
 *   - tickJson() cannot be nested inside define() or tickJson().
 *   - tickValue() belongs only inside tickJson().
 *   - Minecraft command blocks are rejected while tickJson() is collecting values.
 *
 * Minecraft Education runtime preview:
 *   - FunctionFile.define() registers preview handlers for MakeCode-defined files.
 *   - Command.mcFunction("id") resolves those handlers first.
 *   - FunctionFile.tickJson() approximates tick.json by running every registered
 *     tickValue() entry in declaration order about every 50 ms.
 *
 * NOTE: Standard PXT callback statement inputs do not expose a custom Blockly
 * connection type through normal GitHub Extension annotations. The canonical
 * API and runtime guards below therefore enforce the project structure, while
 * the future Converter/Project Validator must reject non-tickValue statements
 * found inside tickJson() when parsing JavaScript.
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

    // Preview-only structural context. This does not change exported command meaning.
    let functionExecutionDepth = 0;
    let reportedStructureErrorCodes: string[] = [];

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
    //% topblock=true
    export function define(name: string, handler: () => void): void {
        if (collectingTickValues) {
            reportStructureError(
                "FUNCTION_FILE_IN_TICK_JSON",
                "mcfunction file cannot be defined inside tick.json. Use function entries only."
            );
            return;
        }

        if (functionExecutionDepth > 0) {
            reportStructureError(
                "FUNCTION_FILE_NESTED",
                "mcfunction file cannot be defined inside another mcfunction file. Define it at the workspace top level."
            );
            return;
        }

        register(name, handler);

        // Keep the convenient direct chat preview used for simple function IDs.
        // Wrap the callback so nested project containers are rejected consistently
        // whether the function is invoked from chat or Command.mcFunction().
        player.onChat(name, function () {
            invokeFunctionHandler(handler);
        });
    }

    /**
     * Runtime-preview resolver.
     * Returns true when the requested function is defined in this MakeCode project.
     */
    export function runPreview(name: string): boolean {
        for (let i = 0; i < functionNames.length; i++) {
            if (functionNames[i] == name) {
                invokeFunctionHandler(functionHandlers[i]);
                return true;
            }
        }

        return false;
    }

    /**
     * Define the project-level functions/tick.json file.
     *
     * Canonical body rule: ONLY FunctionFile.tickValue("path/to/function") entries.
     * Their order becomes the future tick.json "values" array order.
     *
     * This is project/function metadata, not a Minecraft command AST node.
     */
    //% blockId=function_file_tick_json
    //% group="TICK.JSON" weight=100
    //% block="tick.json"
    //% topblock=true
    export function tickJson(handler: () => void): void {
        if (collectingTickValues) {
            reportStructureError(
                "TICK_JSON_NESTED",
                "tick.json cannot be nested inside tick.json."
            );
            return;
        }

        if (functionExecutionDepth > 0) {
            reportStructureError(
                "TICK_JSON_IN_FUNCTION_FILE",
                "tick.json cannot be defined inside an mcfunction file. Define it at the workspace top level."
            );
            return;
        }

        // There is only one functions/tick.json per Behavior Pack. The block editor
        // treats this as a top-level container. If JavaScript contains another
        // declaration, the future Project Validator/Converter must report it.
        // Preview keeps the latest declaration active to remain deterministic.
        tickFile = MCFunctionProject.createTickFile();
        collectingTickValues = true;
        handler();
        collectingTickValues = false;

        startTickPreview();
    }

    /**
     * Add one function path to the current tick.json "values" array.
     * This is the ONLY canonical statement allowed inside FunctionFile.tickJson().
     */
    //% blockId=function_file_tick_value
    //% group="TICK.JSON" weight=90
    //% block="function %name"
    //% name.shadow="text"
    //% name.defl="tick/main"
    //% blockAllowMultiple=1
    //% topblock=false
    export function tickValue(name: string): void {
        if (!collectingTickValues) {
            reportStructureError(
                "TICK_VALUE_OUTSIDE_TICK_JSON",
                "tick.json function entry can only be used inside tick.json."
            );
            return;
        }

        // Preserve declaration order. Do not de-duplicate here: tick.json is an
        // ordered JSON array, and repeating the same function ID is meaningful data
        // that should survive a round-trip exactly as authored.
        MCFunctionProject.addTickValue(tickFile, name);
    }

    /**
     * Guard used by Command.* runtime preview.
     * Commands are valid in mcfunction files, but not in tick.json metadata.
     */
    export function allowCommandExecution(): boolean {
        if (!collectingTickValues) {
            return true;
        }

        reportStructureError(
            "COMMAND_IN_TICK_JSON",
            "tick.json accepts only FunctionFile.tickValue() entries. Minecraft commands are not allowed here."
        );
        return false;
    }

    /** Preview/debug helper for future project-level validation and tests. */
    export function isCollectingTickValues(): boolean {
        return collectingTickValues;
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

    function invokeFunctionHandler(handler: () => void): void {
        functionExecutionDepth++;
        handler();
        functionExecutionDepth--;
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

    function reportStructureError(code: string, message: string): void {
        // Avoid flooding chat when invalid project structure is reached from a
        // tick function. One message per structural error code is enough for Preview.
        for (let i = 0; i < reportedStructureErrorCodes.length; i++) {
            if (reportedStructureErrorCodes[i] == code) {
                return;
            }
        }

        reportedStructureErrorCodes.push(code);

        // Structural project errors are reported directly because they are not
        // Minecraft Command AST validation errors.
        player.say("Project Error [" + code + "]: " + message);
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
