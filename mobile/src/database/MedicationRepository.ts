import { db } from './database';
import { Medication } from '../models/Medication';
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
        reminderTimes,
        startDate,
        endDate,
        COALESCE(
          remindersEnabled,
          0
        ) AS remindersEnabled,
        notificationIds,
        notes,
        COALESCE(
          completed,
          0
        ) AS completed,
        completedAt,
        COALESCE(
          createdAt,
          ''
        ) AS createdAt
      FROM medication
      ORDER BY
        completed ASC,
        CASE
          WHEN
            reminderTime IS NULL
            OR reminderTime = ''
          THEN 1
          ELSE 0
        END,
        reminderTime ASC,
        id DESC
    `);
    }
    async getById(id: number): Promise<Medication | null> {
        return (
            db.getFirstSync<Medication>(
                `
        SELECT
          id,
          medicine,
          dosage,
          unit,
          frequency,
          reminderTime,
          reminderTimes,
          startDate,
          endDate,
          COALESCE(
            remindersEnabled,
            0
          ) AS remindersEnabled,
          notificationIds,
          notes,
          COALESCE(
            completed,
            0
          ) AS completed,
          completedAt,
          COALESCE(
            createdAt,
            ''
          ) AS createdAt
        FROM medication
        WHERE id = ?
        `,
                [id]
            ) ?? null
        );
    }
    async insert(medication: Omit<Medication, 'id'>): Promise<number> {
        const result = db.runSync(
            `
      INSERT INTO medication (
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
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?
      )
      `,
            [
                medication.medicine,
                medication.dosage ?? '',
                medication.unit ?? '',
                medication.frequency ?? '',
                medication.reminderTime ?? '',
                medication.reminderTimes ?? '[]',
                medication.startDate ?? '',
                medication.endDate ?? '',
                medication.remindersEnabled ?? 0,
                medication.notificationIds ?? '[]',
                medication.notes ?? '',
                medication.completed,
                medication.completedAt ?? null,
                medication.createdAt,
            ]
        );
        return Number(result.lastInsertRowId);
    }
    async update(medication: Medication): Promise<void> {
        if (!medication.id) {
            throw new Error('Medication ID is required for update.');
        }
        db.runSync(
            `
    UPDATE medication
    SET
      medicine = ?,
      dosage = ?,
      unit = ?,
      frequency = ?,
      reminderTime = ?,
      reminderTimes = ?,
      startDate = ?,
      endDate = ?,
      remindersEnabled = ?,
      notificationIds = ?,
      notes = ?,
      completed = ?,
      completedAt = ?
    WHERE id = ?
    `,
            [
                medication.medicine,
                medication.dosage ?? '',
                medication.unit ?? '',
                medication.frequency ?? '',
                medication.reminderTime ?? '',
                medication.reminderTimes ?? '[]',
                medication.startDate ?? '',
                medication.endDate ?? '',
                medication.remindersEnabled ?? 0,
                medication.notificationIds ?? '[]',
                medication.notes ?? '',
                medication.completed,
                medication.completedAt ?? null,
                medication.id,
            ]
        );
    }
    async updateNotificationIds(id: number, notificationIds: string[]): Promise<void> {
        db.runSync(
            `
      UPDATE medication
      SET notificationIds = ?
      WHERE id = ?
      `,
            [JSON.stringify(notificationIds), id]
        );
    }
    async markCompleted(id: number): Promise<void> {
        db.runSync(
            `
      UPDATE medication
      SET
        completed = 1,
        completedAt = ?
      WHERE id = ?
      `,
            [new Date().toISOString(), id]
        );
    }
    async markPending(id: number): Promise<void> {
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
    async delete(id: number): Promise<void> {
        db.runSync(
            `
      DELETE FROM medication
      WHERE id = ?
      `,
            [id]
        );
    }
    async clearAllNotificationIds(): Promise<void> {
        db.runSync(`
    UPDATE medication
    SET notificationIds = '[]'
  `);
    }
    async getReminderEnabled(): Promise<Medication[]> {
        return db.getAllSync<Medication>(`
    SELECT
      id,
      medicine,
      dosage,
      unit,
      frequency,
      reminderTime,
      reminderTimes,
      startDate,
      endDate,
      COALESCE(
        remindersEnabled,
        0
      ) AS remindersEnabled,
      notificationIds,
      notes,
      COALESCE(
        completed,
        0
      ) AS completed,
      completedAt,
      COALESCE(
        createdAt,
        ''
      ) AS createdAt
    FROM medication
    WHERE
      COALESCE(
        remindersEnabled,
        0
      ) = 1
      AND COALESCE(
        completed,
        0
      ) = 0
    ORDER BY id ASC
  `);
    }
}
