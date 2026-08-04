import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { db } from '../database/database';
const BACKUP_VERSION = 1;
type BackupRow = Record<string, string | number | null>;
interface NivaBackup {
    app: 'Niva';
    backupVersion: number;
    exportedAt: string;
    database: {
        profile: BackupRow[];
        feeding: BackupRow[];
        sleep: BackupRow[];
        growth: BackupRow[];
        vaccination: BackupRow[];
        medication: BackupRow[];
        medicationDose: BackupRow[];
    };
    notes: {
        profilePhotoIncluded: false;
        message: string;
    };
}
function readTable(tableName: string): BackupRow[] {
    return db.getAllSync<BackupRow>(`SELECT * FROM ${tableName};`);
}
function sanitizeProfile(rows: BackupRow[]): BackupRow[] {
    return rows.map((row) => ({
        ...row,
        // Local file paths do not remain valid
        // when restored on another device.
        photo: null,
    }));
}
function buildBackup(): NivaBackup {
    return {
        app: 'Niva',
        backupVersion: BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        database: {
            profile: sanitizeProfile(readTable('profile')),
            feeding: readTable('feeding'),
            sleep: readTable('sleep'),
            growth: readTable('growth'),
            vaccination: readTable('vaccination'),
            medication: readTable('medication'),
            medicationDose: readTable('medication_dose'),
        },
        notes: {
            profilePhotoIncluded: false,
            message:
                'Baby profile photos are stored separately on the device and are not included in this backup version.',
        },
    };
}
function backupFileName(): string {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((value) => String(value).padStart(2, '0'))
        .join('-');
    return `niva-backup-` + `${date}-${time}.json`;
}
export interface BackupExportResult {
    fileName: string;
    fileUri: string;
    recordCount: number;
}
export async function exportNivaBackup(): Promise<BackupExportResult> {
    const profile = readTable('profile');
    if (profile.length === 0) {
        throw new Error('NO_PROFILE');
    }
    const backup = buildBackup();
    const fileName = backupFileName();
    const file = new File(Paths.cache, fileName);
    if (file.exists) {
        file.delete();
    }
    file.create();
    file.write(JSON.stringify(backup, null, 2));
    const sharingAvailable = await Sharing.isAvailableAsync();
    if (!sharingAvailable) {
        throw new Error('SHARING_UNAVAILABLE');
    }
    await Sharing.shareAsync(file.uri, {
        dialogTitle: 'Save Niva Backup',
        mimeType: 'application/json',
        UTI: 'public.json',
    });
    const recordCount = Object.values(backup.database).reduce(
        (total, records) => total + records.length,
        0
    );
    return {
        fileName,
        fileUri: file.uri,
        recordCount,
    };
}
