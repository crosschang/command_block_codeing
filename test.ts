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
