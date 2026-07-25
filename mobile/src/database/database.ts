import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("babycare.db");

export function initializeDatabase() {
  db.execSync(`
    PRAGMA journal_mode=WAL;
  `);
}