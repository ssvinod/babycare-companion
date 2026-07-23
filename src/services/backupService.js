import fs from "fs";
export function exportBackup(context, filePath) {
    fs.writeFileSync(
        filePath,
        JSON.stringify({
            schemaVersion: "1.0",
            exportedAt:
                new Date().toISOString(),
            data: context
        }, null, 2)
    );
    return filePath;
}
export function importBackup(filePath) {
    const backup =
    JSON.parse(
        fs.readFileSync(
            filePath,
            "utf8"
        )
    );
    return backup.data ?? backup;
}