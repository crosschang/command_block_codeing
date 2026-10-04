/**
 * M0 SAY round-trip + MakeCode source generation examples.
 * Manual Minecraft Education / MakeCode decompiler test remains the source
 * of truth for JavaScript -> Blocks behavior.
 */
function m0SayRoundTripSmokeTest(): void {
    const compiled = MCFunction.sayToMcfunction("Hello World");
    const parsedMessage = MCFunction.firstSayMessage(compiled);
    const roundTrip = MCFunction.roundTripMcfunction(compiled);
    const makeCode = MCFunction.mcfunctionToMakeCodeJavaScript(compiled);

    if (compiled != "say Hello World") {
        player.say("M0 FAIL: compile");
    } else if (parsedMessage != "Hello World") {
        player.say("M0 FAIL: parse");
    } else if (roundTrip != "say Hello World") {
        player.say("M0 FAIL: round-trip");
    } else if (makeCode != "MCFunction.sayCommand(\"Hello World\");") {
        player.say("M0 FAIL: MakeCode source");
    } else {
        player.say("M0 SAY source generation PASS");
    }
}
