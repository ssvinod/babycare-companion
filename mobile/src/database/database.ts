import * as SQLite from "expo-sqlite";
export const db = SQLite.openDatabaseSync("babycare.db");
export function initializeDatabase() {
  console.log("DATABASE INITIALIZED");
  db.execSync(`
    PRAGMA journal_mode=WAL;
  `);
  const tables = db.getAllSync(`
    SELECT name
    FROM sqlite_master
    WHERE type='table';
  `);
  console.log("TABLES:", tables);
  const growthSchema = db.getAllSync(`
    PRAGMA table_info(growth);
  `);
    
  console.log("GROWTH SCHEMA:", growthSchema);
}