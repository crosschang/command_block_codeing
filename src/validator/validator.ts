/** Minimal validator for the currently supported commands. */
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

    export function validateCommand(command: MCFunctionAST.CommandNode): ValidationIssue[] {
        let issues: ValidationIssue[] = [];

        if (command.kind == MCFunctionAST.CommandKind.Say) {
            let say = <MCFunctionAST.SayCommand>command;
            if (!say.message || say.message.length == 0) {
                issues.push({
                    level: ValidationLevel.Error,
                    code: "SAY_EMPTY_MESSAGE",
                    message: "SAY message cannot be empty."
                });
            }
        }

        if (command.kind == MCFunctionAST.CommandKind.McFunction) {
            let fn = <MCFunctionAST.McFunctionCommand>command;
            if (!fn.functionId || fn.functionId.length == 0) {
                issues.push({
                    level: ValidationLevel.Error,
                    code: "FUNCTION_EMPTY_ID",
                    message: "Function ID cannot be empty."
                });
            }
        }

        return issues;
    }

    export function hasError(issues: ValidationIssue[]): boolean {
        for (let i = 0; i < issues.length; i++) {
            if (issues[i].level == ValidationLevel.Error) {
                return true;
            }
        }
        return false;
    }
}
