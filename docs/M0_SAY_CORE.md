# M0-2 SAY Core

## 목표

현재 Education에서 PASS한 `COMMAND -> SAY` 블록을 변경하지 않고 다음 Core 경로를 추가한다.

```text
message -> Block Adapter -> Say AST -> Compiler -> say <message>
```

## 고정 사항

- namespace: `Command`
- blockId: `command_say`
- JavaScript: `Command.say("...")`
- 인게임 실행: 기존 `player.say(message)` 유지
- `main.ts`는 사용자 Workspace 소스이므로 Core 구현을 넣지 않는다.

## 성공 기준

```ts
Command.sayToMcfunction("Hello World")
```

의 결과가 정확히 다음과 같아야 한다.

```text
say Hello World
```

동시에 기존 SAY 블록의 Blocks ↔ JavaScript 왕복과 Minecraft 실행이 깨지면 안 된다.
