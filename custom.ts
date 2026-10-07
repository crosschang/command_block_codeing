/**
 * COMMAND blocks.
 *
 * Canonical export path:
 * Block -> AST -> Validator -> Compiler -> command string
 *
 * Runtime Preview normally executes that compiler output directly. SUMMON
 * ADVANCED Rotation/Facing is the one compatibility exception: MakeCode
 * player.execute() rejects those modern overloads, so MCFunctionPreview
 * emulates only the orientation while the exported command stays unchanged.
 */
//% color=#4C97FF weight=100 icon="\uf1b2"
//% groups='["SUMMON", "EFFECT", "TELEPORT", "GIVE", "SAY", "FUNCTION", "RAW COMMAND"]'
namespace Command {
    function executeCommand(command: MCFunctionAST.CommandNode): void {
        if (!FunctionFile.allowCommandExecution()) {
            return;
        }

        let issues = MCFunctionValidator.validateCommand(command);

        if (MCFunctionValidator.hasError(issues)) {
            if (issues.length > 0) {
                player.say("Command Error: " + issues[0].message);
            }
            return;
        }

        let compiled = MCFunctionCompiler.compileCommand(command);
        if (compiled.length > 0) {
            player.execute(compiled);
        }
    }

    /** Execute a command line that is not yet represented by a structured block. */
    //% blockId=command_raw
    //% group="RAW COMMAND" weight=10
    //% block="RAW COMMAND %command"
    //% command.shadow="text"
    //% command.defl="camera @s fade time 1 1 1"
    export function raw(command: string): void {
        executeCommand(MCFunctionBlocks.createRawCommand(command));
    }

    /** Execute a Minecraft `say` command. */
    //% blockId=command_say
    //% group="SAY" weight=80
    //% block="SAY %message"
    //% message.shadow="text"
    //% message.defl="Hello World"
    export function say(message: string): void {
        let command = MCFunctionBlocks.createSayCommand(message);
        executeCommand(command);
    }

    /** Execute another mcfunction by function ID. */
    //% blockId=command_mcfunction
    //% group="FUNCTION" weight=70
    //% block="MCFUNCTION %functionId"
    //% functionId.shadow="text"
    //% functionId.defl="sub/test"
    export function mcFunction(functionId: string): void {
        if (!FunctionFile.allowCommandExecution()) {
            return;
        }

        let command = MCFunctionBlocks.createMcFunctionCommand(functionId);

        // Converter/export meaning still comes from the AST + Compiler:
        //   function sub/test
        //
        // Runtime preview is different: FunctionFile.define() does not create a
        // real Behavior Pack file, so resolve MakeCode-defined functions first.
        if (FunctionFile.runPreview(functionId)) {
            return;
        }

        // Fallback: allow calling a real function that already exists
        // in the world's active Behavior Pack.
        executeCommand(command);
    }



    /** Wrapper for the optional GIVE count argument. */
    export class GiveCountValue {
        count: number;

        constructor(count: number) {
            this.count = count;
        }
    }

    /** Wrapper for the optional GIVE data argument. */
    export class GiveDataValue {
        data: number;

        constructor(data: number) {
            this.data = data;
        }
    }

    /** Optional GIVE count reporter. */
    //% blockId=mcfunction_give_count
    //% group="GIVE" weight=89
    //% block="count $count"
    //% count.defl=1
    export function giveCount(count: number): GiveCountValue {
        return new GiveCountValue(count);
    }

    /** Optional GIVE data reporter. */
    //% blockId=mcfunction_give_data
    //% group="GIVE" weight=88
    //% block="data $data"
    //% data.defl=0
    export function giveData(data: number): GiveDataValue {
        return new GiveDataValue(data);
    }

    /**
     * Give an item.
     *
     * Bedrock optional tail order:
     * - count
     * - data
     * - item components
     *
     * Count/data use object reporters because MakeCode expandable primitive
     * defaults cannot distinguish "collapsed / absent" from 0 or 1 reliably.
     */
    //% blockId=command_give
    //% group="GIVE" weight=90
    //% block="GIVE target $target item $item || $count $data $components"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode=external
    //% target.shadow="mcfunction_selector_self"
    //% item.shadow="mcfunction_item_id_text_shadow"
    //% count.shadow="mcfunction_give_count"
    //% data.shadow="mcfunction_give_data"
    //% components.shadow="mcfunction_item_components"
    export function give(
        target: MCFunctionFields.SelectorValue,
        item: string,
        count?: GiveCountValue,
        data?: GiveDataValue,
        components?: MCFunctionFields.ItemComponentsValue
    ): void {
        let itemValue = MCFunctionFields.item(item);

        executeCommand(
            MCFunctionBlocks.createGiveCommand(
                target.selector,
                itemValue.itemId,
                count ? count.count : undefined,
                data ? data.data : undefined,
                components ? components.components : undefined
            )
        );
    }

    /** Wrapper for SUMMON orientation reporter blocks. */
    export class SummonOrientationValue {
        orientation: MCFunctionAST.SummonOrientation;

        constructor(orientation: MCFunctionAST.SummonOrientation) {
            this.orientation = orientation;
        }
    }

    /** No rotation/facing clause for SUMMON ADVANCED. */
    //% blockId=mcfunction_summon_orientation_none
    //% group="SUMMON" weight=80
    //% block="no orientation"
    export function summonNoOrientation(): SummonOrientationValue {
        return new SummonOrientationValue(
            MCFunctionAST.createSummonNoOrientation()
        );
    }

    /** Use yaw/pitch rotation for SUMMON ADVANCED. */
    //% blockId=mcfunction_summon_orientation_rotation
    //% group="SUMMON" weight=79
    //% block="rotation $rotation"
    //% rotation.shadow="mcfunction_rotation_relative"
    export function summonRotation(
        rotation: MCFunctionRotationFields.RotationValue
    ): SummonOrientationValue {
        return new SummonOrientationValue(
            MCFunctionAST.createSummonRotationOrientation(rotation.rotation)
        );
    }

    /** Face a position for SUMMON ADVANCED. */
    //% blockId=mcfunction_summon_orientation_facing_position
    //% group="SUMMON" weight=78
    //% block="facing position $facingPosition"
    //% facingPosition.shadow="mcfunction_position_relative"
    export function summonFacingPositionOption(
        facingPosition: MCFunctionPositionFields.PositionValue
    ): SummonOrientationValue {
        return new SummonOrientationValue(
            MCFunctionAST.createSummonFacingOrientation(
                MCFunctionAST.createFacingPosition(facingPosition.position)
            )
        );
    }

    /** Face an entity for SUMMON ADVANCED. */
    //% blockId=mcfunction_summon_orientation_facing_entity
    //% group="SUMMON" weight=77
    //% block="facing entity $facingEntity"
    //% facingEntity.shadow="mcfunction_selector_self"
    export function summonFacingEntityOption(
        facingEntity: MCFunctionFields.SelectorValue
    ): SummonOrientationValue {
        return new SummonOrientationValue(
            MCFunctionAST.createSummonFacingOrientation(
                MCFunctionAST.createFacingEntityNoAnchor(facingEntity.selector)
            )
        );
    }

    /**
     * Simple summon form.
     * Optional arguments expand in Bedrock syntax order: name tag, then position.
     * Empty name is omitted, so position-only syntax remains possible.
     */
    //% blockId=mcfunction_summon_simple
    //% group="SUMMON" weight=100
    //% block="SUMMON entity $entity || name $nameTag at $spawnPosition"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode=external
    //% entity.shadow="mcfunction_entity_custom_id"
    //% nameTag.shadow="text"
    //% nameTag.defl=""
    //% spawnPosition.shadow="mcfunction_position_relative"
    export function summonSimple(
        entity: MCFunctionFields.EntityValue,
        nameTag?: string,
        spawnPosition?: MCFunctionPositionFields.PositionValue
    ): void {
        MCFunctionPreview.executeSummon(
            MCFunctionBlocks.createSummonSimpleCommand(
                entity.entityId,
                nameTag,
                spawnPosition ? spawnPosition.position : undefined
            )
        );
    }

    /**
     * Advanced summon form.
     * Position is explicit; orientation / spawn event / name tag expand as optional arguments.
     */
    //% blockId=mcfunction_summon_advanced
    //% group="SUMMON" weight=90
    //% block="SUMMON ADVANCED entity $entity at $spawnPosition || orientation $orientation spawn event $spawnEvent name $nameTag"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode=external
    //% entity.shadow="mcfunction_entity_custom_id"
    //% spawnPosition.shadow="mcfunction_position_relative"
    //% orientation.shadow="mcfunction_summon_orientation_none"
    //% spawnEvent.shadow="text"
    //% spawnEvent.defl=""
    //% nameTag.shadow="text"
    //% nameTag.defl=""
    export function summonAdvanced(
        entity: MCFunctionFields.EntityValue,
        spawnPosition: MCFunctionPositionFields.PositionValue,
        orientation?: SummonOrientationValue,
        spawnEvent?: string,
        nameTag?: string
    ): void {
        MCFunctionPreview.executeSummon(
            MCFunctionBlocks.createSummonAdvancedCommand(
                entity.entityId,
                spawnPosition.position,
                orientation ? orientation.orientation : MCFunctionAST.createSummonNoOrientation(),
                spawnEvent,
                nameTag
            )
        );
    }


    /** Wrapper for the EFFECT action reporter blocks. */
    export class EffectActionValue {
        mode: MCFunctionAST.EffectMode;
        effectId?: string;

        constructor(mode: MCFunctionAST.EffectMode, effectId?: string) {
            this.mode = mode;
            this.effectId = effectId;
        }
    }

    /** Wrapper for EFFECT duration reporter blocks. */
    export class EffectDurationValue {
        mode: MCFunctionAST.EffectDurationMode;
        seconds?: number;

        constructor(mode: MCFunctionAST.EffectDurationMode, seconds?: number) {
            this.mode = mode;
            this.seconds = seconds;
        }
    }

    /**
     * Wrapper for the optional EFFECT amplifier.
     *
     * This must be an object reporter instead of an optional primitive number.
     * MakeCode can materialize primitive defaults (0 / false) while an
     * expandable argument is visually collapsed. That made an omitted
     * amplifier look present at runtime.
     */
    export class EffectAmplifierValue {
        amplifier: number;

        constructor(amplifier: number) {
            this.amplifier = amplifier;
        }
    }

    /** Wrapper for the optional EFFECT hide-particles value. */
    export class EffectParticlesValue {
        hideParticles: boolean;

        constructor(hideParticles: boolean) {
            this.hideParticles = hideParticles;
        }
    }

    /** Apply one status effect. Minecraft uses 30 seconds when duration is omitted. */
    //% blockId=mcfunction_effect_action_apply
    //% group="EFFECT" weight=99
    //% block="apply effect $effect"
    //% effect.shadow="mcfunction_effect_registry_speed"
    export function effectApply(
        effect: MCFunctionFields.EffectValue
    ): EffectActionValue {
        return new EffectActionValue(
            MCFunctionAST.EffectMode.Add,
            effect.effectId
        );
    }

    /**
     * Clear status effects. With no optional effect this means clear all;
     * press + to add one effect and clear only that effect.
     */
    //% blockId=mcfunction_effect_action_clear
    //% group="EFFECT" weight=98
    //% block="clear || effect $effect"
    //% expandableArgumentMode="enabled"
    //% effect.shadow="mcfunction_effect_registry_speed"
    export function effectClear(
        effect?: MCFunctionFields.EffectValue
    ): EffectActionValue {
        if (effect) {
            return new EffectActionValue(
                MCFunctionAST.EffectMode.ClearSpecific,
                effect.effectId
            );
        }

        return new EffectActionValue(MCFunctionAST.EffectMode.ClearAll);
    }

    /** Numeric EFFECT duration reporter. */
    //% blockId=mcfunction_effect_duration_seconds
    //% group="EFFECT" weight=97
    //% block="duration $seconds seconds"
    //% seconds.defl=30
    export function effectSeconds(seconds: number): EffectDurationValue {
        return new EffectDurationValue(
            MCFunctionAST.EffectDurationMode.Seconds,
            seconds
        );
    }

    /** Infinite EFFECT duration reporter. */
    //% blockId=mcfunction_effect_duration_infinite
    //% group="EFFECT" weight=96
    //% block="duration infinite"
    export function effectInfinite(): EffectDurationValue {
        return new EffectDurationValue(
            MCFunctionAST.EffectDurationMode.Infinite
        );
    }


    /** Optional EFFECT amplifier reporter. */
    //% blockId=mcfunction_effect_amplifier
    //% group="EFFECT" weight=95
    //% block="amplifier $amplifier"
    //% amplifier.defl=0
    export function effectAmplifier(amplifier: number): EffectAmplifierValue {
        return new EffectAmplifierValue(amplifier);
    }

    /** Optional EFFECT particle-visibility reporter. */
    //% blockId=mcfunction_effect_particles
    //% group="EFFECT" weight=94
    //% block="hide particles $hideParticles"
    //% hideParticles.defl=false
    export function effectParticles(hideParticles: boolean): EffectParticlesValue {
        return new EffectParticlesValue(hideParticles);
    }

    /**
     * Unified EFFECT command block.
     *
     * Required:
     * - target
     * - action (apply effect / clear)
     *
     * Optional add tail expands in real Bedrock syntax order:
     * - duration
     * - amplifier
     * - hide particles
     *
     * CLEAR owns its optional effect inside the clear reporter so the command
     * block itself remains one canonical EFFECT block.
     */
    //% blockId=mcfunction_effect
    //% group="EFFECT" weight=100
    //% block="EFFECT target $target action $action || $duration $amplifier $particles"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode=external
    //% target.shadow="mcfunction_selector_self"
    //% action.shadow="mcfunction_effect_action_apply"
    //% duration.shadow="mcfunction_effect_duration_seconds"
    //% amplifier.shadow="mcfunction_effect_amplifier"
    //% particles.shadow="mcfunction_effect_particles"
    export function effect(
        target: MCFunctionFields.SelectorValue,
        action: EffectActionValue,
        duration?: EffectDurationValue,
        amplifier?: EffectAmplifierValue,
        particles?: EffectParticlesValue
    ): void {
        let durationMode: MCFunctionAST.EffectDurationMode = undefined;
        let seconds: number = undefined;
        let amplifierValue: number = undefined;
        let hideParticlesValue: boolean = undefined;

        if (duration) {
            durationMode = duration.mode;
            seconds = duration.seconds;
        }

        if (amplifier) {
            amplifierValue = amplifier.amplifier;
        }

        if (particles) {
            hideParticlesValue = particles.hideParticles;
        }

        executeCommand(
            MCFunctionBlocks.createEffectCommand(
                target.selector,
                action.mode,
                action.effectId,
                durationMode,
                seconds,
                amplifierValue,
                hideParticlesValue
            )
        );
    }


    /** Wrapper for TP destination reporter blocks. */
    export class TeleportDestinationValue {
        destination: MCFunctionAST.TeleportDestination;

        constructor(destination: MCFunctionAST.TeleportDestination) {
            this.destination = destination;
        }
    }

    /** Wrapper for optional TP orientation reporter blocks. */
    export class TeleportOrientationValue {
        orientation: MCFunctionAST.TeleportOrientation;

        constructor(orientation: MCFunctionAST.TeleportOrientation) {
            this.orientation = orientation;
        }
    }

    /** Position destination for TP. */
    //% blockId=mcfunction_tp_destination_position
    //% group="TELEPORT" weight=99
    //% block="position $destination"
    //% destination.shadow="mcfunction_position_relative"
    export function teleportDestinationPosition(
        destination: MCFunctionPositionFields.PositionValue
    ): TeleportDestinationValue {
        return new TeleportDestinationValue(
            MCFunctionAST.createTeleportPositionDestination(destination.position)
        );
    }

    /** Entity destination for TP. */
    //% blockId=mcfunction_tp_destination_entity
    //% group="TELEPORT" weight=98
    //% block="entity $destination"
    //% destination.shadow="mcfunction_selector_nearest_player"
    export function teleportDestinationEntity(
        destination: MCFunctionFields.SelectorValue
    ): TeleportDestinationValue {
        return new TeleportDestinationValue(
            MCFunctionAST.createTeleportEntityDestination(destination.selector)
        );
    }

    /** Yaw/pitch orientation for a position TP destination. */
    //% blockId=mcfunction_tp_orientation_rotation
    //% group="TELEPORT" weight=97
    //% block="rotation $rotation"
    //% rotation.shadow="mcfunction_rotation_absolute"
    export function teleportRotation(
        rotation: MCFunctionRotationFields.RotationValue
    ): TeleportOrientationValue {
        return new TeleportOrientationValue(
            MCFunctionAST.createTeleportRotationOrientation(rotation.rotation)
        );
    }

    /** Face a position after teleporting to a position destination. */
    //% blockId=mcfunction_tp_orientation_facing_position
    //% group="TELEPORT" weight=96
    //% block="facing position $facingPosition"
    //% facingPosition.shadow="mcfunction_position_relative"
    export function teleportFacingPositionOption(
        facingPosition: MCFunctionPositionFields.PositionValue
    ): TeleportOrientationValue {
        return new TeleportOrientationValue(
            MCFunctionAST.createTeleportFacingPositionOrientation(
                facingPosition.position
            )
        );
    }

    /** Face an entity after teleporting to a position destination. */
    //% blockId=mcfunction_tp_orientation_facing_entity
    //% group="TELEPORT" weight=95
    //% block="facing entity $facingEntity"
    //% facingEntity.shadow="mcfunction_selector_nearest_player"
    export function teleportFacingEntityOption(
        facingEntity: MCFunctionFields.SelectorValue
    ): TeleportOrientationValue {
        return new TeleportOrientationValue(
            MCFunctionAST.createTeleportFacingEntityOrientation(
                facingEntity.selector
            )
        );
    }



    /**
     * TP the command executor itself.
     *
     * This maps to Bedrock's no-victim overload:
     *   tp <destination> [orientation] [checkForBlocks]
     *
     * Destination remains a shared reporter (position / entity).
     * Orientation is valid only for a position destination and is checked by
     * the shared Teleport validator.
     */
    //% blockId=mcfunction_tp_self
    //% group="TELEPORT" weight=100
    //% block="TP destination $destination check blocks $checkForBlocks || $orientation"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode=external
    //% destination.shadow="mcfunction_tp_destination_position"
    //% checkForBlocks.defl=false
    //% orientation.shadow="mcfunction_tp_orientation_rotation"
    export function teleportSelf(
        destination: TeleportDestinationValue,
        checkForBlocks: boolean,
        orientation?: TeleportOrientationValue
    ): void {
        executeCommand(
            MCFunctionBlocks.createTeleportSelfCommand(
                destination.destination,
                orientation ? orientation.orientation : undefined,
                checkForBlocks ? true : undefined
            )
        );
    }

    /**
     * TP an explicit victim/target.
     *
     * This maps to Bedrock's victim overload:
     *   tp <victim> <destination> [orientation] [checkForBlocks]
     */
    //% blockId=mcfunction_tp_target
    //% group="TELEPORT" weight=99
    //% block="TP TARGET victim $victim destination $destination check blocks $checkForBlocks || $orientation"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode=external
    //% victim.shadow="mcfunction_selector_self"
    //% destination.shadow="mcfunction_tp_destination_position"
    //% checkForBlocks.defl=false
    //% orientation.shadow="mcfunction_tp_orientation_rotation"
    export function teleportTarget(
        victim: MCFunctionFields.SelectorValue,
        destination: TeleportDestinationValue,
        checkForBlocks: boolean,
        orientation?: TeleportOrientationValue
    ): void {
        executeCommand(
            MCFunctionBlocks.createTeleportCommand(
                victim.selector,
                destination.destination,
                orientation ? orientation.orientation : undefined,
                checkForBlocks ? true : undefined
            )
        );
    }

    /**
     * Previous unified TP API retained so JavaScript/Blocks created during the
     * first GIVE/TP unification pass can still load. New toolbox code should
     * use teleportSelf() or teleportTarget().
     */
    //% blockId=mcfunction_tp
    //% blockHidden=true
    export function teleport(
        target: MCFunctionFields.SelectorValue,
        destination: TeleportDestinationValue,
        checkForBlocks: boolean,
        orientation?: TeleportOrientationValue
    ): void {
        executeCommand(
            MCFunctionBlocks.createTeleportCommand(
                target.selector,
                destination.destination,
                orientation ? orientation.orientation : undefined,
                checkForBlocks ? true : undefined
            )
        );
    }

    // Legacy API wrappers remain for JavaScript compatibility, but are hidden
    // from the toolbox. New code should use Command.teleportSelf(...) or Command.teleportTarget(...).

    //% blockHidden=true
    export function teleportToPosition(
        target: MCFunctionFields.SelectorValue,
        destination: MCFunctionPositionFields.PositionValue,
        checkForBlocks: boolean
    ): void {
        executeCommand(
            MCFunctionBlocks.createTeleportToPositionCommand(
                target.selector, destination.position, checkForBlocks
            )
        );
    }

    //% blockHidden=true
    export function teleportToEntity(
        target: MCFunctionFields.SelectorValue,
        destination: MCFunctionFields.SelectorValue,
        checkForBlocks: boolean
    ): void {
        executeCommand(
            MCFunctionBlocks.createTeleportToEntityCommand(
                target.selector, destination.selector, checkForBlocks
            )
        );
    }

    //% blockHidden=true
    export function teleportWithRotation(
        target: MCFunctionFields.SelectorValue,
        destination: MCFunctionPositionFields.PositionValue,
        rotation: MCFunctionRotationFields.RotationValue,
        checkForBlocks: boolean
    ): void {
        executeCommand(
            MCFunctionBlocks.createTeleportWithRotationCommand(
                target.selector, destination.position, rotation.rotation, checkForBlocks
            )
        );
    }

    //% blockHidden=true
    export function teleportFacingPosition(
        target: MCFunctionFields.SelectorValue,
        destination: MCFunctionPositionFields.PositionValue,
        facingPosition: MCFunctionPositionFields.PositionValue,
        checkForBlocks: boolean
    ): void {
        executeCommand(
            MCFunctionBlocks.createTeleportFacingPositionCommand(
                target.selector, destination.position, facingPosition.position, checkForBlocks
            )
        );
    }

    //% blockHidden=true
    export function teleportFacingEntity(
        target: MCFunctionFields.SelectorValue,
        destination: MCFunctionPositionFields.PositionValue,
        facingEntity: MCFunctionFields.SelectorValue,
        checkForBlocks: boolean
    ): void {
        executeCommand(
            MCFunctionBlocks.createTeleportFacingEntityCommand(
                target.selector, destination.position, facingEntity.selector, checkForBlocks
            )
        );
    }

}
