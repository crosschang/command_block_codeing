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

Reuse proven Core code, not the old generated Library UI.

Restored now:
- Selector AST
- Selector condition blocks
- Range AST / Range blocks
- Slot AST used by `hasitem`
- Selector compiler
- `@a`, `@e`, `@p`, `@r`, `@s`
- Dialogue-only `@initiator`

Legacy generated Item/Block/Entity reporter libraries and Registry picker experiments are not restored.
Direct ID input remains available so Custom Namespace support is preserved.

## Next command-block work

Use the restored common types instead of reimplementing them per command.
Suggested next order:
1. `give` using Selector + direct Item ID
2. Position
3. `tp`
4. `setblock`
5. other verified legacy command cores
