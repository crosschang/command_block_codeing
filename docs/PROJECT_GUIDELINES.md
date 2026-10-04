# command_block_codeing — Project Guidelines

업데이트: 2026-10-04 — SAY Round-trip Restart
저장소: `crosschang/command_block_codeing`

---

## 1. 프로젝트 정의

이 프로젝트는 Minecraft Bedrock / Minecraft Education에서 실제 사용하는 `.mcfunction` 명령을 MakeCode 블록으로 만들고, 기존 `.mcfunction`을 다시 읽어 블록으로 편집할 수 있는 **양방향 Command Visual Editor**를 목표로 한다.

최종 흐름:

```text
MakeCode Blocks
→ Block Adapter
→ Minecraft Command AST
→ Compiler
→ .mcfunction

.mcfunction
→ Parser
→ Minecraft Command AST
→ Block Adapter
→ MakeCode Blocks
```

단, 재시작 이후에는 기능을 넓게 먼저 만들지 않는다.
**`say` 하나로 양방향 전체 경로를 먼저 검증한 뒤 명령을 확대한다.**

---

## 2. 최우선 실행 환경

V1의 기준 환경:

```text
Minecraft Education
→ C / Code Builder
→ Minecraft MakeCode
→ GitHub Extension
```

핵심 기능은 다음에 의존하지 않는다.

- Browser Companion
- Chrome / Edge 별도 확장
- 일반 Vite 웹앱
- Starter Project
- Persistent Share Link
- `runtime_ready.ts`
- `pxt.json documentation` 자동 안내

외부 도구는 향후 보조 기능으로 추가할 수 있지만, 없어도 Core 기능은 동작해야 한다.

---

## 3. 현재 최우선 목표 — M0 SAY 양방향 POC

새 프로젝트의 첫 성공 기준은 다음 한 경로다.

### Blocks → .mcfunction

```text
SAY 블록 입력 "Hello World"
→ Block Adapter
→ Say AST
→ Compiler
→ say Hello World
```

### .mcfunction → AST → Blocks 방향

```text
say Hello World
→ Parser
→ Say AST
→ Block Adapter
→ "Hello World"
→ 최종적으로 MakeCode SAY 블록 생성
```

현재 첫 구현에서는 Parser/Compiler/Core 경로부터 검증한다.

다음 두 기능은 **실제 MakeCode capability를 확인한 뒤** 연결한다.

1. 실제 `.mcfunction` 파일 업로드/다운로드
2. Parser 결과를 현재 host Blockly Workspace의 블록으로 자동 삽입

일반 GitHub Extension에서 위 기능이 가능하다고 미리 가정하지 않는다.

---

## 4. M0 성공 기준

M0 Core PASS:

1. GitHub Extension 로드 성공
2. `MCFunction` 카테고리 표시
3. SAY 입력이 `SayCommand AST`로 변환됨
4. Compiler가 `say Hello World` 생성
5. Parser가 `say Hello World`를 `SayCommand AST`로 변환
6. Parser → Compiler Round-trip 결과가 `say Hello World`
7. 실제 Minecraft Education에서 Compiler 결과 실행 PASS
8. 주석/빈 줄/미지원 명령이 조용히 소실되지 않음

M0 Core 이후 별도 Capability PASS:

9. `.mcfunction` 실제 파일 Import
10. `.mcfunction` 실제 파일 Export
11. Parser AST → 현재 MakeCode Workspace의 SAY 블록 생성

9~11이 검증되기 전에는 Visual IDE 전체 구현을 확대하지 않는다.

---

## 5. Source of Truth

명령의 의미는 장기적으로 **Minecraft Command AST**가 Source of Truth다.

금지:

```text
MakeCode 블록 함수마다
"give " + target + ...
```

같은 임시 문자열 조립을 전체 설계의 중심으로 사용하는 것.

권장:

```text
Block input
→ AST
→ Compiler
```

반대 방향:

```text
command text
→ Parser
→ AST
→ Block Adapter
```

---

## 6. 현재 M0 소스 구조

```text
command_block_codeing/
├─ pxt.json
├─ main.ts
├─ main.blocks
├─ test.ts
├─ README.md
│
├─ commands/
│  └─ say.ts
│
├─ src/
│  ├─ ast/
│  │  ├─ command.ts
│  │  └─ function_file.ts
│  ├─ blocks/
│  │  └─ say_adapter.ts
│  ├─ parser/
│  │  └─ parser.ts
│  └─ compiler/
│     └─ compiler.ts
│
└─ docs/
   ├─ PROJECT_GUIDELINES.md
   └─ M0_SAY_TEST.md
```

새 `.ts` 파일을 추가하면 반드시 `pxt.json`의 `files` 포함 여부를 확인한다.

`main.ts`에는 MakeCode에 노출하는 블록 API와 Adapter 호출만 두고, Parser/Compiler의 실제 로직을 몰아넣지 않는다.

---

## 7. M0 AST 범위

M0에서 구조화하는 정식 명령은 `say` 하나다.

```text
CommandNode
├─ SayCommand
└─ RawCommand
```

`RawCommand`는 M0에서 UI 명령을 확대하기 위한 기능이 아니라 **미지원 명령 소실 방지용 내부 fallback**이다.

`.mcfunction` 줄은 최소한 다음을 구분한다.

```text
Command
Comment
Empty
```

따라서 다음 입력을 Round-trip할 때:

```mcfunction
# comment
say Hello

unknown_command value
```

아직 지원하지 않는 `unknown_command`를 삭제하지 않는다.

---

## 8. Parser 원칙

Parser는 문자열을 직접 실행하지 않는다.

```text
.mcfunction text
→ Parser
→ AST
```

M0 지원:

- `say <message>` → `SayCommand`
- `# ...` → Comment
- 빈 줄 → Empty
- 기타 명령 → RawCommand

M0 이후 명령이 지원될 때 RawCommand에서 정식 AST로 단계적으로 승격한다.

---

## 9. Compiler 원칙

Compiler만 AST를 Minecraft 명령 문자열로 변환한다.

M0:

```text
SayCommand("Hello World")
→ say Hello World
```

`.mcfunction` Compiler는 줄 순서를 유지한다.

텍스트 포맷이 100% 동일할 필요는 없지만 Minecraft에서의 의미가 달라져서는 안 된다.

---

## 10. Block Adapter 원칙

MakeCode Block API와 Core AST 사이에 Adapter를 둔다.

```text
MakeCode primitive input
→ Block Adapter
→ AST
```

반대 방향도 Adapter가 담당한다.

```text
AST
→ Block Adapter
→ MakeCode block-compatible value
```

실제 Blockly Workspace 생성 API가 확인되면 이 계층 위에 Workspace Adapter를 추가한다.

Core Parser/Compiler가 Blockly DOM에 직접 접근하지 않는다.

---

## 11. 파일 Import / Export 우선 검증

이번 재시작에서는 파일 기능을 마지막까지 미루지 않는다.

SAY Core Round-trip 직후 바로 다음을 POC한다.

```text
A. .mcfunction 파일을 Code Builder에서 어떻게 선택/읽을 것인가?
B. 결과 .mcfunction을 어떻게 실제 파일로 저장할 것인가?
C. Parser 결과를 어떻게 현재 Workspace 블록으로 만들 것인가?
```

이 세 가지가 프로젝트의 실제 Visual IDE 가능성을 결정한다.

불가능한 API를 있다고 가정해서 대규모 Command/Registry 구현을 먼저 하지 않는다.

---

## 12. 다음 명령 확대 순서

SAY 전체 경로와 파일/Workspace Capability가 검증된 뒤 다음 순서로 확대한다.

```text
M1  SAY 전체 Round-trip + File/Workspace Capability
M2  Selector / Position / Number 공통 타입
M3  give / tp / setblock
M4  소규모 Registry + Quick Preset + 직접 ID 입력
M5  전체 Registry UI 성능 검증
M6  summon / kill / clear / effect / tag / gamemode
M7  fill / clone / function
M8  scoreboard
M9  execute
M10 RawText / tellraw / titleraw / sound / particle / Education 명령
```

Scoreboard / Execute 같은 복잡한 명령을 SAY 경로가 완성되기 전에 먼저 구현하지 않는다.

---

## 13. Registry 원칙

Registry는 처음부터 수천 개 reporter 블록을 만들지 않는다.

순서:

```text
Quick Preset + 직접 입력
→ 소규모 Registry
→ 100개 수준
→ 전체 Registry
```

Item / Block / Entity 등 고정 ID는 향후 versioned Registry로 관리한다.

Custom Namespace는 차단하지 않는다.

검색 UI는 **Minecraft Education 인게임 Code Builder에서 실제 동작하는 방식만** 핵심 기능으로 채택한다.

---

## 14. 공통 타입 원칙

명령 확대 이후 다음 타입을 명령마다 중복 구현하지 않는다.

- Selector
- Position
- Rotation
- Facing
- Anchor
- Range
- Number
- Boolean
- Item
- Block
- Entity
- Particle
- Sound
- Effect
- RawText
- User-defined ID

하지만 M0 SAY에서 필요하지 않은 타입을 미리 대량 구현하지 않는다.

---

## 15. 오류 및 보존 원칙

최종 Validator는 다음 단계로 구분한다.

```text
ERROR
WARNING
INFO
```

하지만 Parser는 지원하지 않는 명령을 삭제하지 않는다.

```text
Unsupported command
→ RawCommand
→ 원본 보존
```

새 Minecraft 업데이트가 나와도 기존 `.mcfunction`이 Parser 때문에 손상되어서는 안 된다.

---

## 16. 실제 Minecraft 검증 우선

코드가 TypeScript에서 컴파일된다고 PASS가 아니다.

각 단계의 최종 판단은 Minecraft Education에서 한다.

특히 확인:

- Extension 로드
- Blocks ↔ JavaScript 전환
- 프로젝트 재오픈
- 생성 command 실행
- Parser/Compiler 결과
- 파일 I/O
- Workspace 생성

Bedrock과 Education의 지원 범위를 혼동하지 않는다.

---

## 17. Legacy 코드 사용 원칙

기존 레거시 프로젝트는 버리지 않지만 그대로 복원하지 않는다.

재사용 후보:

- AST 아이디어
- Parser 로직
- Compiler 로직
- Raw Command 보존
- 검증된 Minecraft 문법

자동 재사용 금지:

- READY 시스템
- Starter 강제 구조
- Browser Companion 필수 의존
- Searchable Grid POC
- 대규모 generated reporter
- 기존 명령별 임시 UI

가져오는 코드는 현재 최소 구조에 맞게 최적화한 뒤 다시 테스트한다.

---

## 18. 현재 작업 원칙 한 줄

```text
먼저 SAY 하나로
Blocks → AST → Compiler → .mcfunction
→ Parser → AST → Blocks
전체 경로를 실제로 성공시킨다.
```

이 경로가 완성되기 전에는 명령 개수를 늘리는 것이 우선순위가 아니다.
