# command_block_codeing

Minecraft Education의 Code Builder / MakeCode에서 사용할 Command 블록 프로젝트입니다.

현재 단계는 **M0-1**이며, 아직 AST / Parser / Compiler / Registry를 구현하지 않습니다.
먼저 MakeCode 블록 자체가 안정적으로 동작하는지 확인합니다.

## 현재 블록

```text
Command
└─ SAY [Hello World]
```

## 테스트 순서

1. Minecraft Education에서 Code Builder를 엽니다.
2. MakeCode 프로젝트에서 이 GitHub Extension을 추가합니다.
3. Toolbox에 `Command` 카테고리가 표시되는지 확인합니다.
4. `SAY Hello World` 블록을 배치합니다.
5. JavaScript로 전환했을 때 아래 형태인지 확인합니다.

```ts
Command.say("Hello World")
```

6. 다시 Blocks로 돌아왔을 때 SAY 블록이 유지되는지 확인합니다.
7. Minecraft로 돌아가 `Hello World`가 채팅에 출력되는지 확인합니다.

## 이번 단계에서 하지 않는 것

- `.mcfunction` 출력
- `.mcfunction` 읽기
- Parser
- Compiler
- AST
- Registry
- Workspace 자동 생성

위 4개 핵심 테스트가 PASS한 뒤 다음 단계로 진행합니다.
