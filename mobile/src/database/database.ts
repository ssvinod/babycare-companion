import * as SQLite from 'expo-sqlite';
export const db = SQLite.openDatabaseSync('babycare.db');
export function initializeDatabase(): void {
    db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);
}
export function logDatabaseState(): void {
    const tables = db.getAllSync<{
        name: string;
    }>(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      ORDER BY name;
    `);
    const growthSchema = db.getAllSync<{
        cid: number;
        name: string;
        type: string;
        notnull: number;
        dflt_value: string | null;
        pk: number;
    }>(`
      PRAGMA table_info(growth);
    `);
}
