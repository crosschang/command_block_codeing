# M0 SAY Round-trip 테스트

## A. Blocks → AST → Compiler

`SAY → mcfunction` 블록의 message를 `Hello World`로 설정한다.

예상 결과:

```text
say Hello World
```

## B. Parser → AST

`mcfunction에서 첫 SAY 메시지 읽기`에 다음 텍스트를 넣는다.

```text
say Hello World
```

예상 결과:

```text
Hello World
```

## C. Round-trip

`mcfunction SAY 왕복`에 다음을 넣는다.

```mcfunction
# M0 test
say Hello World

say Second line
```

예상 결과:

```mcfunction
# M0 test
say Hello World

say Second line
```

`mcfunction의 SAY 개수` 예상 결과는 `2`이다.

## D. Minecraft Education 실제 실행

`컴파일한 SAY 실행 "Hello World"` 블록을 실행한다.

내부 경로:

```text
Block input
→ Say AST
→ Compiler
→ "say Hello World"
→ player.execute(...)
```

Minecraft 채팅에 SAY 결과가 출력되면 runtime smoke test PASS.

## 아직 PASS로 간주하지 않는 기능

다음은 M0 Core가 성공한 뒤 별도 capability POC로 진행한다.

1. 실제 `.mcfunction` 파일 선택/읽기
2. 실제 `.mcfunction` 파일 다운로드/저장
3. Parser 결과로 현재 host Blockly Workspace에 SAY 블록 자동 생성

이 세 기능을 일반 GitHub Extension에서 실제로 가능한지 확인하기 전에는 구현 가능하다고 가정하지 않는다.
