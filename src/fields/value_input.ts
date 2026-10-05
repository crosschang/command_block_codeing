/**
 * Minimal direct-input value wrappers used by restored legacy fields.
 *
 * Important:
 * - No generated Registry library dependency.
 * - Custom namespace IDs remain allowed.
 * - Full Registry/search UI can be reintroduced later without changing AST.
 */
namespace MCFunctionFields {
    export class EntityValue {
        entityId: string;

        constructor(entityId: string) {
            this.entityId = entityId;
        }
    }

    /** Direct/custom entity ID shadow used by Selector type conditions. */
    //% blockId=mcfunction_entity_select
    //% block="$entityId"
    //% blockHidden=true
    //% entityId.defl="minecraft:zombie"
    export function entityInput(entityId: string): EntityValue {
        return new EntityValue(entityId);
    }

    export class ItemValue {
        itemId: string;

        constructor(itemId: string) {
            this.itemId = itemId;
        }
    }

    /** Internal ItemValue adapter. Registry lookup is intentionally not required. */
    export function item(itemId: string): ItemValue {
        return new ItemValue(itemId);
    }

    /** Direct/custom item ID shadow for hasitem. */
    //% blockId=mcfunction_item_id_text_shadow
    //% block="$itemId"
    //% blockHidden=true
    //% itemId.defl="minecraft:stone"
    export function itemIdTextShadow(itemId: string): string {
        return itemId;
    }
}

namespace MCFunctionFields {
    /** Minimal direct Block ID wrapper; no Registry dependency. */
    export class BlockValue {
        blockId: string;

        constructor(blockId: string) {
            this.blockId = blockId;
        }
    }

    export function block(blockId: string): BlockValue {
        return new BlockValue(blockId);
    }
}
