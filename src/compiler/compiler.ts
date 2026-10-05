/** Minecraft command compiler: AST -> .mcfunction command line. */
namespace MCFunctionCompiler {
    export function compileCommand(command: MCFunctionAST.CommandNode): string {
        switch (command.kind) {
            case MCFunctionAST.CommandKind.Raw:
                return compileRaw(<MCFunctionAST.RawCommand>command);

            case MCFunctionAST.CommandKind.Say:
                return compileSay(<MCFunctionAST.SayCommand>command);

            case MCFunctionAST.CommandKind.McFunction:
                return compileMcFunction(<MCFunctionAST.McFunctionCommand>command);

            case MCFunctionAST.CommandKind.Give:
                return compileGive(<MCFunctionAST.GiveCommand>command);

            default:
                return "";
        }
    }

    function compileRaw(command: MCFunctionAST.RawCommand): string {
        return command.raw;
    }

    function compileSay(command: MCFunctionAST.SayCommand): string {
        return "say " + command.message;
    }

    function compileMcFunction(command: MCFunctionAST.McFunctionCommand): string {
        return "function " + command.functionId;
    }


    function compileGive(command: MCFunctionAST.GiveCommand): string {
        let result =
            "give " +
            compileSelector(command.target) +
            " " + command.item.id +
            " " + command.item.amount +
            " " + command.item.data;

        if (MCFunctionAST.hasItemCommandComponents(command.item.components)) {
            result = result + " " + compileItemCommandComponents(command.item.components);
        }

        return result;
    }

    function compileItemCommandComponents(
        components: MCFunctionAST.ItemCommandComponents
    ): string {
        let result = "{";
        let hasPrevious = false;

        if (components.canDestroy.length > 0) {
            result = result + "\"minecraft:can_destroy\":{\"blocks\":[";
            for (let i = 0; i < components.canDestroy.length; i++) {
                if (i > 0) result = result + ",";
                result = result + "\"" + components.canDestroy[i] + "\"";
            }
            result = result + "]}";
            hasPrevious = true;
        }

        if (components.canPlaceOn.length > 0) {
            if (hasPrevious) result = result + ",";
            result = result + "\"minecraft:can_place_on\":{\"blocks\":[";
            for (let i = 0; i < components.canPlaceOn.length; i++) {
                if (i > 0) result = result + ",";
                result = result + "\"" + components.canPlaceOn[i] + "\"";
            }
            result = result + "]}";
            hasPrevious = true;
        }

        if (components.itemLock != MCFunctionAST.ItemLockMode.None) {
            if (hasPrevious) result = result + ",";
            result = result + "\"minecraft:item_lock\":{\"mode\":\"";
            if (components.itemLock == MCFunctionAST.ItemLockMode.LockInInventory) {
                result = result + "lock_in_inventory";
            } else {
                result = result + "lock_in_slot";
            }
            result = result + "\"}";
            hasPrevious = true;
        }

        if (components.keepOnDeath) {
            if (hasPrevious) result = result + ",";
            result = result + "\"minecraft:keep_on_death\":{}";
        }

        return result + "}";
    }

    /** Compile a structured Selector AST into Bedrock/Education selector syntax. */
    export function compileSelector(selector: MCFunctionAST.Selector): string {
        let result = MCFunctionAST.selectorBaseToken(selector.base);

        if (
            selector.filters.length == 0 &&
            selector.scores.length == 0 &&
            selector.hasItems.length == 0
        ) {
            return result;
        }

        result = result + "[";
        let hasPrevious = false;

        for (let i = 0; i < selector.filters.length; i++) {
            if (hasPrevious) result = result + ",";

            let filter = selector.filters[i];
            result = result + filter.key + "=";
            if (filter.inverted) result = result + "!";
            result = result + filter.value;
            hasPrevious = true;
        }

        if (selector.scores.length > 0) {
            if (hasPrevious) result = result + ",";
            result = result + "scores={";

            for (let i = 0; i < selector.scores.length; i++) {
                if (i > 0) result = result + ",";

                let score = selector.scores[i];
                result = result + score.objective + "=";
                if (score.inverted) result = result + "!";

                if (score.range.hasMin && score.range.hasMax) {
                    if (score.range.min == score.range.max) {
                        result = result + score.range.min;
                    } else {
                        result = result + score.range.min + ".." + score.range.max;
                    }
                } else if (score.range.hasMin) {
                    result = result + score.range.min + "..";
                } else if (score.range.hasMax) {
                    result = result + ".." + score.range.max;
                }
            }

            result = result + "}";
            hasPrevious = true;
        }

        if (selector.hasItems.length > 0) {
            if (hasPrevious) result = result + ",";

            let hasItem = selector.hasItems[0];
            result = result + "hasitem={item=" + hasItem.itemId;

            if (hasItem.quantity.hasMin && hasItem.quantity.hasMax) {
                result = result + ",quantity=";
                if (hasItem.quantity.min == hasItem.quantity.max) {
                    result = result + hasItem.quantity.min;
                } else {
                    result = result + hasItem.quantity.min + ".." + hasItem.quantity.max;
                }
            } else if (hasItem.quantity.hasMin) {
                result = result + ",quantity=" + hasItem.quantity.min + "..";
            } else if (hasItem.quantity.hasMax) {
                result = result + ",quantity=.." + hasItem.quantity.max;
            }

            if (hasItem.hasLocation) {
                result = result + ",location=" + MCFunctionAST.slotLocationToken(hasItem.location);
            }

            if (hasItem.hasSlot) {
                result = result + ",slot=";
                if (hasItem.slot.hasMin && hasItem.slot.hasMax) {
                    if (hasItem.slot.min == hasItem.slot.max) {
                        result = result + hasItem.slot.min;
                    } else {
                        result = result + hasItem.slot.min + ".." + hasItem.slot.max;
                    }
                } else if (hasItem.slot.hasMin) {
                    result = result + hasItem.slot.min + "..";
                } else if (hasItem.slot.hasMax) {
                    result = result + ".." + hasItem.slot.max;
                }
            }

            if (hasItem.hasData) {
                result = result + ",data=" + hasItem.data;
            }

            result = result + "}";
        }

        result = result + "]";
        return result;
    }
}

