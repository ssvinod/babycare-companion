import { db } from "./database";

export function runMigrations() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      name TEXT,
      dob TEXT,
      gender TEXT
    );

    CREATE TABLE IF NOT EXISTS feeding (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      time TEXT,
      type TEXT,
      quantity INTEGER,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS sleep (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      startTime TEXT,
      endTime TEXT,
      durationMinutes INTEGER
    );

    CREATE TABLE IF NOT EXISTS medication (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicine TEXT,
      dosage TEXT,
      completed INTEGER
    );

    CREATE TABLE IF NOT EXISTS growth (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      weight REAL,
      height REAL,
      percentile INTEGER,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS vaccination (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vaccine TEXT,
      dueDate TEXT,
      completed INTEGER
    );
  `);
}