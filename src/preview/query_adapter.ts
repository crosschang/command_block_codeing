/**
 * Preview Query Adapter.
 *
 * player.execute() returns command success/failure but does not expose textual
 * output for some valid Bedrock/Education commands. This adapter provides
 * Preview-only feedback without changing the AST or Compiler grammar.
 *
 * First implementation: TAG list.
 * - TAG add/remove remain normal DIRECT commands.
 * - The Preview observes their tag names as the session's known tag vocabulary.
 * - TAG list snapshots the original selector with opaque _cbi_ internal tags,
 *   then asks Minecraft itself which marked entities currently have each known
 *   user tag.
 * - This preserves @p/@r/count selector selection because the original target is
 *   marked once before per-tag checks.
 * - Output is SESSION_KNOWN: tags not referenced through this extension in the
 *   current Preview session may be absent from the displayed list.
 */
namespace MCFunctionPreview {
    let previewQueryBusy = false;

    /**
     * Observe successfully validated structured commands after runtime execution.
     * This records authored tag vocabulary; it does not replace Minecraft state.
     */
    export function observeCommand(
        command: MCFunctionAST.CommandNode,
        success: boolean
    ): void {
        if (command.kind != MCFunctionAST.CommandKind.Tag) return;

        let tagCommand = <MCFunctionAST.TagCommand>command;
        if (
            tagCommand.action == MCFunctionAST.TagActionKind.Add ||
            tagCommand.action == MCFunctionAST.TagActionKind.Remove
        ) {
            // Remember the authored token even when the current selector matched
            // nobody. It is still part of this custom-block program's tag vocabulary.
            rememberTagName(tagCommand.name);
        }
    }

    /** Try to handle an OUTPUT_HIDDEN query before normal player.execute(). */
    export function tryHandleQuery(
        command: MCFunctionAST.CommandNode
    ): QueryResult {
        if (command.kind != MCFunctionAST.CommandKind.Tag) {
            return unhandledQuery();
        }

        let tagCommand = <MCFunctionAST.TagCommand>command;
        if (tagCommand.action != MCFunctionAST.TagActionKind.List) {
            return unhandledQuery();
        }

        return executeTagListQuery(tagCommand);
    }

    function executeTagListQuery(
        command: MCFunctionAST.TagCommand
    ): QueryResult {
        if (previewQueryBusy) {
            previewSay("TAG list query is already running.");
            return handledQuery(
                QueryConfidence.Unavailable,
                "TAG list re-entry blocked"
            );
        }

        previewQueryBusy = true;

        let scopeToken = createInternalTagScopeToken();
        let viewerTag = createInternalTagName("qv", scopeToken);
        let targetTag = createInternalTagName("qt", scopeToken);

        // Defensive cleanup is scoped to these opaque names only. Unlike the old
        // fixed marker names, another Preview invocation uses a different token.
        cleanupInternalTag(viewerTag);
        cleanupInternalTag(targetTag);

        let viewerMarked = player.execute("tag @s add " + viewerTag);
        if (!viewerMarked) {
            cleanupTagQueryMarkers(viewerTag, targetTag);
            previewQueryBusy = false;
            previewSay("TAG list output unavailable: Preview viewer could not be marked.");
            return handledQuery(
                QueryConfidence.Unavailable,
                "Preview viewer unavailable"
            );
        }

        let targetText = MCFunctionCompiler.compileSelector(command.target);
        let targetMarked = player.execute(
            "tag " + targetText + " add " + targetTag
        );

        if (!targetMarked) {
            cleanupTagQueryMarkers(viewerTag, targetTag);
            previewQueryBusy = false;
            previewSay("TAG list: no matching target was found.");
            return handledQuery(
                QueryConfidence.Exact,
                "No matching TAG list target"
            );
        }

        let knownTags = getKnownTagNames();

        // First show each exact entity/player selected by the original selector.
        // The rawtext selector component resolves @s in the nested execute context.
        previewTellFromExecutors(
            "@a[tag=" + targetTag + "]",
            viewerTag,
            "{\"rawtext\":[{\"text\":\"[Preview] \"},{\"selector\":\"@s\"},{\"text\":\" tracked tags:\"}]}"
        );
        previewTellFromExecutors(
            "@e[type=!minecraft:player,tag=" + targetTag + "]",
            viewerTag,
            "{\"rawtext\":[{\"text\":\"[Preview] \"},{\"selector\":\"@s\"},{\"text\":\" tracked tags:\"}]}"
        );

        if (knownTags.length == 0) {
            previewSay("No tag names have been tracked by custom TAG blocks in this Preview session.");
        } else {
            for (let i = 0; i < knownTags.length; i++) {
                let tagName = knownTags[i];
                if (isInternalPreviewTag(tagName)) continue;

                let escapedTag = previewEscapeJsonText(tagName);

                // Query real Minecraft selector state for the already-snapshotted
                // targets. This avoids inventing per-entity tag state in JavaScript.
                previewTellFromExecutors(
                    "@a[tag=" + targetTag + ",tag=" + tagName + "]",
                    viewerTag,
                    "{\"rawtext\":[{\"text\":\"[Preview] \"},{\"selector\":\"@s\"},{\"text\":\" : " + escapedTag + "\"}]}"
                );
                previewTellFromExecutors(
                    "@e[type=!minecraft:player,tag=" + targetTag + ",tag=" + tagName + "]",
                    viewerTag,
                    "{\"rawtext\":[{\"text\":\"[Preview] \"},{\"selector\":\"@s\"},{\"text\":\" : " + escapedTag + "\"}]}"
                );
            }
        }

        previewSay("TAG list uses tags tracked by this custom-block Preview session.");

        cleanupTagQueryMarkers(viewerTag, targetTag);
        previewQueryBusy = false;

        return handledQuery(
            QueryConfidence.SessionKnown,
            "TAG list rendered from session-known tag vocabulary"
        );
    }

    function cleanupTagQueryMarkers(
        viewerTag: string,
        targetTag: string
    ): void {
        cleanupInternalTag(targetTag);
        cleanupInternalTag(viewerTag);
    }
}
