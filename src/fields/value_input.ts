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

    /** Common EntityValue adapter used by Registry and direct-input blocks. */
    export function entity(entityId: string): EntityValue {
        return new EntityValue(entityId);
    }

    /** Direct/custom entity ID shadow used by Selector type conditions. */
    //% blockId=mcfunction_entity_select
    //% block="$entityId"
    //% blockHidden=true
    //% entityId.defl="minecraft:zombie"
    export function entityInput(entityId: string): EntityValue {
        return entity(entityId);
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

namespace MCFunctionFields {
    /** Effect command token, for example `speed` or `night_vision`. */
    export class EffectValue {
        effectId: string;

        constructor(effectId: string) {
            this.effectId = effectId;
        }
    }

    export function effect(effectId: string): EffectValue {
        return new EffectValue(effectId);
    }

    /** Namespaced particle identifier, for example `minecraft:basic_flame_particle`. */
    export class ParticleValue {
        particleId: string;

        constructor(particleId: string) {
            this.particleId = particleId;
        }
    }

    export function particle(particleId: string): ParticleValue {
        return new ParticleValue(particleId);
    }
}
