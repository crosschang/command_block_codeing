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
