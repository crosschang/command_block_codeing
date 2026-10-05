/**
 * Item ID helpers and Item Components blocks.
 *
 * Full generated Registry libraries are intentionally not restored yet.
 * IDs remain direct text so custom namespaces continue to work.
 */
//% color=#C98900 weight=88 icon="\uf06b" block="ITEM"
//% groups='["Input", "Components"]'
namespace MCItem {
    //% group="Input"
    //% weight=100
    //% blockId=mcfunction_item_custom_id
    //% block="item id %itemId"
    //% itemId.shadow="text"
    //% itemId.defl="minecraft:diamond"
    export function custom(itemId: string): string {
        return itemId;
    }

    // Hidden text shadow used directly by command inputs.
    //% blockId=mcfunction_item_id_text_shadow
    //% block="$itemId"
    //% blockHidden=true
    //% itemId.defl="minecraft:diamond"
    export function itemIdTextShadow(itemId: string): string {
        return itemId;
    }

    // Hidden direct block ID shadow used by component blocks.
    //% blockId=mcfunction_block_id_value_shadow
    //% block="$blockId"
    //% blockHidden=true
    //% blockId.defl="minecraft:stone"
    export function blockIdValueShadow(blockId: string): MCFunctionFields.BlockValue {
        return MCFunctionFields.block(blockId);
    }

    //% group="Components"
    //% weight=90
    //% blockId=mcfunction_item_components
    //% block="no item components"
    export function components(): MCFunctionFields.ItemComponentsValue {
        return MCFunctionFields.itemComponents();
    }

    //% group="Components"
    //% weight=89
    //% blockId=mcfunction_item_component_can_destroy
    //% block="can destroy block %blockValue then %components"
    //% blockValue.shadow="mcfunction_block_id_value_shadow"
    //% components.shadow="mcfunction_item_components"
    export function addCanDestroy(
        blockValue: MCFunctionFields.BlockValue,
        components: MCFunctionFields.ItemComponentsValue
    ): MCFunctionFields.ItemComponentsValue {
        return MCFunctionFields.addCanDestroy(components, blockValue);
    }

    //% group="Components"
    //% weight=88
    //% blockId=mcfunction_item_component_can_place_on
    //% block="can place on block %blockValue then %components"
    //% blockValue.shadow="mcfunction_block_id_value_shadow"
    //% components.shadow="mcfunction_item_components"
    export function addCanPlaceOn(
        blockValue: MCFunctionFields.BlockValue,
        components: MCFunctionFields.ItemComponentsValue
    ): MCFunctionFields.ItemComponentsValue {
        return MCFunctionFields.addCanPlaceOn(components, blockValue);
    }

    //% group="Components"
    //% weight=87
    //% blockId=mcfunction_item_component_lock_inventory
    //% block="lock in inventory then %components"
    //% components.shadow="mcfunction_item_components"
    export function lockInInventory(
        components: MCFunctionFields.ItemComponentsValue
    ): MCFunctionFields.ItemComponentsValue {
        return MCFunctionFields.lockInInventory(components);
    }

    //% group="Components"
    //% weight=86
    //% blockId=mcfunction_item_component_lock_slot
    //% block="lock in slot then %components"
    //% components.shadow="mcfunction_item_components"
    export function lockInSlot(
        components: MCFunctionFields.ItemComponentsValue
    ): MCFunctionFields.ItemComponentsValue {
        return MCFunctionFields.lockInSlot(components);
    }

    //% group="Components"
    //% weight=85
    //% blockId=mcfunction_item_component_keep_on_death
    //% block="keep on death then %components"
    //% components.shadow="mcfunction_item_components"
    export function keepOnDeath(
        components: MCFunctionFields.ItemComponentsValue
    ): MCFunctionFields.ItemComponentsValue {
        return MCFunctionFields.keepOnDeath(components);
    }
}
