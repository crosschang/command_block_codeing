/**
 * teleport / tp command AST.
 *
 * Structured variants:
 * - target -> position
 * - target -> entity
 * - target -> position + rotation
 * - target -> position + facing position
 * - target -> position + facing entity
 */
namespace MCFunctionAST {
    export enum TeleportMode {
        Position = 0,
        Entity = 1,
        Rotation = 2,
        FacingPosition = 3,
        FacingEntity = 4
    }

    export interface TeleportCommand extends CommandNode {
        kind: CommandKind;
        mode: TeleportMode;
        target: Selector;
        destinationPosition?: Position;
        destinationEntity?: Selector;
        rotation?: Rotation;
        facingPosition?: Position;
        facingEntity?: Selector;
        checkForBlocks: boolean;
    }

    export function createTeleportToPositionCommand(
        target: Selector,
        destination: Position,
        checkForBlocks: boolean
    ): TeleportCommand {
        return {
            kind: CommandKind.Teleport,
            mode: TeleportMode.Position,
            target: target,
            destinationPosition: destination,
            checkForBlocks: checkForBlocks
        };
    }

    export function createTeleportToEntityCommand(
        target: Selector,
        destination: Selector,
        checkForBlocks: boolean
    ): TeleportCommand {
        return {
            kind: CommandKind.Teleport,
            mode: TeleportMode.Entity,
            target: target,
            destinationEntity: destination,
            checkForBlocks: checkForBlocks
        };
    }

    export function createTeleportWithRotationCommand(
        target: Selector,
        destination: Position,
        rotation: Rotation,
        checkForBlocks: boolean
    ): TeleportCommand {
        return {
            kind: CommandKind.Teleport,
            mode: TeleportMode.Rotation,
            target: target,
            destinationPosition: destination,
            rotation: rotation,
            checkForBlocks: checkForBlocks
        };
    }

    export function createTeleportFacingPositionCommand(
        target: Selector,
        destination: Position,
        facingPosition: Position,
        checkForBlocks: boolean
    ): TeleportCommand {
        return {
            kind: CommandKind.Teleport,
            mode: TeleportMode.FacingPosition,
            target: target,
            destinationPosition: destination,
            facingPosition: facingPosition,
            checkForBlocks: checkForBlocks
        };
    }

    export function createTeleportFacingEntityCommand(
        target: Selector,
        destination: Position,
        facingEntity: Selector,
        checkForBlocks: boolean
    ): TeleportCommand {
        return {
            kind: CommandKind.Teleport,
            mode: TeleportMode.FacingEntity,
            target: target,
            destinationPosition: destination,
            facingEntity: facingEntity,
            checkForBlocks: checkForBlocks
        };
    }
}
