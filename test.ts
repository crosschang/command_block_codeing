// Compile smoke test for the current public API.
FunctionFile.define("main", function () {
    Command.say("Hello World")
    Command.mcFunction("sub/test")
    Command.teleportToPosition(
        MCFunctionFields.self(MCFunctionFields.noSelectorCondition()),
        MCFunctionPositionFields.relative(0, 1, 0),
        false
    )
})

FunctionFile.define("board_game_system/ticking", function () {
    Command.say("tick")
})

FunctionFile.define("debug/double_bonus_e2e/controller", function () {
    Command.say("double bonus e2e")
})

FunctionFile.tickJson(function () {
    FunctionFile.tickValue("board_game_system/ticking")
    FunctionFile.tickValue("debug/double_bonus_e2e/controller")
})

// SUMMON SIMPLE: no options, name only, name + position, position only.
FunctionFile.define("test/summon_simple", function () {
    Command.summonSimple(
        MCFunctionEntityLibrary.villager()
    )

    Command.summonSimple(
        MCFunctionEntityLibrary.villager(),
        "Bob"
    )

    Command.summonSimple(
        MCFunctionEntityLibrary.villager(),
        "Bob",
        MCFunctionPositionFields.relative(0, 0, 0)
    )

    Command.summonSimple(
        MCFunctionEntityLibrary.villager(),
        "",
        MCFunctionPositionFields.relative(0, 0, 0)
    )
})

// SUMMON ADVANCED: none / rotation / facing position / facing entity / event / Education name placeholder.
FunctionFile.define("test/summon_advanced", function () {
    Command.summonAdvanced(
        MCFunctionEntityLibrary.villager(),
        MCFunctionPositionFields.relative(0, 0, 0)
    )

    Command.summonAdvanced(
        MCFunctionEntityLibrary.villager(),
        MCFunctionPositionFields.relative(0, 0, 0),
        Command.summonRotation(
            MCFunctionRotationFields.relative(0, 0)
        )
    )

    Command.summonAdvanced(
        MCFunctionEntityLibrary.villager(),
        MCFunctionPositionFields.relative(0, 0, 0),
        Command.summonFacingEntityOption(
            MCFunctionFields.self(MCFunctionFields.noSelectorCondition())
        )
    )

    Command.summonAdvanced(
        MCFunctionEntityLibrary.villager(),
        MCFunctionPositionFields.relative(0, 0, 0),
        Command.summonFacingPositionOption(
            MCFunctionPositionFields.relative(0, 0, 0)
        )
    )

    Command.summonAdvanced(
        MCFunctionEntityLibrary.villager(),
        MCFunctionPositionFields.relative(0, 2, 0),
        Command.summonNoOrientation(),
        MCFunctionSpawnEventLibrary.custom("minecraft:spawn_farmer")
    )

    Command.summonAdvanced(
        MCFunctionEntityLibrary.ironGolem(),
        MCFunctionPositionFields.relative(0, 0, 0),
        Command.summonNoOrientation(),
        "",
        "Iron Guardian"
    )
})


FunctionFile.define("test/summon_education_compat", function () {
    // SIMPLE: spaced name uses the name-first overload.
    Command.summonSimple(
        MCFunctionEntityLibrary.armorStand(),
        "test mp",
        MCFunctionPositionFields.relative(0, 0, 0)
    )

    // ADVANCED: no spawn event + name tag. Compiler emits " " in the event slot.
    Command.summonAdvanced(
        MCFunctionEntityLibrary.armorStand(),
        MCFunctionPositionFields.relative(0, 0, 0),
        Command.summonFacingEntityOption(
            MCFunctionFields.self(MCFunctionFields.noSelectorCondition())
        ),
        "",
        "test mp"
    )

    // Explicit event + name tag: no synthetic placeholder is needed.
    Command.summonAdvanced(
        MCFunctionEntityLibrary.armorStand(),
        MCFunctionPositionFields.relative(0, 0, 0),
        Command.summonFacingEntityOption(
            MCFunctionFields.self(MCFunctionFields.noSelectorCondition())
        ),
        MCFunctionSpawnEventLibrary.custom("minecraft:entity_spawned"),
        "test mp"
    )
})

// SUMMON runtime preview orientation emulation smoke test.
// These use armor stands so the result does not wander away like a villager.
// Invoke the FunctionFile preview manually while testing in Education.
FunctionFile.define("test/summon_preview_orientation", function () {
    Command.summonAdvanced(
        MCFunctionEntityLibrary.armorStand(),
        MCFunctionPositionFields.relative(3, 0, 0),
        Command.summonRotation(
            MCFunctionRotationFields.absolute(90, 0)
        )
    )

    Command.summonAdvanced(
        MCFunctionEntityLibrary.armorStand(),
        MCFunctionPositionFields.relative(5, 0, 0),
        Command.summonFacingPositionOption(
            MCFunctionPositionFields.relative(0, 0, 5)
        )
    )

    Command.summonAdvanced(
        MCFunctionEntityLibrary.armorStand(),
        MCFunctionPositionFields.relative(7, 0, 0),
        Command.summonFacingEntityOption(
            MCFunctionFields.self(MCFunctionFields.noSelectorCondition())
        )
    )
})


// EFFECT unified block/compiler/runtime smoke tests.
FunctionFile.define("test/effect", function () {
    // Default duration omitted: Minecraft default duration.
    Command.effect(
        MCFunctionFields.self(MCFunctionFields.noSelectorCondition()),
        Command.effectApply(MCFunctionEffectLibrary.speed())
    )

    // Timed Speed II for 10 seconds.
    Command.effect(
        MCFunctionFields.self(MCFunctionFields.noSelectorCondition()),
        Command.effectApply(MCFunctionEffectLibrary.speed()),
        Command.effectSeconds(10),
        1,
        false
    )

    // Infinite Speed II.
    Command.effect(
        MCFunctionFields.self(MCFunctionFields.noSelectorCondition()),
        Command.effectApply(MCFunctionEffectLibrary.speed()),
        Command.effectInfinite(),
        1,
        false
    )

    // Clear only Speed.
    Command.effect(
        MCFunctionFields.self(MCFunctionFields.noSelectorCondition()),
        Command.effectClear(MCFunctionEffectLibrary.speed())
    )

    // Clear every active effect.
    Command.effect(
        MCFunctionFields.self(MCFunctionFields.noSelectorCondition()),
        Command.effectClear()
    )
})
