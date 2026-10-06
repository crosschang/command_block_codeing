/** Validator for currently restored commands and shared Selector/Item values. */
namespace MCFunctionValidator {
    export enum ValidationLevel {
        Error = 0,
        Warning = 1,
        Info = 2
    }

    export interface ValidationIssue {
        level: ValidationLevel;
        code: string;
        message: string;
    }

    function addIssue(
        issues: ValidationIssue[],
        level: ValidationLevel,
        code: string,
        message: string
    ): void {
        issues.push({ level: level, code: code, message: message });
    }

    function appendIssues(target: ValidationIssue[], source: ValidationIssue[]): void {
        for (let i = 0; i < source.length; i++) target.push(source[i]);
    }

    function countFilter(selector: MCFunctionAST.Selector, key: string): number {
        let count = 0;
        for (let i = 0; i < selector.filters.length; i++) {
            if (selector.filters[i].key == key) count++;
        }
        return count;
    }

    function countPositiveFilter(selector: MCFunctionAST.Selector, key: string): number {
        let count = 0;
        for (let i = 0; i < selector.filters.length; i++) {
            let filter = selector.filters[i];
            if (filter.key == key && !filter.inverted) count++;
        }
        return count;
    }

    function validateSingleFilter(
        selector: MCFunctionAST.Selector,
        key: string,
        label: string,
        issues: ValidationIssue[]
    ): void {
        if (countFilter(selector, key) > 1) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "SELECTOR_DUPLICATE_" + key,
                label + " condition can only be used once."
            );
        }
    }

    export function validateSelector(selector: MCFunctionAST.Selector): ValidationIssue[] {
        let issues: ValidationIssue[] = [];

        validateSingleFilter(selector, "x", "X", issues);
        validateSingleFilter(selector, "y", "Y", issues);
        validateSingleFilter(selector, "z", "Z", issues);
        validateSingleFilter(selector, "dx", "dX", issues);
        validateSingleFilter(selector, "dy", "dY", issues);
        validateSingleFilter(selector, "dz", "dZ", issues);
        validateSingleFilter(selector, "r", "max distance", issues);
        validateSingleFilter(selector, "rm", "min distance", issues);
        validateSingleFilter(selector, "c", "count", issues);
        validateSingleFilter(selector, "m", "gamemode", issues);
        validateSingleFilter(selector, "l", "max level", issues);
        validateSingleFilter(selector, "lm", "min level", issues);
        validateSingleFilter(selector, "rx", "X rotation max", issues);
        validateSingleFilter(selector, "rxm", "X rotation min", issues);
        validateSingleFilter(selector, "ry", "Y rotation max", issues);
        validateSingleFilter(selector, "rym", "Y rotation min", issues);

        if (
            selector.base == MCFunctionAST.SelectorBase.Initiator &&
            (selector.filters.length > 0 || selector.scores.length > 0 || selector.hasItems.length > 0)
        ) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "SELECTOR_INITIATOR_CONDITION",
                "@initiator cannot use selector conditions."
            );
        }

        if (
            countFilter(selector, "type") > 0 &&
            (selector.base == MCFunctionAST.SelectorBase.AllPlayers ||
             selector.base == MCFunctionAST.SelectorBase.NearestPlayer)
        ) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "SELECTOR_TYPE_BASE",
                "type cannot be used with @a or @p."
            );
        }

        if (countFilter(selector, "type") > 1 && countPositiveFilter(selector, "type") > 0) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "SELECTOR_TYPE_MULTIPLE",
                "When type is repeated, only negated type conditions are allowed."
            );
        }

        if (countFilter(selector, "name") > 1 && countPositiveFilter(selector, "name") > 0) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "SELECTOR_NAME_MULTIPLE",
                "When name is repeated, only negated name conditions are allowed."
            );
        }

        for (let i = 0; i < selector.scores.length; i++) {
            for (let j = i + 1; j < selector.scores.length; j++) {
                if (selector.scores[i].objective == selector.scores[j].objective) {
                    addIssue(
                        issues,
                        ValidationLevel.Error,
                        "SELECTOR_SCORE_DUPLICATE",
                        "The same scoreboard objective cannot be repeated."
                    );
                }
            }
        }

        if (selector.hasItems.length > 1) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "SELECTOR_HASITEM_V1_LIMIT",
                "The current compiler supports one hasitem condition."
            );
        }

        return issues;
    }

    function isIntegerValue(value: number): boolean {
        return Math.floor(value) == value;
    }

    function isSafeIdToken(value: string): boolean {
        if (!value || value.length == 0) return false;

        for (let i = 0; i < value.length; i++) {
            let ch = value.charAt(i);
            if (
                ch == " " || ch == "\t" || ch == "\r" || ch == "\n" ||
                ch == "\"" || ch == "\\" || ch == "{" || ch == "}" ||
                ch == "[" || ch == "]"
            ) return false;
        }

        return true;
    }

    function containsString(values: string[], value: string, endExclusive: number): boolean {
        for (let i = 0; i < endExclusive; i++) {
            if (values[i] == value) return true;
        }
        return false;
    }

    export function validateItemStack(item: MCFunctionAST.ItemStack): ValidationIssue[] {
        let issues: ValidationIssue[] = [];

        if (!isSafeIdToken(item.id)) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "ITEM_ID_INVALID",
                "Item ID is empty or contains characters that cannot be used in a command."
            );
        }

        if (!isIntegerValue(item.amount)) {
            addIssue(issues, ValidationLevel.Error, "ITEM_AMOUNT_NOT_INTEGER", "Item amount must be an integer.");
        } else if (item.amount <= 0) {
            addIssue(issues, ValidationLevel.Error, "ITEM_AMOUNT_NON_POSITIVE", "Item amount must be at least 1.");
        }

        if (!isIntegerValue(item.data)) {
            addIssue(issues, ValidationLevel.Error, "ITEM_DATA_NOT_INTEGER", "Item data must be an integer.");
        }

        for (let i = 0; i < item.components.canDestroy.length; i++) {
            let blockId = item.components.canDestroy[i];
            if (!isSafeIdToken(blockId)) {
                addIssue(issues, ValidationLevel.Error, "ITEM_CAN_DESTROY_ID_INVALID", "Invalid can_destroy block ID: " + blockId);
            }
            if (containsString(item.components.canDestroy, blockId, i)) {
                addIssue(issues, ValidationLevel.Warning, "ITEM_CAN_DESTROY_DUPLICATE", "Duplicate can_destroy block: " + blockId);
            }
        }

        for (let i = 0; i < item.components.canPlaceOn.length; i++) {
            let blockId = item.components.canPlaceOn[i];
            if (!isSafeIdToken(blockId)) {
                addIssue(issues, ValidationLevel.Error, "ITEM_CAN_PLACE_ON_ID_INVALID", "Invalid can_place_on block ID: " + blockId);
            }
            if (containsString(item.components.canPlaceOn, blockId, i)) {
                addIssue(issues, ValidationLevel.Warning, "ITEM_CAN_PLACE_ON_DUPLICATE", "Duplicate can_place_on block: " + blockId);
            }
        }

        if (
            item.components.itemLock != MCFunctionAST.ItemLockMode.None &&
            item.components.itemLock != MCFunctionAST.ItemLockMode.LockInInventory &&
            item.components.itemLock != MCFunctionAST.ItemLockMode.LockInSlot
        ) {
            addIssue(issues, ValidationLevel.Error, "ITEM_LOCK_MODE_INVALID", "Unsupported item_lock mode.");
        }

        return issues;
    }

    export function validateGiveCommand(command: MCFunctionAST.GiveCommand): ValidationIssue[] {
        let issues: ValidationIssue[] = [];
        appendIssues(issues, validateSelector(command.target));
        appendIssues(issues, validateItemStack(command.item));
        return issues;
    }



    function isValidCoordinateMode(mode: MCFunctionAST.CoordinateMode): boolean {
        return mode == MCFunctionAST.CoordinateMode.Absolute ||
            mode == MCFunctionAST.CoordinateMode.Relative ||
            mode == MCFunctionAST.CoordinateMode.Local;
    }

    function validateCoordinate(
        coordinate: MCFunctionAST.Coordinate,
        axis: string,
        issues: ValidationIssue[]
    ): void {
        if (!isValidCoordinateMode(coordinate.mode)) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "POSITION_MODE_INVALID_" + axis,
                "Invalid coordinate mode for " + axis + "."
            );
        }
    }

    export function validatePosition(position: MCFunctionAST.Position): ValidationIssue[] {
        let issues: ValidationIssue[] = [];

        validateCoordinate(position.x, "X", issues);
        validateCoordinate(position.y, "Y", issues);
        validateCoordinate(position.z, "Z", issues);

        let localCount = 0;
        if (position.x.mode == MCFunctionAST.CoordinateMode.Local) localCount++;
        if (position.y.mode == MCFunctionAST.CoordinateMode.Local) localCount++;
        if (position.z.mode == MCFunctionAST.CoordinateMode.Local) localCount++;

        if (localCount > 0 && localCount < 3) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "POSITION_LOCAL_MIXED",
                "Local (^) coordinates cannot be mixed with absolute or relative coordinates in one position."
            );
        }

        return issues;
    }

    function validateRotationValue(
        value: MCFunctionAST.RotationValue,
        axis: string,
        issues: ValidationIssue[]
    ): void {
        if (
            value.mode != MCFunctionAST.RotationMode.Absolute &&
            value.mode != MCFunctionAST.RotationMode.Relative
        ) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "ROTATION_MODE_INVALID_" + axis,
                "Invalid rotation mode for " + axis + "."
            );
        }
    }

    export function validateRotation(rotation: MCFunctionAST.Rotation): ValidationIssue[] {
        let issues: ValidationIssue[] = [];
        validateRotationValue(rotation.yaw, "YAW", issues);
        validateRotationValue(rotation.pitch, "PITCH", issues);
        return issues;
    }

    export function validateTeleportCommand(
        command: MCFunctionAST.TeleportCommand
    ): ValidationIssue[] {
        let issues: ValidationIssue[] = [];

        appendIssues(issues, validateSelector(command.target));

        if (command.mode == MCFunctionAST.TeleportMode.Entity) {
            if (!command.destinationEntity) {
                addIssue(issues, ValidationLevel.Error, "TP_DESTINATION_ENTITY_MISSING", "Teleport destination entity is missing.");
            } else {
                appendIssues(issues, validateSelector(command.destinationEntity));
            }
            return issues;
        }

        if (!command.destinationPosition) {
            addIssue(issues, ValidationLevel.Error, "TP_DESTINATION_POSITION_MISSING", "Teleport destination position is missing.");
            return issues;
        }

        appendIssues(issues, validatePosition(command.destinationPosition));

        if (command.mode == MCFunctionAST.TeleportMode.Rotation) {
            if (!command.rotation) {
                addIssue(issues, ValidationLevel.Error, "TP_ROTATION_MISSING", "Teleport rotation is missing.");
            } else {
                appendIssues(issues, validateRotation(command.rotation));
            }
        } else if (command.mode == MCFunctionAST.TeleportMode.FacingPosition) {
            if (!command.facingPosition) {
                addIssue(issues, ValidationLevel.Error, "TP_FACING_POSITION_MISSING", "Teleport facing position is missing.");
            } else {
                appendIssues(issues, validatePosition(command.facingPosition));
            }
        } else if (command.mode == MCFunctionAST.TeleportMode.FacingEntity) {
            if (!command.facingEntity) {
                addIssue(issues, ValidationLevel.Error, "TP_FACING_ENTITY_MISSING", "Teleport facing entity is missing.");
            } else {
                appendIssues(issues, validateSelector(command.facingEntity));
            }
        } else if (command.mode != MCFunctionAST.TeleportMode.Position) {
            addIssue(issues, ValidationLevel.Error, "TP_MODE_INVALID", "Unsupported teleport mode.");
        }

        return issues;
    }

    function hasControlCharacter(value: string): boolean {
        for (let i = 0; i < value.length; i++) {
            let code = value.charCodeAt(i);
            if (code < 32 || code == 127) return true;
        }
        return false;
    }

    function validateSummonOrientation(
        orientation: MCFunctionAST.SummonOrientation,
        issues: ValidationIssue[]
    ): void {
        if (!orientation || orientation.kind == MCFunctionAST.SummonOrientationKind.None) {
            return;
        }

        if (orientation.kind == MCFunctionAST.SummonOrientationKind.Rotation) {
            if (!orientation.rotation) {
                addIssue(
                    issues,
                    ValidationLevel.Error,
                    "SUMMON_ROTATION_MISSING",
                    "Summon rotation is missing."
                );
            } else {
                appendIssues(issues, validateRotation(orientation.rotation));
            }
            return;
        }

        if (orientation.kind == MCFunctionAST.SummonOrientationKind.Facing) {
            if (!orientation.facing) {
                addIssue(
                    issues,
                    ValidationLevel.Error,
                    "SUMMON_FACING_MISSING",
                    "Summon facing target is missing."
                );
                return;
            }

            if (orientation.facing.kind == MCFunctionAST.FacingKind.Position) {
                if (!orientation.facing.position) {
                    addIssue(
                        issues,
                        ValidationLevel.Error,
                        "SUMMON_FACING_POSITION_MISSING",
                        "Summon facing position is missing."
                    );
                } else {
                    appendIssues(issues, validatePosition(orientation.facing.position));
                }
                return;
            }

            if (orientation.facing.kind == MCFunctionAST.FacingKind.Entity) {
                if (!orientation.facing.entitySelector) {
                    addIssue(
                        issues,
                        ValidationLevel.Error,
                        "SUMMON_FACING_ENTITY_MISSING",
                        "Summon facing entity is missing."
                    );
                } else {
                    appendIssues(issues, validateSelector(orientation.facing.entitySelector));
                }
                return;
            }

            addIssue(
                issues,
                ValidationLevel.Error,
                "SUMMON_FACING_KIND_INVALID",
                "Unsupported summon facing kind."
            );
            return;
        }

        addIssue(
            issues,
            ValidationLevel.Error,
            "SUMMON_ORIENTATION_INVALID",
            "Unsupported summon orientation."
        );
    }

    export function validateSummonCommand(
        command: MCFunctionAST.SummonCommand
    ): ValidationIssue[] {
        let issues: ValidationIssue[] = [];

        if (!isSafeIdToken(command.entityId)) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "SUMMON_ENTITY_ID_INVALID",
                "Summon entity ID is empty or contains invalid command characters."
            );
        }

        if (command.nameTag && hasControlCharacter(command.nameTag)) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "SUMMON_NAME_INVALID",
                "Summon name tag cannot contain control characters."
            );
        }

        if (command.form == MCFunctionAST.SummonForm.Simple) {
            if (command.spawnPosition) {
                appendIssues(issues, validatePosition(command.spawnPosition));
            }
            return issues;
        }

        if (command.form != MCFunctionAST.SummonForm.Advanced) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "SUMMON_FORM_INVALID",
                "Unsupported summon form."
            );
            return issues;
        }

        if (!command.spawnPosition) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "SUMMON_POSITION_MISSING",
                "SUMMON ADVANCED requires a spawn position."
            );
        } else {
            appendIssues(issues, validatePosition(command.spawnPosition));
        }

        validateSummonOrientation(command.orientation, issues);

        if (command.spawnEvent && command.spawnEvent.length > 0 && !isSafeIdToken(command.spawnEvent)) {
            addIssue(
                issues,
                ValidationLevel.Error,
                "SUMMON_EVENT_INVALID",
                "Summon spawn event contains invalid command characters."
            );
        }

        return issues;
    }


    export function validateCommand(command: MCFunctionAST.CommandNode): ValidationIssue[] {
        let issues: ValidationIssue[] = [];

        if (command.kind == MCFunctionAST.CommandKind.Raw) {
            let raw = <MCFunctionAST.RawCommand>command;
            if (!raw.raw || raw.raw.length == 0) {
                addIssue(issues, ValidationLevel.Error, "RAW_EMPTY_COMMAND", "RAW COMMAND cannot be empty.");
            }
        }

        if (command.kind == MCFunctionAST.CommandKind.Say) {
            let say = <MCFunctionAST.SayCommand>command;
            if (!say.message || say.message.length == 0) {
                addIssue(issues, ValidationLevel.Error, "SAY_EMPTY_MESSAGE", "SAY message cannot be empty.");
            }
        }

        if (command.kind == MCFunctionAST.CommandKind.McFunction) {
            let fn = <MCFunctionAST.McFunctionCommand>command;
            if (!fn.functionId || fn.functionId.length == 0) {
                addIssue(issues, ValidationLevel.Error, "FUNCTION_EMPTY_ID", "Function ID cannot be empty.");
            }
        }

        if (command.kind == MCFunctionAST.CommandKind.Give) {
            appendIssues(issues, validateGiveCommand(<MCFunctionAST.GiveCommand>command));
        }

        if (command.kind == MCFunctionAST.CommandKind.Teleport) {
            appendIssues(issues, validateTeleportCommand(<MCFunctionAST.TeleportCommand>command));
        }

        if (command.kind == MCFunctionAST.CommandKind.Summon) {
            appendIssues(issues, validateSummonCommand(<MCFunctionAST.SummonCommand>command));
        }

        return issues;
    }

    export function hasError(issues: ValidationIssue[]): boolean {
        for (let i = 0; i < issues.length; i++) {
            if (issues[i].level == ValidationLevel.Error) return true;
        }
        return false;
    }
}
