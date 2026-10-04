# M0-3 SAY local file export POC

## Goal

Keep the already-tested `COMMAND -> SAY` block unchanged and test only the next path:

```text
SAY message
→ Block Adapter
→ Say AST
→ Compiler
→ say Hello World
→ official File Read & Write extension
→ local file
```

## Important

`src/project/file_export.ts` is optional. It is included only when the host MakeCode project contains the official **File Read & Write** extension.

This means the existing COMMAND/SAY extension can still load without File Read & Write.

## Test order

1. Add `command_block_codeing` to a new Minecraft MakeCode project.
2. Confirm the existing COMMAND → SAY block still works.
3. Open **Extensions**, search for `File`, and add **File Read & Write**.
4. Return to the COMMAND category.
5. Confirm the new block appears:

```text
SAY [Hello World] 를 파일 [path] 에 저장
```

6. First test a documented text extension, for example:

```text
C:/Users/<username>/Desktop/main.txt
```

Expected file contents:

```mcfunction
say Hello World
```

7. Then test the desired filename:

```text
C:/Users/<username>/Desktop/main.mcfunction
```

The `.mcfunction` filename test is intentional: Minecraft Education's official File Read/Write documentation explicitly documents `.txt` and `.csv`, so this POC must verify whether the API accepts `.mcfunction` unchanged on the current Windows/Mac implementation.

## PASS criteria

- Existing SAY block remains unchanged.
- Blocks ↔ JavaScript still round-trips.
- Minecraft SAY execution still works.
- With File Read & Write installed, the export block appears.
- `main.txt` contains exactly `say Hello World` plus a trailing newline.
- If `main.mcfunction` is created successfully with the same contents, direct mcfunction export is PASS.
