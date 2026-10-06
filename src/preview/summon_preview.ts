/**
 * SUMMON runtime preview adapter for Minecraft Education MakeCode.
 *
 * Source of truth remains the normal AST -> Validator -> Compiler path.
 * This file only compensates for the MakeCode player.execute() bridge not
 * accepting the modern SUMMON rotation/facing overloads that Minecraft
 * Education itself accepts in command/function execution.
 *
 * Preview strategy for ADVANCED Rotation/Facing:
 * 1. Temporarily tag all pre-existing entities of the summoned type.
 * 2. Execute the same SUMMON without the orientation clause. Position,
 *    spawnEvent and nameTag still use the normal compiler.
 * 3. At the spawn position, identify the nearest same-type entity that does
 *    not have the old tag and give it a preview-only tag.
 * 4. Reuse the normal Teleport AST + Compiler to apply Rotation/Facing while
 *    keeping the spawn position unchanged.
 * 5. Remove all temporary tags.
 *
 * Exported .mcfunction output is NOT changed by this adapter.
 */
namespace MCFunctionPreview {
    let summonPreviewSerial = 0;

    /** Execute SUMMON in MakeCode runtime preview without changing export meaning. */
    export function executeSummon(command: MCFunctionAST.SummonCommand): void {
        if (!FunctionFile.allowCommandExecution()) {
            return;
        }

        let issues = MCFunctionValidator.validateSummonCommand(command);
        if (MCFunctionValidator.hasError(issues)) {
            if (issues.length > 0) {
                player.say("Command Error: " + issues[0].message);
            }
            return;
        }

        if (!needsOrientationEmulation(command)) {
            executeCompiled(command);
            return;
        }

        executeAdvancedOrientationEmulation(command);
    }

    function needsOrientationEmulation(command: MCFunctionAST.SummonCommand): boolean {
        if (command.form != MCFunctionAST.SummonForm.Advanced) {
            return false;
        }

        if (!command.orientation) {
            return false;
        }

        return command.orientation.kind == MCFunctionAST.SummonOrientationKind.Rotation ||
            command.orientation.kind == MCFunctionAST.SummonOrientationKind.Facing;
    }

    function executeAdvancedOrientationEmulation(
        command: MCFunctionAST.SummonCommand
    ): void {
        let previewId = nextPreviewId();
        let oldTag = "cbc_p_old_" + previewId;
        let newTag = "cbc_p_new_" + previewId;

        let oldEntities = createEntityTypeSelector(command.entityId);
        let newCandidate = createEntityTypeSelector(command.entityId);
        MCFunctionAST.addSelectorFilter(
            newCandidate,
            MCFunctionAST.createSelectorFilter("tag", oldTag, true)
        );
        MCFunctionAST.addSelectorFilter(
            newCandidate,
            MCFunctionAST.createSelectorFilter("c", "1", false)
        );

        let previewTarget = MCFunctionAST.createSelector(MCFunctionAST.SelectorBase.AllEntities);
        MCFunctionAST.addSelectorFilter(
            previewTarget,
            MCFunctionAST.createSelectorFilter("tag", newTag, false)
        );
        MCFunctionAST.addSelectorFilter(
            previewTarget,
            MCFunctionAST.createSelectorFilter("c", "1", false)
        );

        // Mark every same-type entity that existed before this preview summon.
        executePreviewRaw(
            "tag " + MCFunctionCompiler.compileSelector(oldEntities) +
            " add " + oldTag
        );

        // player.execute() accepts ADVANCED position/event/name forms, but not
        // the modern rotation/facing overloads. Compile an orientation-free
        // preview summon while preserving all other SUMMON semantics.
        let previewSummon = MCFunctionAST.createSummonAdvancedCommand(
            command.entityId,
            command.spawnPosition,
            MCFunctionAST.createSummonNoOrientation(),
            command.spawnEvent,
            command.nameTag
        );
        executeCompiled(previewSummon);

        // Resolve the newly summoned entity around the intended spawn position.
        // The legacy execute form is intentionally PREVIEW-only; export continues
        // to compile the original modern SUMMON command.
        executePreviewRaw(
            "execute @s " + MCFunctionCompiler.compilePosition(command.spawnPosition) +
            " tag " + MCFunctionCompiler.compileSelector(newCandidate) +
            " add " + newTag
        );

        applyOrientationWithTeleport(command, previewTarget);

        // Always clean preview tags. Tag-only selectors avoid depending on the
        // entity retaining its original type after a spawn event.
        executePreviewRaw(
            "tag " + compileTagOnlySelector(oldTag) + " remove " + oldTag
        );
        executePreviewRaw(
            "tag " + compileTagOnlySelector(newTag) + " remove " + newTag
        );
    }

    function applyOrientationWithTeleport(
        command: MCFunctionAST.SummonCommand,
        target: MCFunctionAST.Selector
    ): void {
        let orientation = command.orientation;
        let teleportCommand: MCFunctionAST.TeleportCommand;

        if (orientation.kind == MCFunctionAST.SummonOrientationKind.Rotation) {
            teleportCommand = MCFunctionAST.createTeleportWithRotationCommand(
                target,
                command.spawnPosition,
                orientation.rotation,
                false
            );
            executeCompiled(teleportCommand);
            return;
        }

        if (
            orientation.kind == MCFunctionAST.SummonOrientationKind.Facing &&
            orientation.facing
        ) {
            if (orientation.facing.kind == MCFunctionAST.FacingKind.Position) {
                teleportCommand = MCFunctionAST.createTeleportFacingPositionCommand(
                    target,
                    command.spawnPosition,
                    orientation.facing.position,
                    false
                );
                executeCompiled(teleportCommand);
                return;
            }

            if (orientation.facing.kind == MCFunctionAST.FacingKind.Entity) {
                teleportCommand = MCFunctionAST.createTeleportFacingEntityCommand(
                    target,
                    command.spawnPosition,
                    orientation.facing.entitySelector,
                    false
                );
                executeCompiled(teleportCommand);
            }
        }
    }

    function createEntityTypeSelector(entityId: string): MCFunctionAST.Selector {
        let selector = MCFunctionAST.createSelector(MCFunctionAST.SelectorBase.AllEntities);
        MCFunctionAST.addSelectorFilter(
            selector,
            MCFunctionAST.createSelectorFilter("type", entityId, false)
        );
        return selector;
    }

    function compileTagOnlySelector(tag: string): string {
        let selector = MCFunctionAST.createSelector(MCFunctionAST.SelectorBase.AllEntities);
        MCFunctionAST.addSelectorFilter(
            selector,
            MCFunctionAST.createSelectorFilter("tag", tag, false)
        );
        return MCFunctionCompiler.compileSelector(selector);
    }

    function nextPreviewId(): number {
        summonPreviewSerial++;
        return summonPreviewSerial;
    }

    function executeCompiled(command: MCFunctionAST.CommandNode): void {
        let compiled = MCFunctionCompiler.compileCommand(command);
        if (compiled.length > 0) {
            player.execute(compiled);
        }
    }

    function executePreviewRaw(command: string): void {
        if (command.length > 0) {
            player.execute(command);
        }
    }
}
