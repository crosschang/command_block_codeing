# command_block_codeing

Minecraft Education MakeCode에서 실제 Minecraft 명령을 블록으로 작성하고, 향후 `.mcfunction`과 양방향 변환하기 위한 프로젝트입니다.

## 현재 구현

### Function File

```ts
FunctionFile.define("main", function () {
    Command.say("Hello World")
    Command.mcFunction("sub/test")
})
```

MakeCode 인게임 테스트에서는 `main`을 채팅에 입력하면 내부 블록이 실행됩니다.
Converter Edition에서는 위 구조를 `functions/main.mcfunction` 파일 정의로 해석합니다.

### COMMAND

- `SAY [message]`
- `MCFUNCTION [function id]`

두 명령 모두 다음 경로를 사용합니다.

```text
Block -> Adapter -> AST -> Validator -> Compiler
                               |
                               +-> player.execute() (runtime preview)
                               +-> .mcfunction       (Converter)
```

예:

```ts
Command.say("Hello")
Command.mcFunction("sub/test")
```

컴파일 의미:

```mcfunction
say Hello
function sub/test
```

## 현재 제외

- Generated Item / Block / Entity libraries
- Registry picker UI
- Browser Companion
- Starter / READY 관련 코드
- `.mcfunction` Parser / Converter UI (다음 단계)


## Runtime preview for nested function IDs

`FunctionFile.define("sub/test", ...)` is a MakeCode-side definition for the
Converter. It does not physically create `functions/sub/test.mcfunction` in an
active Behavior Pack.

For preview, `Command.mcFunction("sub/test")` first resolves the matching
`FunctionFile.define()` callback and runs it directly. If no matching MakeCode
definition exists, it falls back to the real Minecraft `function sub/test`
command so external Behavior Pack functions can still be tested.

## Legacy Selector core restored (v0.3.0)

The proven legacy Selector system is restored without the old generated Registry libraries.
It includes `@a`, `@e`, `@p`, `@r`, `@s`, and Dialogue `@initiator`, plus the existing legacy selector-condition chain (type/tag/name/gamemode/area/range/scores/family/hasitem).

The current Converter design is recorded in `docs/PROJECT_PLAN.md` but implementation is deferred while command blocks are expanded.

## Restored GIVE + Item Components (v0.4.0)

This build restores the legacy-tested GIVE command path without generated Registry libraries.

- `Command.give(target, item, amount)`
- `Command.giveAdvanced(target, item, amount, data, components)`
- direct/custom item IDs
- `can_destroy`
- `can_place_on`
- `lock_in_inventory`
- `lock_in_slot`
- `keep_on_death`

Runtime preview and future Converter export both use the same AST -> Compiler output.


## v0.4.1 fix

Renamed the TypeScript namespace `Item` to `MCItem` to avoid a duplicate identifier collision with Minecraft MakeCode core `Item`. Block IDs and the ITEM toolbox category are unchanged.
