# M0 SAY 양방향 POC v2 테스트

## 목표

이번 버전의 핵심은 `.mcfunction`의 `say`를 파싱한 뒤 **MakeCode가 다시 Blocks로 디컴파일할 수 있는 TypeScript 호출**을 생성하는 것이다.

```text
say Hello World
→ Parser
→ Say AST
→ MakeCode Source Generator
→ MCFunction.sayCommand("Hello World");
→ MakeCode JavaScript Editor
→ Blocks 전환
→ [SAY Hello World] 블록
```

> 이번 버전은 현재 Blockly Workspace를 직접 수정하지 않는다. 먼저 MakeCode 자체 JavaScript → Blocks 디컴파일 경로가 실제 Minecraft Education Code Builder에서 동작하는지를 검증한다.

## 테스트 A — Extension 로드

`command_block_codeing` Extension을 추가하고 `MCFunction` 카테고리에 다음 블록이 보이는지 확인한다.

- `SAY Hello World`
- `SAY Hello World → mcfunction`
- `mcfunction → MakeCode JavaScript say Hello World`

## 테스트 B — SAY 블록 실행

`SAY Hello World` 블록을 `시작하면`에 넣고 Minecraft로 돌아간다.

예상 결과:

```text
Hello World
```

## 테스트 C — JavaScript → Blocks 핵심 테스트

MakeCode에서 **JavaScript** 탭으로 전환한다.

다음 한 줄을 입력한다.

```ts
MCFunction.sayCommand("Hello World");
```

그 다음 **Blocks**로 전환한다.

### PASS 기준

다음 블록이 실제 Workspace에 나타난다.

```text
[SAY Hello World]
```

이 테스트가 PASS하면 `.mcfunction → AST → MakeCode TypeScript → Blocks` 경로를 채택한다.

## 테스트 D — 변환기 출력 확인

`mcfunction → MakeCode JavaScript` 블록에 다음을 넣는다.

```mcfunction
say Hello World
say Second Line
```

예상 생성 소스:

```ts
MCFunction.sayCommand("Hello World");
MCFunction.sayCommand("Second Line");
```

`변환된 MakeCode 코드 채팅으로 보기` 블록을 이용하면 M0 테스트용으로 각 생성 줄을 Minecraft 채팅에서 확인할 수 있다.

## 다음 단계

C 테스트가 PASS한 뒤에만 다음을 진행한다.

1. 실제 `.mcfunction` 파일 Import UI 조사
2. 생성 TypeScript를 현재 프로젝트 소스로 넣을 수 있는 Editor 경로 조사
3. 자동 삽입이 불가능하면 MakeCode가 공식적으로 허용하는 Import 진입점을 설계
4. SAY 실제 자동 블록 생성 완성
