/**
 * COMMAND blocks.
 *
 * Runtime preview and Converter export share the same compiler output:
 * Block -> AST -> Compiler -> command string
 */
//% color=#4C97FF weight=100 icon="\uf1b2"
//% groups='["SUMMON", "TELEPORT", "GIVE", "SAY", "FUNCTION", "RAW COMMAND"]'
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



    /** Give an item with data and Bedrock command components. */
    //% blockId=command_give
    //% group="GIVE" weight=90
    //% block="GIVE target $target item $item amount $amount data $data components $components"
    //% inlineInputMode=external
    //% target.shadow="mcfunction_selector_self"
    //% item.shadow="mcfunction_item_id_text_shadow"
    //% amount.defl=1
    //% data.defl=0
    //% components.shadow="mcfunction_item_components"
    export function give(
        target: MCFunctionFields.SelectorValue,
        item: string,
        amount: number,
        data: number,
        components: MCFunctionFields.ItemComponentsValue
    ): void {
        let itemValue = MCFunctionFields.item(item);
        let command = MCFunctionBlocks.createGiveCommandWithComponents(
            target.selector,
            itemValue.itemId,
            amount,
            data,
            components.components
        );
        executeCommand(command);
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
        executeCommand(
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
        executeCommand(
            MCFunctionBlocks.createSummonAdvancedCommand(
                entity.entityId,
                spawnPosition.position,
                orientation ? orientation.orientation : MCFunctionAST.createSummonNoOrientation(),
                spawnEvent,
                nameTag
            )
        );
    }


    /** Teleport a target to a position. */
    //% blockId=mcfunction_tp_position
    //% group="TELEPORT" weight=100
    //% block="TP target $target to position $destination check blocks $checkForBlocks"
    //% inlineInputMode=external
    //% target.shadow="mcfunction_selector_self"
    //% destination.shadow="mcfunction_position_relative"
    //% checkForBlocks.defl=false
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

    /** Teleport a target to another entity. */
    //% blockId=mcfunction_tp_entity
    //% group="TELEPORT" weight=90
    //% block="TP target $target to entity $destination check blocks $checkForBlocks"
    //% inlineInputMode=external
    //% target.shadow="mcfunction_selector_self"
    //% destination.shadow="mcfunction_selector_nearest_player"
    //% checkForBlocks.defl=false
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

    /** Teleport a target to a position with yaw/pitch rotation. */
    //% blockId=mcfunction_tp_rotation
    //% group="TELEPORT" weight=80
    //% block="TP target $target to position $destination rotation $rotation check blocks $checkForBlocks"
    //% inlineInputMode=external
    //% target.shadow="mcfunction_selector_self"
    //% destination.shadow="mcfunction_position_relative"
    //% rotation.shadow="mcfunction_rotation_absolute"
    //% checkForBlocks.defl=false
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

    /** Teleport a target to a position while facing another position. */
    //% blockId=mcfunction_tp_facing_position
    //% group="TELEPORT" weight=70
    //% block="TP target $target to position $destination facing position $facingPosition check blocks $checkForBlocks"
    //% inlineInputMode=external
    //% target.shadow="mcfunction_selector_self"
    //% destination.shadow="mcfunction_position_relative"
    //% facingPosition.shadow="mcfunction_position_relative"
    //% checkForBlocks.defl=false
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

    /** Teleport a target to a position while facing an entity. */
    //% blockId=mcfunction_tp_facing_entity
    //% group="TELEPORT" weight=60
    //% block="TP target $target to position $destination facing entity $facingEntity check blocks $checkForBlocks"
    //% inlineInputMode=external
    //% target.shadow="mcfunction_selector_self"
    //% destination.shadow="mcfunction_position_relative"
    //% facingEntity.shadow="mcfunction_selector_nearest_player"
    //% checkForBlocks.defl=false
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
