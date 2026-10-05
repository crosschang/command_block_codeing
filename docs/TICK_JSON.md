# tick.json support

## Goal

Represent the Bedrock / Minecraft Education Behavior Pack `functions/tick.json` file without turning it into a command AST node.

`tick.json` is project/function metadata: it contains function IDs that Minecraft executes every gameplay tick.

## Canonical MakeCode API

```ts
FunctionFile.define("tick/main", function () {
    Command.say("tick")
})

FunctionFile.tick("tick/main")
```

Future Converter output:

```text
functions/
├─ tick.json
└─ tick/
   └─ main.mcfunction
```

`functions/tick.json`:

```json
{
  "values": [
    "tick/main"
  ]
}
```

## Runtime Preview

`FunctionFile.tick()` starts one MakeCode preview loop and executes registered functions with a 50 ms target interval (20 TPS).

This is only an approximation of Minecraft's gameplay tick scheduler. The exported Behavior Pack `tick.json` is the source of runtime truth in Minecraft.

If a registered ID exists as a MakeCode `FunctionFile.define()`, the preview handler runs directly. Otherwise preview falls back to `function <id>` so an already-installed Behavior Pack function can still be tested.

## Design rules

- `tick.json` is not a Minecraft command, so do not add it to `CommandNode`.
- Do not put it under `Preview.*`; `Preview.*` metadata is ignored by the Converter.
- Keep the function IDs in declaration order for future `values` export.
- The editor runtime de-duplicates the same function ID to avoid accidental runaway registration.
- The Converter should validate empty/invalid function paths separately from command validation.
- Minecraft's real `tick.json` runs on gameplay ticks (20 ticks/sec) and can run before the world is fully loaded, so heavy tick functions must be treated carefully.
