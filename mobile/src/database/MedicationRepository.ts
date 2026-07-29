import { db } from "./database";
import { Medication } from "../models/Medication";
export default class MedicationRepository {
  async getAll(): Promise<Medication[]> {
    return db.getAllSync<Medication>(`
      SELECT
        id,
        medicine,
        dosage,
        unit,
        frequency,
        reminderTime,
        notes,
        COALESCE(completed, 0) AS completed,
        completedAt,
        COALESCE(createdAt, '') AS createdAt
      FROM medication
      ORDER BY
        completed ASC,
        CASE
          WHEN reminderTime IS NULL OR reminderTime = ''
          THEN 1
          ELSE 0
        END,
        reminderTime ASC,
        id DESC
    `);
  }
  async insert(
    medication: Medication
  ): Promise<void> {
    db.runSync(
      `
      INSERT INTO medication (
        medicine,
        dosage,
        unit,
        frequency,
        reminderTime,
        notes,
        completed,
        completedAt,
        createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        medication.medicine,
        medication.dosage ?? "",
        medication.unit ?? "",
        medication.frequency ?? "",
        medication.reminderTime ?? "",
        medication.notes ?? "",
        medication.completed,
        medication.completedAt ?? null,
        medication.createdAt,
      ]
    );
  }
  async markCompleted(
    id: number
  ): Promise<void> {
    db.runSync(
      `
      UPDATE medication
      SET
        completed = 1,
        completedAt = ?
      WHERE id = ?
      `,
      [
        new Date().toISOString(),
        id,
      ]
    );
  }
  async markPending(
    id: number
  ): Promise<void> {
    db.runSync(
      `
      UPDATE medication
      SET
        completed = 0,
        completedAt = NULL
      WHERE id = ?
      `,
      [id]
    );
  }
  async delete(
    id: number
  ): Promise<void> {
    db.runSync(
      `
      DELETE FROM medication
      WHERE id = ?
      `,
      [id]
    );
  }
}