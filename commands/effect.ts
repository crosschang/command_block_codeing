/**
 * effect command AST.
 *
 * Verified Minecraft Education 26.32 forms:
 * - timed add: effect <target> <effect> <seconds> <amplifier> <hideParticles>
 * - infinite add: effect <target> <effect> infinite <amplifier> <hideParticles>
 * - clear all: effect <target> clear
 * - clear one: effect <target> clear <effect>
 *
 * Both timed and infinite forms are DIRECT Preview paths: the AST is compiled
 * to real Bedrock/Education command syntax and executed with player.execute().
 */
namespace MCFunctionAST {
    export enum EffectMode {
        Add = 0,
        ClearAll = 1,
        ClearSpecific = 2
    }

    export enum EffectDurationMode {
        Seconds = 0,
        Infinite = 1
    }

    export interface EffectCommand extends CommandNode {
        kind: CommandKind;
        mode: EffectMode;
        target: Selector;
        effectId?: string;
        durationMode?: EffectDurationMode;
        seconds?: number;
        amplifier?: number;
        hideParticles?: boolean;
    }

    /** Create a timed status-effect command. */
    export function createEffectAddCommand(
        target: Selector,
        effectId: string,
        seconds: number,
        amplifier: number,
        hideParticles: boolean
    ): EffectCommand {
        return {
            kind: CommandKind.Effect,
            mode: EffectMode.Add,
            target: target,
            effectId: effectId,
            durationMode: EffectDurationMode.Seconds,
            seconds: seconds,
            amplifier: amplifier,
            hideParticles: hideParticles
        };
    }

    /** Create an infinite-duration status-effect command. */
    export function createEffectInfiniteCommand(
        target: Selector,
        effectId: string,
        amplifier: number,
        hideParticles: boolean
    ): EffectCommand {
        return {
            kind: CommandKind.Effect,
            mode: EffectMode.Add,
            target: target,
            effectId: effectId,
            durationMode: EffectDurationMode.Infinite,
            amplifier: amplifier,
            hideParticles: hideParticles
        };
    }

    export function createEffectClearAllCommand(
        target: Selector
    ): EffectCommand {
        return {
            kind: CommandKind.Effect,
            mode: EffectMode.ClearAll,
            target: target
        };
    }

    export function createEffectClearSpecificCommand(
        target: Selector,
        effectId: string
    ): EffectCommand {
        return {
            kind: CommandKind.Effect,
            mode: EffectMode.ClearSpecific,
            target: target,
            effectId: effectId
        };
    }
}
