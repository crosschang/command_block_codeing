/**
 * Preview-only world/session state.
 *
 * This is NOT Minecraft's Source of Truth and is never exported to .mcfunction.
 * It only remembers information authored through this extension so OUTPUT_HIDDEN
 * commands can give useful feedback in the MakeCode runtime.
 */
namespace MCFunctionPreview {
    let knownTagNames: string[] = [];

    /** Remember a tag token referenced by a structured TAG add/remove block. */
    export function rememberTagName(name: string): void {
        if (!name || name.length == 0) return;
        if (isInternalPreviewTag(name)) return;

        for (let i = 0; i < knownTagNames.length; i++) {
            if (knownTagNames[i] == name) return;
        }

        knownTagNames.push(name);
    }

    /** Return a copy so callers cannot mutate Preview state accidentally. */
    export function getKnownTagNames(): string[] {
        let result: string[] = [];
        for (let i = 0; i < knownTagNames.length; i++) {
            result.push(knownTagNames[i]);
        }
        return result;
    }

}
