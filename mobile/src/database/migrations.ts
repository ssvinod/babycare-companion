import { db } from "./database";

export function runMigrations() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      birthDate TEXT NOT NULL,
      gender TEXT NOT NULL,
      weight REAL,
      height REAL,
      bloodGroup TEXT,
      photo TEXT
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