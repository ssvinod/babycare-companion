import * as SQLite from "expo-sqlite";

export function runMigrations() {
  const db = SQLite.openDatabaseSync("babycare.db");

  db.execSync(`
    CREATE TABLE IF NOT EXISTS baby (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      dob TEXT,
      gender TEXT
    );

    CREATE TABLE IF NOT EXISTS feeding (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      time TEXT,
      type TEXT,
      quantity REAL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS sleep (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      startTime TEXT,
      endTime TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS growth (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      weight REAL,
      height REAL,
      headCircumference REAL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS vaccination (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vaccine TEXT,
      dueDate TEXT,
      completed INTEGER DEFAULT 0,
      completedDate TEXT
    );
  `);
}