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

// SUMMON ADVANCED: none / rotation / facing position / facing entity / event / name.
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
