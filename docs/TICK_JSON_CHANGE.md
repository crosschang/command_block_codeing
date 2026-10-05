# tick.json container change

This revision replaces the previous single-entry API:

```ts
FunctionFile.tick("tick/main")
```

with a file-shaped container API:

```ts
FunctionFile.tickJson(function () {
    FunctionFile.tickValue("tick/main")
    FunctionFile.tickValue("debug/test")
})
```

Reason: Minecraft stores tick functions in one independent `functions/tick.json` file whose `values` field is an ordered array. The MakeCode block model now mirrors that file structure directly.

Toolbox target:

```text
FunctionFile
├─ FUNCTION FILE
│  └─ mcfunction file [...]
└─ TICK.JSON
   └─ tick.json
      ├─ function [...]
      └─ function [...]
```

The old `FunctionFile.tick()` API is removed from this revision.
