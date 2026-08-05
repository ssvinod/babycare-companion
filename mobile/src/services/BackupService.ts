import { File, Paths } from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';
import { db } from '../database/database';
const BACKUP_VERSION = 1;
type BackupValue = string | number | null;
type BackupRow = Record<string, BackupValue>;
export interface NivaBackup {
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
    notes?: {
        profilePhotoIncluded?: boolean;
        message?: string;
    };
}
export interface BackupExportResult {
    fileName: string;
    fileUri: string;
    recordCount: number;
}
export interface BackupRestoreResult {
    profile: number;
    feeding: number;
    sleep: number;
    growth: number;
    vaccination: number;
    medication: number;
    medicationDose: number;
    total: number;
}
function readTable(tableName: string): BackupRow[] {
    return db.getAllSync<BackupRow>(`SELECT * FROM ${tableName};`);
}
function sanitizeProfile(rows: BackupRow[]): BackupRow[] {
    return rows.map((row) => ({
        ...row,
        // A local photo URI from another
        // installation is not portable.
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
                'Baby profile photos are stored separately and are not included in backup version 1.',
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
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isBackupRowArray(value: unknown): value is BackupRow[] {
    return Array.isArray(value) && value.every((row) => isRecord(row));
}
export function validateBackup(value: unknown): value is NivaBackup {
    if (!isRecord(value)) {
        return false;
    }
    if (value.app !== 'Niva' || value.backupVersion !== BACKUP_VERSION) {
        return false;
    }
    if (typeof value.exportedAt !== 'string') {
        return false;
    }
    if (!isRecord(value.database)) {
        return false;
    }
    const database = value.database;
    if (
        !isBackupRowArray(database.profile) ||
        !isBackupRowArray(database.feeding) ||
        !isBackupRowArray(database.sleep) ||
        !isBackupRowArray(database.growth) ||
        !isBackupRowArray(database.vaccination) ||
        !isBackupRowArray(database.medication) ||
        !isBackupRowArray(database.medicationDose)
    ) {
        return false;
    }
    // A usable Niva backup must contain
    // exactly one baby profile.
    if (database.profile.length !== 1) {
        return false;
    }
    const profile = database.profile[0];
    return (
        typeof profile.name === 'string' &&
        typeof profile.birthDate === 'string' &&
        typeof profile.gender === 'string'
    );
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
export async function pickBackupFile(): Promise<DocumentPicker.DocumentPickerAsset | null> {
    const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/json', 'text/plain'],
        copyToCacheDirectory: true,
        multiple: false,
    });
    if (result.canceled || !result.assets[0]) {
        return null;
    }
    return result.assets[0];
}
export async function readBackup(uri: string): Promise<NivaBackup> {
    const file = new File(uri);
    if (!file.exists) {
        throw new Error('BACKUP_FILE_MISSING');
    }
    const text = await file.text();
    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        throw new Error('INVALID_JSON');
    }
    if (!validateBackup(parsed)) {
        throw new Error('INVALID_BACKUP');
    }
    return parsed;
}
function textValue(value: BackupValue, fallback = ''): string {
    return typeof value === 'string' ? value : fallback;
}
function nullableText(value: BackupValue): string | null {
    return typeof value === 'string' ? value : null;
}
function numericValue(value: BackupValue, fallback = 0): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
function nullableNumber(value: BackupValue): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
export async function restoreNivaBackup(
    backup: NivaBackup
): Promise<BackupRestoreResult> {
    if (!validateBackup(backup)) {
        throw new Error('INVALID_BACKUP');
    }
    // Existing native notification IDs
    // become invalid after restore.
    await Notifications.cancelAllScheduledNotificationsAsync();
    const data = backup.database;
    db.withTransactionSync(() => {
        // Delete child/dependent data first.
        db.execSync(`
            DELETE FROM medication_dose;
            DELETE FROM medication;
            DELETE FROM feeding;
            DELETE FROM sleep;
            DELETE FROM growth;
            DELETE FROM vaccination;
            DELETE FROM profile;
        `);
        for (const row of data.profile) {
            db.runSync(
                `
                INSERT INTO profile (
                    id,
                    name,
                    birthDate,
                    gender,
                    weight,
                    height,
                    bloodGroup,
                    photo
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                `,
                [
                    numericValue(row.id, 1),
                    textValue(row.name),
                    textValue(row.birthDate),
                    textValue(row.gender),
                    nullableNumber(row.weight),
                    nullableNumber(row.height),
                    nullableText(row.bloodGroup),
                    // Backup v1 does not
                    // include profile photos.
                    null,
                ]
            );
        }
        for (const row of data.feeding) {
            db.runSync(
                `
                INSERT INTO feeding (
                    id,
                    time,
                    type,
                    quantity,
                    notes
                )
                VALUES (?, ?, ?, ?, ?);
                `,
                [
                    numericValue(row.id),
                    nullableText(row.time),
                    nullableText(row.type),
                    nullableNumber(row.quantity),
                    nullableText(row.notes),
                ]
            );
        }
        for (const row of data.sleep) {
            db.runSync(
                `
                INSERT INTO sleep (
                    id,
                    startTime,
                    endTime,
                    durationMinutes
                )
                VALUES (?, ?, ?, ?);
                `,
                [
                    numericValue(row.id),
                    nullableText(row.startTime),
                    nullableText(row.endTime),
                    nullableNumber(row.durationMinutes),
                ]
            );
        }
        for (const row of data.growth) {
            db.runSync(
                `
                INSERT INTO growth (
                    id,
                    date,
                    weight,
                    height,
                    headCircumference,
                    notes
                )
                VALUES (?, ?, ?, ?, ?, ?);
                `,
                [
                    numericValue(row.id),
                    textValue(row.date),
                    numericValue(row.weight),
                    numericValue(row.height),
                    nullableNumber(row.headCircumference),
                    nullableText(row.notes),
                ]
            );
        }
        for (const row of data.vaccination) {
            db.runSync(
                `
                INSERT INTO vaccination (
                    id,
                    vaccine,
                    dueDate,
                    completed,
                    completedDate
                )
                VALUES (?, ?, ?, ?, ?);
                `,
                [
                    numericValue(row.id),
                    nullableText(row.vaccine),
                    nullableText(row.dueDate),
                    numericValue(row.completed),
                    nullableText(row.completedDate),
                ]
            );
        }
        for (const row of data.medication) {
            db.runSync(
                `
                INSERT INTO medication (
                    id,
                    medicine,
                    dosage,
                    unit,
                    frequency,
                    reminderTime,
                    reminderTimes,
                    startDate,
                    endDate,
                    remindersEnabled,
                    notificationIds,
                    notes,
                    completed,
                    completedAt,
                    createdAt
                )
                VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?
                );
                `,
                [
                    numericValue(row.id),
                    textValue(row.medicine),
                    nullableText(row.dosage),
                    nullableText(row.unit),
                    nullableText(row.frequency),
                    nullableText(row.reminderTime),
                    textValue(row.reminderTimes, '[]'),
                    nullableText(row.startDate),
                    nullableText(row.endDate),
                    numericValue(row.remindersEnabled),
                    // Old native IDs must
                    // never be restored.
                    '[]',
                    nullableText(row.notes),
                    numericValue(row.completed),
                    nullableText(row.completedAt),
                    textValue(row.createdAt, new Date().toISOString()),
                ]
            );
        }
        // Medication must exist before
        // its dose history is inserted.
        for (const row of data.medicationDose) {
            db.runSync(
                `
                INSERT INTO medication_dose (
                    id,
                    medicationId,
                    scheduledDate,
                    scheduledTime,
                    takenAt,
                    status,
                    notes,
                    createdAt
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                `,
                [
                    numericValue(row.id),
                    numericValue(row.medicationId),
                    textValue(row.scheduledDate),
                    textValue(row.scheduledTime),
                    nullableText(row.takenAt),
                    textValue(row.status, 'pending'),
                    nullableText(row.notes),
                    textValue(row.createdAt, new Date().toISOString()),
                ]
            );
        }
        // Keep future AUTOINCREMENT IDs
        // above restored IDs.
        db.execSync(`
            DELETE FROM sqlite_sequence
            WHERE name IN (
                'feeding',
                'sleep',
                'growth',
                'vaccination',
                'medication',
                'medication_dose'
            );
            INSERT INTO sqlite_sequence (
                name,
                seq
            )
            SELECT
                'feeding',
                COALESCE(MAX(id), 0)
            FROM feeding;
            INSERT INTO sqlite_sequence (
                name,
                seq
            )
            SELECT
                'sleep',
                COALESCE(MAX(id), 0)
            FROM sleep;
            INSERT INTO sqlite_sequence (
                name,
                seq
            )
            SELECT
                'growth',
                COALESCE(MAX(id), 0)
            FROM growth;
            INSERT INTO sqlite_sequence (
                name,
                seq
            )
            SELECT
                'vaccination',
                COALESCE(MAX(id), 0)
            FROM vaccination;
            INSERT INTO sqlite_sequence (
                name,
                seq
            )
            SELECT
                'medication',
                COALESCE(MAX(id), 0)
            FROM medication;
            INSERT INTO sqlite_sequence (
                name,
                seq
            )
            SELECT
                'medication_dose',
                COALESCE(MAX(id), 0)
            FROM medication_dose;
        `);
    });
    const result = {
        profile: data.profile.length,
        feeding: data.feeding.length,
        sleep: data.sleep.length,
        growth: data.growth.length,
        vaccination: data.vaccination.length,
        medication: data.medication.length,
        medicationDose: data.medicationDose.length,
        total: 0,
    };
    result.total =
        result.profile +
        result.feeding +
        result.sleep +
        result.growth +
        result.vaccination +
        result.medication +
        result.medicationDose;
    return result;
}
