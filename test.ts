// M0-2 compile smoke test.
// Visible block/runtime path:
Command.say("Hello World")

// Core pipeline target result: "say Hello World"
let compiledSay = Command.sayToMcfunction("Hello World")
