/**
 * teleport / tp command AST.
 *
 * Canonical structure mirrors current Bedrock syntax:
 * - destination = position | entity
 * - orientation = rotation | facing position | facing entity (position only)
 * - checkForBlocks = optional boolean tail
 *
 * Legacy constructor helpers remain so existing Preview code can keep using
 * the same calls while the public MakeCode UX is unified into one TP block.
 */
namespace MCFunctionAST {
    export enum TeleportDestinationKind {
        Position = 0,
        Entity = 1
    }

    export interface TeleportDestination {
        kind: TeleportDestinationKind;
        position?: Position;
        entity?: Selector;
    }

    export enum TeleportOrientationKind {
        Rotation = 0,
        FacingPosition = 1,
        FacingEntity = 2
    }

    export interface TeleportOrientation {
        kind: TeleportOrientationKind;
        rotation?: Rotation;
        facingPosition?: Position;
        facingEntity?: Selector;
    }

    export interface TeleportCommand extends CommandNode {
        kind: CommandKind;
        target: Selector;
        destination: TeleportDestination;
        orientation?: TeleportOrientation;
        checkForBlocks?: boolean;
    }

    export function createTeleportPositionDestination(
        position: Position
    ): TeleportDestination {
        return {
            kind: TeleportDestinationKind.Position,
            position: position
        };
    }

    export function createTeleportEntityDestination(
        entity: Selector
    ): TeleportDestination {
        return {
            kind: TeleportDestinationKind.Entity,
            entity: entity
        };
    }

    export function createTeleportRotationOrientation(
        rotation: Rotation
    ): TeleportOrientation {
        return {
            kind: TeleportOrientationKind.Rotation,
            rotation: rotation
        };
    }

    export function createTeleportFacingPositionOrientation(
        position: Position
    ): TeleportOrientation {
        return {
            kind: TeleportOrientationKind.FacingPosition,
            facingPosition: position
        };
    }

    export function createTeleportFacingEntityOrientation(
        entity: Selector
    ): TeleportOrientation {
        return {
            kind: TeleportOrientationKind.FacingEntity,
            facingEntity: entity
        };
    }

    export function createTeleportCommand(
        target: Selector,
        destination: TeleportDestination,
        orientation?: TeleportOrientation,
        checkForBlocks?: boolean
    ): TeleportCommand {
        return {
            kind: CommandKind.Teleport,
            target: target,
            destination: destination,
            orientation: orientation,
            checkForBlocks: checkForBlocks
        };
    }

    // Compatibility helpers used by existing code and SUMMON Preview.
    export function createTeleportToPositionCommand(
        target: Selector,
        destination: Position,
        checkForBlocks?: boolean
    ): TeleportCommand {
        return createTeleportCommand(
            target,
            createTeleportPositionDestination(destination),
            undefined,
            checkForBlocks
        );
    }

    export function createTeleportToEntityCommand(
        target: Selector,
        destination: Selector,
        checkForBlocks?: boolean
    ): TeleportCommand {
        return createTeleportCommand(
            target,
            createTeleportEntityDestination(destination),
            undefined,
            checkForBlocks
        );
    }

    export function createTeleportWithRotationCommand(
        target: Selector,
        destination: Position,
        rotation: Rotation,
        checkForBlocks?: boolean
    ): TeleportCommand {
        return createTeleportCommand(
            target,
            createTeleportPositionDestination(destination),
            createTeleportRotationOrientation(rotation),
            checkForBlocks
        );
    }

    export function createTeleportFacingPositionCommand(
        target: Selector,
        destination: Position,
        facingPosition: Position,
        checkForBlocks?: boolean
    ): TeleportCommand {
        return createTeleportCommand(
            target,
            createTeleportPositionDestination(destination),
            createTeleportFacingPositionOrientation(facingPosition),
            checkForBlocks
        );
    }

    export function createTeleportFacingEntityCommand(
        target: Selector,
        destination: Position,
        facingEntity: Selector,
        checkForBlocks?: boolean
    ): TeleportCommand {
        return createTeleportCommand(
            target,
            createTeleportPositionDestination(destination),
            createTeleportFacingEntityOrientation(facingEntity),
            checkForBlocks
        );
    }
}
