# 0.0.39 — SUMMON spawn-event orientation validation

Date: 2026-10-10

## Runtime finding

Minecraft Education 26.32 rejected:

```mcfunction
/summon minecraft:cow ~ ~ ~3 minecraft:entity_born
```

and accepted:

```mcfunction
/summon minecraft:cow ~ ~ ~3 ~ ~ minecraft:entity_born
```

The accepted form spawned a baby cow.

Microsoft's Bedrock command reference exposes both the yRot/xRot overload and
separate `facing <position|entity>` overloads for SUMMON.

## Validator

`No Orientation + spawnEvent` is now an ERROR:

```text
SUMMON_ORIENTATION_REQUIRED_FOR_EVENT
```

Message: choose Rotation, Facing Position, or Facing Entity.

`No Orientation` remains valid when no spawn event is present. A physically
missing Orientation reporter continues to use `SUMMON_ORIENTATION_MISSING`.

## Compiler

The canonical compiler no longer silently injects synthetic `~ ~` into a
user-selected No Orientation AST. Export remains blocked by Definition Validation
for the unsupported No Orientation + spawnEvent combination.

## Preview

Rotation/Facing Preview emulation still needs an orientation-free intermediate
summon. When that intermediate summon carries a spawn event, Preview uses a
relative 0/0 Rotation only for the internal summon, then applies the user's real
Rotation/Facing via TP. Canonical export is unchanged.

## Status

SOURCE implemented. Runtime re-test required before PASS.

## Correction: NameTag-only overload

Direct Education 26.32 testing showed that:

```text
summon minecraft:cow ~ ~ ~3 "My Cow"
```

is invalid because the NameTag-only overload places `nameTag` before `spawnPos`.

Correct syntax:

```text
summon minecraft:cow "My Cow" ~ ~ ~3
```

Compiler rule:

```text
No Orientation + no spawnEvent + nameTag
→ use the dedicated NameTag-first overload

No Orientation + spawnEvent
→ require explicit Rotation / Facing Position / Facing Entity
```

