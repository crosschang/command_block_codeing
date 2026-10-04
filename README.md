# command_block_codeing

Minecraft Education의 Code Builder / MakeCode에서 사용할 Command 블록 프로젝트입니다.

현재 단계는 **M0-3**입니다. 이미 실제 Education에서 확인한 `COMMAND -> SAY` 블록의 UI와 Blocks ↔ JavaScript 왕복 형태는 유지한 채, 뒤에 최소 Core 구조를 연결합니다.

## 현재 고정된 블록

```text
COMMAND
└─ SAY [Hello World]
```

JavaScript 표현:

```ts
Command.say("Hello World")
```

이 블록의 `blockId`, 표시 모양, 인게임 `player.say()` 동작은 이번 단계에서 변경하지 않습니다.

## M0-3 Core + 파일 출력 흐름

```text
SAY 블록의 message
      ↓
CommandBlockAdapter
      ↓
CommandAST.SayCommand
      ↓
CommandCompiler
      ↓
say Hello World
```

현재 Core 결과는 JavaScript에서 다음 API로 확인할 수 있습니다.

```ts
Command.sayToMcfunction("Hello World")
```

반환값:

```text
say Hello World
```

`sayToMcfunction()`은 M0-3에서도 Core 확인용 내부/JavaScript API로 유지합니다. 정상 동작이 확인된 기존 SAY 블록 UI를 건드리지 않고 Core부터 검증하기 위한 내부/JavaScript API입니다.

## 파일 역할

```text
custom.ts
  COMMAND 카테고리 / SAY 블록 API

main.ts
  사용자의 MakeCode Workspace 소스
  Core 또는 블록 API를 넣지 않음

src/ast/command.ts
  SAY AST

src/blocks/say_adapter.ts
  블록 입력 → SAY AST

src/compiler/compiler.ts
  SAY AST → .mcfunction 한 줄
```

## 이번 테스트

1. 기존처럼 `COMMAND -> SAY` 블록이 보이는지 확인합니다.
2. 이벤트 블록에 `SAY "Hello World"`를 연결합니다.
3. Blocks → JavaScript에서 `Command.say("Hello World")`가 유지되는지 확인합니다.
4. JavaScript → Blocks로 돌아왔을 때 SAY 블록이 그대로 복원되는지 확인합니다.
5. Minecraft에서 기존처럼 `Hello World`가 출력되는지 확인합니다.
6. JavaScript에서 필요하면 아래 식의 반환값이 `say Hello World`인지 확인합니다.

```ts
Command.sayToMcfunction("Hello World")
```

## 아직 하지 않는 것

- Parser
- `.mcfunction` 파일 읽기
- `.mcfunction` 파일 다운로드/저장 UI
- Parser 결과의 Workspace 자동 생성
- Registry
- Give / TP / SetBlock

M0-3에서는 Minecraft Education의 공식 File Read & Write Extension을 선택적으로 연결해 로컬 파일 출력을 테스트합니다.


## M0-3: 로컬 파일 출력 POC

Minecraft Education에는 공식 **File Read & Write** Extension이 있습니다. 이 프로젝트는 File Extension이 호스트 프로젝트에 추가된 경우에만 `src/project/file_export.ts`를 포함하도록 `fileDependencies`를 사용합니다.

따라서 기존 COMMAND → SAY 블록은 그대로 유지되며, File Extension을 추가하면 다음 테스트 블록이 추가됩니다.

```text
SAY [Hello World] 를 파일 [path] 에 저장
```

먼저 `main.txt`로 파일 쓰기를 확인한 뒤, 실제 목표인 `main.mcfunction` 확장자를 테스트합니다. 공식 문서는 `.txt`와 `.csv`를 명시하므로 `.mcfunction` 직접 생성 가능 여부는 이번 POC에서 실제 Education 환경으로 확인합니다.

상세 절차: `docs/M0_SAY_FILE_EXPORT.md`
