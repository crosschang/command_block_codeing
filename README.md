# command_block_codeing

Minecraft Education / Bedrock용 MakeCode(PXT) command block 프로젝트입니다.
목표는 실제 명령 제작에 사용할 수 있는 블록 IDE를 만들고, 이후 같은 Core Engine으로 `.mcfunction` 양방향 변환을 지원하는 것입니다.

## Core

```text
MakeCode Block
→ Block Adapter
→ Minecraft Command AST
→ Validator
→ Compiler
→ player.execute()   (Minecraft Education Preview)
→ .mcfunction        (future Converter)
```

명령 의미의 Source of Truth는 블록 문자열이 아니라 Minecraft Command AST입니다.

## Function File

```ts
FunctionFile.define("main", function () {
    Preview.ready()
    Command.say("Hello World")
    Command.mcFunction("sub/test")
})
```

- Preview: 채팅에 `main`을 입력해 실행
- Converter: `FunctionFile.define("main", ...)`를 `functions/main.mcfunction`으로 해석
- `Command.mcFunction("sub/test")`는 MakeCode 안에 같은 FunctionFile이 있으면 Preview callback을 먼저 실행하고, 없으면 실제 `function sub/test` 명령으로 fallback

## PREVIEW READY

Minecraft Education Cold Start에서 첫 command 실행이 늦거나 누락되는 현상을 실제 테스트에서 확인했습니다.
사용자가 `FunctionFile` 안에 `Preview.ready()` 블록을 **직접 배치**하면 첫 command가 즉발로 동작했습니다.

```ts
FunctionFile.define("main", function () {
    Preview.ready()
    Command.give(/* ... */)
})
```

`Preview.ready()`는 내부적으로 Preview용 SAY를 실행합니다. 미래 Converter에서는 이 블록을 메타 블록으로 취급하여 `.mcfunction` 결과에서 제외합니다.

## COMMAND

현재 복구/구현된 명령:

- `SAY`
- `MCFUNCTION`
- `GIVE`
- `RAW COMMAND`

`RAW COMMAND`는 아직 구조화 블록으로 지원하지 않는 명령을 원문 그대로 AST에 보존하고 실행하기 위한 escape hatch입니다.

## Selector

레거시에서 검증했던 Selector Core를 복구했습니다.

- `@a`, `@e`, `@p`, `@r`, `@s`
- Dialogue용 `@initiator`
- type / tag / name / gamemode / 좌표·영역 / 거리 / count / level / rotation / scores / family / hasitem

## Full Registry Library

Quick Preset은 사용하지 않습니다.

현재 검색용 Registry Library:

- Item
- Block
- Entity
- Effect
- Particle
- Family
- Event
- Spawn Event

Item/Block/Entity/Effect/Particle/Family는 검색 가능한 reporter block으로 생성합니다.
Event와 Spawn Event는 **서로 다른 Toolbox 카테고리**로 만들고, 각 카테고리 안에서 `Zombie`, `Villager`, `Skeleton`처럼 엔티티별 구분선으로 나눕니다.

```text
EVENT
├─ Zombie
│  ├─ zombie event minecraft:...
│  └─ ...
├─ Villager
│  └─ ...

SPAWN EVENT
├─ Zombie
│  ├─ zombie spawn event minecraft:...
│  └─ ...
└─ Villager
   └─ ...
```

직접 입력과 Custom Namespace/Custom Event도 계속 허용합니다. Registry는 whitelist가 아닙니다.

Registry 데이터와 생성 코드는 분리되어 있습니다.

```text
registry/source/bedrock/*.json
registry/derived/bedrock/*.json
        ↓
tools/generate_registry.ps1
        ↓
src/libraries/*_library.generated.ts
```

`Family`, `Event`, `Spawn Event`는 Mojang vanilla behavior entity JSON에서 파생할 수 있습니다.
처음 받은 프로젝트에서 Event/Spawn Event가 비어 있다면 아래 명령을 한 번 실행하면 현재 Mojang 데이터로 채워집니다.

```powershell
.\tools\update_registry.ps1 -Apply
```

Minecraft 업데이트 확인:

```text
.\tools\update_registry.ps1
```

변경 내용을 확인한 뒤 적용:

```text
.\tools\update_registry.ps1 -Apply
```

자세한 내용은 `docs/REGISTRY.md`를 참고하세요.

## Bedrock / Education

Bedrock Registry와 Minecraft Education 전용 차이는 임의로 섞지 않습니다.
Education 전용 값은 공식 자료 또는 실제 Education 검증 후 별도 overlay로 관리합니다.
Registry에 없는 값도 Direct Input으로 사용할 수 있습니다.

## 다음 단계

현재는 Command Blocks와 공통 타입을 먼저 확장합니다.
`.mcfunction` Parser / Converter UI는 Command Core가 충분히 안정화된 뒤 연결합니다.
