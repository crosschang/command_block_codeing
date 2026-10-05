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
