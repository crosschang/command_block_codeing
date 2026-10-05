# tick.json support

## Goal

Represent the Bedrock / Minecraft Education Behavior Pack `functions/tick.json` file as project/function metadata.

`tick.json` is **not** a Minecraft command and is not added to `CommandNode`.
It is a separate project file whose `values` array stores function IDs in execution order.

## Canonical MakeCode API

```ts
FunctionFile.define("board_game_system/ticking", function () {
    Command.say("tick")
})

FunctionFile.define("debug/double_bonus_e2e/controller", function () {
    Command.say("double bonus")
})

FunctionFile.tickJson(function () {
    FunctionFile.tickValue("board_game_system/ticking")
    FunctionFile.tickValue("debug/double_bonus_e2e/controller")
})
```

The `tick.json` block and `mcfunction file` blocks are independent top-level containers in the `FunctionFile` Toolbox category.
A `tickValue()` block is intended to be nested inside `tickJson()`.

## Future Converter output

```text
functions/
├─ tick.json
├─ board_game_system/
│  └─ ticking.mcfunction
└─ debug/
   └─ double_bonus_e2e/
      └─ controller.mcfunction
```

`functions/tick.json`:

```json
{
  "values": [
    "board_game_system/ticking",
    "debug/double_bonus_e2e/controller"
  ]
}
```

The Converter must preserve `values` order. Duplicate IDs are also data and should not be silently removed.


## Project model

The shared project-layer type is intentionally separate from command AST:

```ts
namespace MCFunctionProject {
    export interface TickFile {
        values: string[]
    }
}
```

`FunctionFile.tickJson()` builds this project model during Runtime Preview, and the future Converter can reuse the same model when reading/writing `functions/tick.json`.

## Runtime Preview

`FunctionFile.tickJson()` collects the nested `tickValue()` entries once and starts one MakeCode preview loop.
The loop targets about 50 ms per iteration (20 TPS approximation) and executes each registered function in array order.

For every tick value:

1. If the ID exists in a MakeCode `FunctionFile.define()`, its preview handler runs directly.
2. Otherwise Preview falls back to `Command.mcFunction(id)` so a real Behavior Pack function can still be invoked.
3. The fallback therefore keeps the normal `AST -> Validator -> Compiler -> player.execute()` command path.

The MakeCode loop is only an editor/runtime approximation. The exported Minecraft `functions/tick.json` is the runtime source of truth.

## Structural rules

- One Behavior Pack has one `functions/tick.json` file.
- `tickJson()` is a project-level container, not a child of `mcfunction file`.
- `tickValue()` belongs inside `tickJson()`.
- `tick.json` is not `Preview.*` metadata and must not be discarded by the Converter.
- `Preview.ready()` remains Preview-only and is still ignored by export.
- Empty/invalid function paths should be validated by the future project/converter validator rather than command validation.
- The Converter should report multiple `tickJson()` declarations as a project-structure error instead of silently producing multiple files.

## Toolbox target shape

```text
FunctionFile
│
├─ FUNCTION FILE
│   └─ mcfunction file [board_game_system/ticking]
│       └─ ...commands...
│
└─ TICK.JSON
    └─ tick.json
        ├─ function [board_game_system/ticking]
        └─ function [debug/double_bonus_e2e/controller]
```

## Example matching a real multi-function tick.json

```ts
FunctionFile.tickJson(function () {
    FunctionFile.tickValue("board_game_system/ticking")
    FunctionFile.tickValue("debug/double_bonus_e2e/controller")
    FunctionFile.tickValue("debug/economy_full_test/controller")
    FunctionFile.tickValue("debug/economy_final_e2e/controller")
    FunctionFile.tickValue("debug/economy_dialogue_final_e2e/controller")
})
```

Converter target:

```json
{
  "values": [
    "board_game_system/ticking",
    "debug/double_bonus_e2e/controller",
    "debug/economy_full_test/controller",
    "debug/economy_final_e2e/controller",
    "debug/economy_dialogue_final_e2e/controller"
  ]
}
```
