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
}
