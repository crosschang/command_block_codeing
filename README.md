# command_block_codeing

Minecraft Education / Bedrock용 `.mcfunction` 양방향 블록 편집기 프로젝트입니다.

현재 단계는 **M0 — SAY MakeCode Decompiler POC v2**입니다.

## 현재 목표

먼저 `say` 하나로 다음 경로를 검증합니다.

```text
MakeCode SAY 블록
→ Block Adapter
→ Say AST
→ Compiler
→ say Hello World
```

반대 방향은 v2에서 다음과 같이 검증합니다.

```text
say Hello World
→ .mcfunction Parser
→ Say AST
→ MakeCode Source Generator
→ MCFunction.sayCommand("Hello World");
→ MakeCode JavaScript
→ Blocks 전환
→ SAY Hello World 블록
```

이번 버전은 **현재 Blockly Workspace를 직접 수정하지 않습니다.**
먼저 Minecraft Education Code Builder에서 MakeCode 자체의 JavaScript → Blocks 디컴파일러가 이 경로를 정상 처리하는지 확인합니다.

## 저장소 / Extension 불러오기

기준 저장소:

```text
https://github.com/crosschang/command_block_codeing
```

Minecraft Education의 Code Builder → MakeCode → 확장에서 위 GitHub 저장소를 추가합니다.

## 주요 블록

### 실제 SAY 명령 블록

```text
SAY Hello World
```

내부 경로:

```text
Block → Say AST → Compiler → player.execute("say Hello World")
```

### SAY → mcfunction

```text
SAY "Hello World" → mcfunction
```

결과:

```mcfunction
say Hello World
```

### mcfunction → MakeCode JavaScript

입력:

```mcfunction
say Hello World
say Second Line
```

생성 결과:

```ts
MCFunction.sayCommand("Hello World");
MCFunction.sayCommand("Second Line");
```

## 가장 중요한 M0 v2 테스트

MakeCode에서 JavaScript로 전환한 뒤 다음 한 줄을 넣습니다.

```ts
MCFunction.sayCommand("Hello World");
```

그 다음 Blocks로 돌아갑니다.

### PASS

Workspace에 다음 블록이 나타나야 합니다.

```text
SAY Hello World
```

이 테스트가 PASS하면 다음 경로를 정식 채택합니다.

```text
.mcfunction
→ Parser
→ AST
→ MakeCode TypeScript
→ MakeCode native decompiler
→ Blocks
```

## M0 보존 원칙

Parser는 현재 `say`만 구조화하지만 다음 내용은 Round-trip에서 소실시키지 않습니다.

- `#` 주석
- 빈 줄
- 아직 지원하지 않는 명령 → 내부 `RawCommand`

단, **MakeCode TypeScript 생성기는 M0에서 SAY 명령만 생성**합니다. Raw/주석의 블록 표현은 아직 구현하지 않습니다.

## 다음 단계

JavaScript → Blocks 테스트가 PASS한 뒤에만 진행합니다.

1. 실제 `.mcfunction` 파일 Import 방식 검증
2. Parser 결과 TypeScript를 현재 MakeCode 프로젝트에 반영하는 공식 경로 조사
3. 실제 자동 블록 생성 UX 구현
4. SAY 전체 Round-trip 완성
5. 이후 `give`, `tp`, `setblock` 순으로 확대

자세한 테스트 절차는 [`docs/M0_SAY_TEST.md`](docs/M0_SAY_TEST.md)를 참고합니다.
