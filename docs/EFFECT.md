# EFFECT — structured command support

## Scope

Minecraft Education 26.32 runtime verification now covers both numeric and infinite duration forms:

```mcfunction
effect <target> <effect> <seconds> <amplifier> <hideParticles>
effect <target> <effect> infinite <amplifier> <hideParticles>
effect <target> clear
effect <target> clear <effect>
```

Runtime Preview is `DIRECT`: the AST is compiled to real command syntax and passed to `player.execute()`.

`infinite` was verified through `player.execute()` in Education 26.32. The active-effect screen opened with `Z` displayed the infinity symbol `∞` for the applied effect.

## Blocks

```text
EFFECT target ... effect ... seconds ... amplifier ... hide particles ...
EFFECT INFINITE target ... effect ... amplifier ... hide particles ...
EFFECT CLEAR ALL target ...
EFFECT CLEAR target ... effect ...
```

Effect values reuse `MCFunctionEffectLibrary`, including Registry reporters and Direct Input.
Registry membership is not treated as a whitelist.

## AST

```ts
EffectCommand {
    mode: Add | ClearAll | ClearSpecific
    target: Selector
    effectId?: string
    durationMode?: Seconds | Infinite
    seconds?: number
    amplifier?: number
    hideParticles?: boolean
}
```

Timed and infinite effects share the same `EffectCommand` AST. `durationMode` describes how the duration token is compiled.

## Compiler examples

```mcfunction
effect @s speed 30 0 false
effect @s speed infinite 1 false
effect @a clear
effect @s clear speed
```

## Validation

- Selector uses the shared Selector validator.
- Effect ID accepts Registry or custom-safe tokens.
- Timed duration must be an integer.
- Infinite duration does not use a numeric `seconds` value.
- Amplifier must be an integer.

## Preview compatibility

```text
effect timed          DIRECT PASS
effect infinite       DIRECT PASS
effect clear specific DIRECT PASS
effect clear all      DIRECT PASS
```

No EFFECT emulation is required.
