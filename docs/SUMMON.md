# SUMMON — 0.0.21 Education-verified serialization

## Goal

Keep the MakeCode toolbox compact while preserving the two useful SUMMON forms and the argument order verified in Minecraft Education.

```text
SUMMON
├─ SUMMON SIMPLE
└─ SUMMON ADVANCED
```

The shared core path remains:

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

Semantic order:

```text
entity → [nameTag] → [position]
```

Examples:

```mcfunction
summon minecraft:armor_stand
summon minecraft:armor_stand test
summon minecraft:armor_stand "test mp"
summon minecraft:armor_stand test ~ ~ ~
summon minecraft:armor_stand "test mp" ~ ~ ~
summon minecraft:armor_stand ~ ~ ~
```

`nameTag` is stored as plain text in the AST. The compiler quotes it so spaces and special command-string characters are preserved.

Omitted position and explicit `~ ~ ~` remain different AST values for round-trip preservation.

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

Semantic order:

```text
entity
→ position
→ orientation
→ [spawnEvent]
→ [nameTag]
```

Orientation reuses shared types:

```text
no orientation
rotation [Rotation]
facing position [Position]
facing entity [Selector]
```

Examples:

```mcfunction
summon minecraft:villager ~ ~ ~
summon minecraft:villager ~ ~ ~ ~ ~
summon minecraft:armor_stand ~ ~ ~ facing @s
summon minecraft:armor_stand ~ ~ ~ facing ~ ~ ~
```

### Spawn event + name tag

When both are present they are emitted in that order:

```mcfunction
summon minecraft:armor_stand ~ ~ ~ facing @s minecraft:some_event "test mp"
```

Registry values and Direct/Custom input remain allowed for spawn events. Registry membership is not a whitelist.

### Name tag without spawn event — Education compatibility rule

Minecraft Education testing on 2026-10-06 showed that the nameTag occupies the argument after spawnEvent in ADVANCED forms. If a nameTag exists while spawnEvent is omitted, the compiler emits a quoted single-space token as a **synthetic compatibility placeholder**:

```text
AST:
spawnEvent = undefined
nameTag = "test"
```

Facing Entity compiler result:

```mcfunction
summon minecraft:armor_stand ~ ~ ~ facing @s " " "test"
```

Rotation compiler result:

```mcfunction
summon minecraft:iron_golem ~ ~ ~ ~ ~ " " "Iron Guardian"
```

Important:

- `" "` is **not stored as the Spawn Event AST value**.
- It is emitted only by the compiler when a missing spawnEvent slot must be crossed to reach nameTag.
- Future `.mcfunction` Parser support should recognize this compiler-generated placeholder and restore `spawnEvent = undefined`.
- A user-entered spawn event containing whitespace is not treated as this placeholder; normal spawn-event validation still applies.

## 3. Education observations used for this rule

The following behavior was verified directly in Minecraft Education:

```text
... facing @s IronGuardian
→ IronGuardian occupies spawnEvent; no name tag is displayed.

... facing @s IronGuardian test
→ IronGuardian = spawnEvent, test = nameTag.

... facing @s "IronGuardian" "test mp"
→ quoted spawnEvent token + spaced nameTag works.

... facing @s " " test
→ empty-event compatibility placeholder allows test to occupy nameTag.
```

For SIMPLE, the separate name-first overload remains independent of spawnEvent.

## 4. AST model

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

## 5. Round-trip policy

The AST stores semantic values, not compiler compatibility tokens.

```text
spawnEvent omitted + nameTag present
AST: spawnEvent = undefined
Compiler: inserts " "
Future Parser: " " in this synthetic position → spawnEvent = undefined
```

This keeps Minecraft Education execution compatibility without making a fake Spawn Event part of the command meaning.
