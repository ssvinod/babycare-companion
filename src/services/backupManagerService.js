import fs from "fs";
import path from "path";
const BACKUP_DIR = "./output/backups";
export function createAutomaticBackup(context) {
    fs.mkdirSync(BACKUP_DIR, {
        recursive: true
    });
    const timestamp =
        new Date()
            .toISOString()
            .replace(/[:.]/g, "-");
    const file = path.join(
        BACKUP_DIR,
        `backup-${timestamp}.json`
    );
    fs.writeFileSync(
        file,
        JSON.stringify(context, null, 2)
    );
    return file;
}
export function listBackups() {
    if (!fs.existsSync(BACKUP_DIR))
        return [];
    return fs.readdirSync(BACKUP_DIR)
        .sort()
        .reverse();
}