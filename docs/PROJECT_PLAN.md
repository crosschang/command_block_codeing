# command_block_codeing — Current Plan

## Confirmed runtime structure

```text
FunctionFile.define("main", ...)
  -> Minecraft Education preview: chat trigger
  -> Converter meaning: functions/main.mcfunction

Command block
  -> Block Adapter
  -> Command AST
  -> Validator
  -> Compiler
  -> player.execute(compiled) for in-game preview
```

Confirmed commands:
- `Command.say(...)`
- `Command.mcFunction(...)`

`Command.mcFunction()` first resolves another `FunctionFile.define()` for MakeCode preview.
If no local definition exists, it falls back to the real Minecraft `function <id>` command.

## Converter Edition — recorded, implementation deferred

The Converter will not require `.mkcd` as its normal workflow.

### Blocks -> mcfunction
1. Build blocks in MakeCode.
2. Switch to JavaScript.
3. Copy the generated `FunctionFile.*` / `Command.*` code.
4. Paste into Converter.
5. Converter parses the canonical API -> AST -> `.mcfunction` files.

### mcfunction -> Blocks
1. Converter parses `.mcfunction` -> AST.
2. Generate canonical MakeCode JavaScript (`FunctionFile.*` / `Command.*`).
3. Copy generated JavaScript into MakeCode.
4. Switch JavaScript -> Blocks using MakeCode's own decompiler.

Converter work is intentionally deferred until command-block coverage is stronger.

## Legacy reuse policy

Reuse proven Core code and restore only the Registry behavior that is useful for the production tool.

Restored now:
- Selector AST and Selector condition blocks
- Range / Slot common types
- Selector compiler
- `@a`, `@e`, `@p`, `@r`, `@s`, Dialogue-only `@initiator`
- Generated searchable Registry reporters
- Direct/custom input alongside Registry values
- Raw Command AST / Compiler fallback

Registry scope:
- Item / Block / Entity / Effect / Particle
- Family
- Event and Spawn Event as separate Toolbox categories
- Event/Spawn Event reporters grouped by entity inside each category

Quick Preset is intentionally not restored.

## Next command-block work

Use the restored common types instead of reimplementing them per command.
Suggested next order:
1. `give` using Selector + direct Item ID
2. Position
3. `tp`
4. `setblock`
5. other verified legacy command cores
