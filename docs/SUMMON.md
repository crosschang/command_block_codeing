# SUMMON — 0.0.20

## Goal

Keep the MakeCode toolbox compact while preserving the actual Bedrock / Minecraft Education `/summon` overloads.

The command is exposed as **two command blocks**:

```text
SUMMON
├─ SUMMON SIMPLE
└─ SUMMON ADVANCED
```

Helper reporter blocks are used only for the ADVANCED orientation value:

```text
orientation
├─ no orientation
├─ rotation [Rotation]
├─ facing position [Position]
└─ facing entity [Selector]
```

The command still follows the shared core path:

```text
MakeCode Block
→ Block Adapter
→ SummonCommand AST
→ Validator
→ Compiler
→ player.execute()
```

## 1. SUMMON SIMPLE

Canonical API:

```ts
Command.summonSimple(entity, nameTag?, spawnPosition?)
```

The MakeCode block uses expandable optional arguments in Bedrock syntax order:

```text
SUMMON entity [entity]
  + name [name]
  + at [position]
```

Supported meanings:

```mcfunction
summon villager
summon villager "Bob"
summon villager "Bob" ~ ~ ~
summon villager ~ ~ ~
```

Important: **omitted position and `~ ~ ~` are not the same AST value.**

```text
spawnPosition = undefined
```

means the position token was omitted from the source command.

```text
spawnPosition = relative(0, 0, 0)
```

means the source command explicitly contained `~ ~ ~`.

This distinction is preserved for future `.mcfunction → AST → Blocks → .mcfunction` round-trip.

For a position without a name, the canonical JavaScript uses an empty name placeholder:

```ts
Command.summonSimple(
    MCFunctionEntityLibrary.villager(),
    "",
    MCFunctionPositionFields.relative(0, 0, 0)
)
```

Compiler result:

```mcfunction
summon minecraft:villager ~ ~ ~
```

## 2. SUMMON ADVANCED

Canonical API:

```ts
Command.summonAdvanced(
    entity,
    spawnPosition,
    orientation?,
    spawnEvent?,
    nameTag?
)
```

The position is explicit. Additional values are expandable:

```text
SUMMON ADVANCED
entity [entity]
at [position]
  + orientation [orientation]
  + spawn event [event]
  + name [name]
```

### No orientation

```ts
Command.summonAdvanced(
    MCFunctionEntityLibrary.villager(),
    MCFunctionPositionFields.relative(0, 0, 0)
)
```

```mcfunction
summon minecraft:villager ~ ~ ~
```

### Rotation

```ts
Command.summonAdvanced(
    MCFunctionEntityLibrary.villager(),
    MCFunctionPositionFields.relative(0, 0, 0),
    Command.summonRotation(
        MCFunctionRotationFields.relative(0, 0)
    )
)
```

```mcfunction
summon minecraft:villager ~ ~ ~ ~ ~
```

### Facing entity

```ts
Command.summonAdvanced(
    MCFunctionEntityLibrary.villager(),
    MCFunctionPositionFields.relative(0, 0, 0),
    Command.summonFacingEntityOption(
        MCFunctionFields.self(
            MCFunctionFields.noSelectorCondition()
        )
    )
)
```

```mcfunction
summon minecraft:villager ~ ~ ~ facing @s
```

### Facing position

```ts
Command.summonAdvanced(
    MCFunctionEntityLibrary.villager(),
    MCFunctionPositionFields.relative(0, 0, 0),
    Command.summonFacingPositionOption(
        MCFunctionPositionFields.relative(0, 0, 0)
    )
)
```

```mcfunction
summon minecraft:villager ~ ~ ~ facing ~ ~ ~
```

### Spawn event

```ts
Command.summonAdvanced(
    MCFunctionEntityLibrary.villager(),
    MCFunctionPositionFields.relative(0, 2, 0),
    Command.summonNoOrientation(),
    MCFunctionSpawnEventLibrary.custom("minecraft:spawn_farmer")
)
```

```mcfunction
summon minecraft:villager ~ ~2 ~ minecraft:spawn_farmer
```

### Name without spawn event

```ts
Command.summonAdvanced(
    MCFunctionEntityLibrary.ironGolem(),
    MCFunctionPositionFields.relative(0, 0, 0),
    Command.summonNoOrientation(),
    "",
    "Iron Guardian"
)
```

```mcfunction
summon minecraft:iron_golem ~ ~ ~ "Iron Guardian"
```

## Shared types reused

SUMMON does not create command-specific copies of shared value types.

```text
Entity ID    → MCFunctionEntityLibrary
Position     → MCFunctionPositionFields
Rotation     → MCFunctionRotationFields
Facing       → shared MCFunctionAST.Facing
Selector     → MCFunctionFields.SelectorValue
Spawn Event  → MCFunctionSpawnEventLibrary or direct text/custom input
```

`Facing Entity` does **not** use `eyes/feet`. The shared `Facing` AST is reused with no anchor for SUMMON. `EntityAnchor` remains available for commands such as modern `execute` where the syntax actually supports it.

## AST model

```ts
SummonCommand {
    form: Simple | Advanced
    entityId: string
    nameTag?: string
    spawnPosition?: Position
    orientation?: SummonOrientation
    spawnEvent?: string
}
```

```ts
SummonOrientation {
    kind: None | Rotation | Facing
    rotation?: Rotation
    facing?: Facing
}
```

The compiler emits only values that are actually present in the AST.

## Round-trip rule

Do not normalize omitted optional syntax into explicit default tokens.

Examples:

```mcfunction
summon villager
```

must not automatically become:

```mcfunction
summon villager ~ ~ ~
```

Likewise, orientation/event/name values are omitted unless represented by the AST.
