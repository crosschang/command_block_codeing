/**
 * Optional local-file export for Minecraft Education MakeCode.
 *
 * This file is only compiled when the official "File Read & Write" extension
 * is present in the host MakeCode project (see pxt.json fileDependencies).
 * The already-tested COMMAND -> SAY block remains unchanged.
 */
namespace Command {
    /**
     * Compiles one SAY command and writes the resulting mcfunction text to a
     * local file path.
     *
     * The path is intentionally a plain string in this first POC. The official
     * File extension may also provide its own picker UI when used directly.
     */
    //% blockId=command_export_say_file
    //% block="SAY %message 를 파일 %path 에 저장"
    //% message.shadow="text"
    //% message.defl="Hello World"
    //% path.shadow="text"
    //% path.defl="C:/Users/USERNAME/Desktop/main.mcfunction"
    //% weight=10
    export function exportSayFile(message: string, path: string): void {
        const contents = sayToMcfunction(message) + "\n"
        file.writeFile(path, contents)
    }
}
