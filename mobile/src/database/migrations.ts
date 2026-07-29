import { db } from "./database";
function getColumns(
  tableName: string
): string[] {
  const rows = db.getAllSync<{
    name: string;
  }>(
    `PRAGMA table_info(${tableName});`
  );
  return rows.map(
    (row) => row.name
  );
}
function addColumnIfMissing(
  tableName: string,
  columnName: string,
  definition: string
) {
  const columns =
    getColumns(tableName);
  if (!columns.includes(columnName)) {
    db.execSync(`
      ALTER TABLE ${tableName}
      ADD COLUMN ${columnName}
      ${definition};
    `);
  }
}
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
      medicine TEXT NOT NULL,
      dosage TEXT,
      unit TEXT,
      frequency TEXT,
      reminderTime TEXT,
      notes TEXT,
      completed INTEGER DEFAULT 0,
      completedAt TEXT,
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS growth (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      weight REAL NOT NULL,
      height REAL NOT NULL,
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
    CREATE TABLE IF NOT EXISTS medication_dose (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicationId INTEGER NOT NULL,
      scheduledDate TEXT NOT NULL,
      scheduledTime TEXT NOT NULL,
      takenAt TEXT,
      status TEXT NOT NULL
        DEFAULT 'pending'
        CHECK (
          status IN (
            'pending',
            'taken',
            'skipped'
          )
        ),
      notes TEXT,
      createdAt TEXT NOT NULL,
      UNIQUE (
        medicationId,
        scheduledDate,
        scheduledTime
      )
    );
    CREATE INDEX IF NOT EXISTS
      idx_medication_dose_date
    ON medication_dose (
      scheduledDate,
      scheduledTime
    );
    CREATE INDEX IF NOT EXISTS
      idx_medication_dose_medication
    ON medication_dose (
      medicationId
    );
    CREATE TRIGGER IF NOT EXISTS
      delete_medication_doses
    AFTER DELETE ON medication
    BEGIN
      DELETE FROM medication_dose
      WHERE medicationId = OLD.id;
    END;
  `);
  addColumnIfMissing(
    "medication",
    "unit",
    "TEXT"
  );
  addColumnIfMissing(
    "medication",
    "frequency",
    "TEXT"
  );
  addColumnIfMissing(
    "medication",
    "reminderTime",
    "TEXT"
  );
  addColumnIfMissing(
    "medication",
    "notes",
    "TEXT"
  );
  addColumnIfMissing(
    "medication",
    "completedAt",
    "TEXT"
  );
  addColumnIfMissing(
    "medication",
    "createdAt",
    "TEXT"
  );
  addColumnIfMissing(
    "medication",
    "reminderTimes",
    "TEXT"
  );
  addColumnIfMissing(
    "medication",
    "startDate",
    "TEXT"
  );
  addColumnIfMissing(
    "medication",
    "endDate",
    "TEXT"
  );
  addColumnIfMissing(
    "medication",
    "remindersEnabled",
    "INTEGER DEFAULT 0"
  );
  addColumnIfMissing(
    "medication",
    "notificationIds",
    "TEXT"
  );
}