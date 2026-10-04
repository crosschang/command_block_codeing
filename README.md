# command_block_codeing

Minecraft Education / Bedrock용 `.mcfunction` 양방향 블록 편집기를 다시 설계하는 프로젝트입니다.

현재 단계는 **M0 — SAY 양방향 Round-trip POC**입니다.

## 이번 M0의 목표

```text
MakeCode SAY 블록 입력
→ Block Adapter
→ Say AST
→ Compiler
→ say Hello World
```

반대 방향:

```text
say Hello World
→ .mcfunction Parser
→ Say AST
→ Block Adapter
→ 블록에서 사용할 수 있는 message 값
```

현재는 **Core 양방향 경로를 먼저 검증**합니다.

실제 `.mcfunction` 파일 다운로드/업로드와 Parser 결과를 현재 MakeCode Workspace에 자동으로 블록 생성하는 기능은 다음 capability POC에서 검증합니다. 일반 GitHub Extension이 host Blockly Workspace를 직접 수정할 수 있다고 가정하지 않습니다.


## 저장소 / Extension 불러오기

기준 저장소:

```text
https://github.com/crosschang/command_block_codeing
```

Minecraft Education의 Code Builder → MakeCode → 확장에서 위 GitHub 저장소를 추가합니다.

## MakeCode 블록

`MCFunction` 카테고리에서 다음 블록을 테스트합니다.

```text
SAY "Hello World" → mcfunction
```

결과:

```mcfunction
say Hello World
```

```text
mcfunction에서 첫 SAY 메시지 읽기 "say Hello World"
```

결과:

```text
Hello World
```

```text
mcfunction SAY 왕복 "say Hello World"
```

결과:

```mcfunction
say Hello World
```

`컴파일한 SAY 실행`은 Block → AST → Compiler에서 생성된 명령을 실제 Minecraft Education에서 실행하기 위한 M0 테스트용 블록입니다.

## M0에서 보존하는 것

Parser는 `say`만 구조화하지만 다음은 소실시키지 않습니다.

- `#` 주석
- 빈 줄
- 아직 지원하지 않는 명령 → 내부 `RawCommand`

따라서 M0부터 `.mcfunction` 내용을 조용히 삭제하지 않는 방향을 유지합니다.

## 현재 성공 기준

1. Extension이 Minecraft Education Code Builder에서 로드된다.
2. `SAY → mcfunction`이 `say Hello World`를 만든다.
3. Parser가 `say Hello World`에서 `Hello World`를 읽는다.
4. `say Hello World → Parser → AST → Compiler`가 다시 `say Hello World`가 된다.
5. `컴파일한 SAY 실행`이 실제 Minecraft에서 실행된다.
6. 다음 단계에서 실제 파일 I/O와 Workspace 블록 생성 가능 여부를 검증한다.

자세한 계획은 [`docs/PROJECT_GUIDELINES.md`](docs/PROJECT_GUIDELINES.md)를 참고합니다.
