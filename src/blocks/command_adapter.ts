/** MakeCode block input -> Minecraft command AST adapter. */
namespace MCFunctionBlocks {
    export function createRawCommand(text: string): MCFunctionAST.RawCommand {
        return MCFunctionAST.createRawCommand(text);
    }

    export function createSayCommand(message: string): MCFunctionAST.SayCommand {
        return MCFunctionAST.createSayCommand(message);
    }

    export function createMcFunctionCommand(functionId: string): MCFunctionAST.McFunctionCommand {
        return MCFunctionAST.createMcFunctionCommand(functionId);
    }


    export function createGiveCommand(
        target: MCFunctionAST.Selector,
        itemId: string,
        amount: number,
        data: number
    ): MCFunctionAST.GiveCommand {
        return MCFunctionAST.createGiveCommand(
            target,
            MCFunctionAST.createItemStack(itemId, amount, data)
        );
    }

    export function createGiveCommandWithComponents(
        target: MCFunctionAST.Selector,
        itemId: string,
        amount: number,
        data: number,
        components: MCFunctionAST.ItemCommandComponents
    ): MCFunctionAST.GiveCommand {
        return MCFunctionAST.createGiveCommand(
            target,
            MCFunctionAST.createItemStackWithComponents(
                itemId, amount, data, components
            )
        );
    }


    export function createTeleportToPositionCommand(
        target: MCFunctionAST.Selector,
        destination: MCFunctionAST.Position,
        checkForBlocks: boolean
    ): MCFunctionAST.TeleportCommand {
        return MCFunctionAST.createTeleportToPositionCommand(
            target, destination, checkForBlocks
        );
    }

    export function createTeleportToEntityCommand(
        target: MCFunctionAST.Selector,
        destination: MCFunctionAST.Selector,
        checkForBlocks: boolean
    ): MCFunctionAST.TeleportCommand {
        return MCFunctionAST.createTeleportToEntityCommand(
            target, destination, checkForBlocks
        );
    }

    export function createTeleportWithRotationCommand(
        target: MCFunctionAST.Selector,
        destination: MCFunctionAST.Position,
        rotation: MCFunctionAST.Rotation,
        checkForBlocks: boolean
    ): MCFunctionAST.TeleportCommand {
        return MCFunctionAST.createTeleportWithRotationCommand(
            target, destination, rotation, checkForBlocks
        );
    }

    export function createTeleportFacingPositionCommand(
        target: MCFunctionAST.Selector,
        destination: MCFunctionAST.Position,
        facingPosition: MCFunctionAST.Position,
        checkForBlocks: boolean
    ): MCFunctionAST.TeleportCommand {
        return MCFunctionAST.createTeleportFacingPositionCommand(
            target, destination, facingPosition, checkForBlocks
        );
    }

    export function createTeleportFacingEntityCommand(
        target: MCFunctionAST.Selector,
        destination: MCFunctionAST.Position,
        facingEntity: MCFunctionAST.Selector,
        checkForBlocks: boolean
    ): MCFunctionAST.TeleportCommand {
        return MCFunctionAST.createTeleportFacingEntityCommand(
            target, destination, facingEntity, checkForBlocks
        );
    }
}
