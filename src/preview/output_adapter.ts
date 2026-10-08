/**
 * Shared Preview output helpers.
 *
 * Keep all extra chat/tellraw output inside Preview. Compiler output remains the
 * actual Minecraft command authored by the user.
 */
namespace MCFunctionPreview {
    /**
     * Show one Preview-only informational line to the current MakeCode player.
     *
     * Do not route Preview UI text through player.say(). Minecraft Education can
     * parse punctuation in that path as command syntax in some runtime cases.
     * tellraw/rawtext keeps UI punctuation such as [Preview] inside a JSON text
     * component instead of the command grammar.
     */
    export function previewSay(message: string): void {
        let text = previewEscapeJsonText("[Preview] " + message);
        player.execute(
            "tellraw @s {\"rawtext\":[{\"text\":\"" + text + "\"}]}"
        );
    }

    /**
     * Execute a legacy execute -> tellraw line as each selected entity while
     * sending the rendered message only to the current query's marked viewer.
     *
     * rawtext may use {"selector":"@s"}; in that nested execution context @s is
     * the selected entity, so players and non-player entities can both be named.
     */
    export function previewTellFromExecutors(
        executorSelector: string,
        viewerTag: string,
        rawtextJson: string
    ): boolean {
        if (!executorSelector || executorSelector.length == 0) return false;
        if (!viewerTag || viewerTag.length == 0) return false;
        if (!rawtextJson || rawtextJson.length == 0) return false;

        return player.execute(
            "execute " + executorSelector +
            " ~ ~ ~ tellraw @a[tag=" + viewerTag + "] " + rawtextJson
        );
    }

    /** Escape text for a JSON rawtext text component. */
    export function previewEscapeJsonText(value: string): string {
        let result = "";
        for (let i = 0; i < value.length; i++) {
            let ch = value.charAt(i);
            if (ch == "\\" || ch == "\"") {
                result = result + "\\";
            }
            if (ch == "\n") {
                result = result + "\\n";
            } else if (ch == "\r") {
                result = result + "\\r";
            } else if (ch == "\t") {
                result = result + "\\t";
            } else {
                result = result + ch;
            }
        }
        return result;
    }
}
