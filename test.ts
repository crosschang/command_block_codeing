/**
 * M0 SAY round-trip examples.
 *
 * Manual Education test remains the source of truth for runtime behavior.
 */
function m0SayRoundTripSmokeTest(): void {
    const compiled = MCFunction.sayToMcfunction("Hello World");
    const parsedMessage = MCFunction.firstSayMessage(compiled);
    const roundTrip = MCFunction.roundTripMcfunction(compiled);

    if (compiled != "say Hello World") {
        player.say("M0 FAIL: compile");
    } else if (parsedMessage != "Hello World") {
        player.say("M0 FAIL: parse");
    } else if (roundTrip != "say Hello World") {
        player.say("M0 FAIL: round-trip");
    } else {
        player.say("M0 SAY round-trip PASS");
    }
}
