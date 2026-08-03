import * as SQLite from "expo-sqlite";
export const db =
  SQLite.openDatabaseSync(
    "babycare.db"
  );
export function initializeDatabase(): void {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);
  console.log(
    "DATABASE CONNECTION READY"
  );
}
export function logDatabaseState(): void {
  const tables =
    db.getAllSync<{
      name: string;
    }>(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      ORDER BY name;
    `);
  console.log(
    "TABLES:",
    tables
  );
  const growthSchema =
    db.getAllSync<{
      cid: number;
      name: string;
      type: string;
      notnull: number;
      dflt_value:
        | string
        | null;
      pk: number;
    }>(`
      PRAGMA table_info(growth);
    `);
  console.log(
    "GROWTH SCHEMA:",
    growthSchema
  );
}