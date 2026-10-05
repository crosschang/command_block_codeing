/** Searchable /effect command values. */
//% color="#7E57C2" weight=86 icon="\uf0e7" block="EFFECT ID"
//% groups='["Direct Input", "Registry"]'
namespace MCFunctionEffectLibrary {
    //% group="Direct Input"
    //% weight=100
    //% blockId=mcfunction_effect_custom_id
    //% block="effect custom id $effectId"
    //% effectId.shadow="text"
    //% effectId.defl="speed"
    export function custom(effectId: string): MCFunctionFields.EffectValue {
        return MCFunctionFields.effect(effectId);
    }
}
