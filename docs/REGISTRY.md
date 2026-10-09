# Registry Library

The Registry is **search/autocomplete data**, not Minecraft command meaning. Command meaning remains in the AST.

## V1 Registry libraries

- Items
- Blocks
- Entities
- Effects
- Particles
- Families
- Events
- Spawn Events
- Block States (initial verified common-state catalog)

There is no Quick Preset layer. Direct/custom input remains available, including custom namespaces, custom families, and custom behavior-pack events. Registry data is never a whitelist.

## Source vs derived data

```text
registry/source/bedrock/
├─ items.json
├─ blocks.json
├─ block_states.json
├─ entities.json
├─ effects.json
└─ particles.json

registry/derived/bedrock/
├─ families.json
├─ entity_events.json
├─ spawn_events.json
└─ block_state_usage.json
```

`families.json` is derived from `minecraft:type_family` components in Mojang vanilla behavior entity JSON.

`entity_events.json` is derived from the `events` object of each vanilla behavior entity JSON and drives the **EVENT** Toolbox category.

`spawn_events.json` is kept as a separate snapshot and drives the **SPAWN EVENT** category. Minecraft command documentation uses the same `EntityEvents` argument domain for `/event` and `/summon ... spawnEvent`, so the project does not invent an unsupported second Mojang enum. The categories are separate for authoring context.

## Event Toolbox layout

EVENT and SPAWN EVENT are separate categories. Inside each category, generated reporters are grouped by entity:

```text
EVENT
├─ Zombie
├─ Villager
├─ Skeleton
└─ ...

SPAWN EVENT
├─ Zombie
├─ Villager
├─ Skeleton
└─ ...
```

Reporter text also contains the entity name so MakeCode Toolbox Search can find values by entity or event text.

## Generate

From the project root in a VS Code PowerShell terminal:

```powershell
.\tools\generate_registry.ps1
```

Generated files live in `src/libraries/*_library.generated.ts` and must not be edited by hand.

## Update for a Minecraft release

Check upstream changes without modifying the project:

```powershell
.\tools\update_registry.ps1
```

Apply the current official snapshots and regenerate libraries:

```powershell
.\tools\update_registry.ps1 -Apply
```

The updater reads:

- Item / Block / Entity / Effect data from Microsoft Minecraft Creator documentation
- Particle identifiers from Mojang `bedrock-samples`
- Family and per-entity event relationships from Mojang vanilla behavior entity JSON
- Microsoft `EntityEvents` documentation as a sanity check for the command argument domain

It prints additions/removals before writing.

## Bootstrap note

The repository includes a Family bootstrap snapshot. Per-entity Event/Spawn Event snapshots can be regenerated from current Mojang data by running `update_registry.ps1 -Apply`. This avoids freezing a guessed event/entity relationship into the repository.

## Bedrock vs Education

Do not infer Education compatibility from the Bedrock snapshot. Education-only or version-different IDs belong in a separate Education overlay after official documentation or in-game verification. Direct input remains available in the meantime.

## Windows PowerShell execution policy

If Windows blocks `.ps1` execution, use the included `.cmd` wrappers (they use `-ExecutionPolicy Bypass` only for that process):

```powershell
.\tools\update_registry.cmd
.\tools\update_registry.cmd -Apply
.\tools\generate_registry.cmd
```

No Python installation is required.

## Block State Library (initial phase)

Block states are shared authoring data for SETBLOCK / FILL / CLONE and future
`execute if/unless block`. The runtime AST still accepts direct/custom states.
The initial library exposes verified common orientation, activation, and structure
states (for example `pillar_axis`, `lever_direction`, `open_bit`,
`button_pressed_bit`, and `upside_down_bit`) while the registry relationship
snapshot is expanded from official block listings.

Important: built-in legacy `facing_direction` is numeric for many vanilla
blocks, while `minecraft:facing_direction` is a distinct string-valued state
used by placement-direction traits/custom blocks. Do not merge them.

The initial `block_state_usage.json` is representative, not exhaustive, so it
must not yet be used as a hard whitelist for all vanilla blocks.

The first Block State Library is hand-authored from the verified registry snapshot
because state reporters need typed dropdowns (enum/number/bit) rather than the
flat generated-ID pattern used by items/blocks/entities. Generator integration
for the complete state catalog is a later registry phase; the JSON snapshots are
the data source and direct/custom input remains available.
