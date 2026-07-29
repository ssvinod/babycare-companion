import { db } from "./database";
import {
  MedicationDose,
  MedicationDoseStatus,
} from "../models/MedicationDose";
export default class MedicationDoseRepository {
  async getForDate(
    date: string
  ): Promise<MedicationDose[]> {
    return db.getAllSync<MedicationDose>(
      `
      SELECT
        id,
        medicationId,
        scheduledDate,
        scheduledTime,
        takenAt,
        status,
        notes
      FROM medication_dose
      WHERE scheduledDate = ?
      ORDER BY scheduledTime ASC, id ASC
      `,
      [date]
    );
  }
  async getForMedication(
    medicationId: number
  ): Promise<MedicationDose[]> {
    return db.getAllSync<MedicationDose>(
      `
      SELECT
        id,
        medicationId,
        scheduledDate,
        scheduledTime,
        takenAt,
        status,
        notes
      FROM medication_dose
      WHERE medicationId = ?
      ORDER BY
        scheduledDate DESC,
        scheduledTime DESC
      `,
      [medicationId]
    );
  }
  async getForMedicationAndDate(
    medicationId: number,
    date: string
  ): Promise<MedicationDose[]> {
    return db.getAllSync<MedicationDose>(
      `
      SELECT
        id,
        medicationId,
        scheduledDate,
        scheduledTime,
        takenAt,
        status,
        notes
      FROM medication_dose
      WHERE
        medicationId = ?
        AND scheduledDate = ?
      ORDER BY scheduledTime ASC
      `,
      [medicationId, date]
    );
  }
  async createIfMissing(
    dose: Omit<
      MedicationDose,
      "id"
    >
  ): Promise<void> {
    db.runSync(
      `
    INSERT OR IGNORE INTO
      medication_dose (
        medicationId,
        scheduledDate,
        scheduledTime,
        takenAt,
        status,
        notes,
        createdAt
      )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        dose.medicationId,
        dose.scheduledDate,
        dose.scheduledTime,
        dose.takenAt ?? null,
        dose.status,
        dose.notes ?? "",
        new Date().toISOString(),
      ]
    );
  }
  async markTaken(
    id: number,
    takenAt = new Date().toISOString()
  ): Promise<void> {
    db.runSync(
      `
      UPDATE medication_dose
      SET
        status = 'taken',
        takenAt = ?
      WHERE id = ?
      `,
      [takenAt, id]
    );
  }
  async markSkipped(
    id: number
  ): Promise<void> {
    db.runSync(
      `
      UPDATE medication_dose
      SET
        status = 'skipped',
        takenAt = NULL
      WHERE id = ?
      `,
      [id]
    );
  }
  async markPending(
    id: number
  ): Promise<void> {
    db.runSync(
      `
      UPDATE medication_dose
      SET
        status = 'pending',
        takenAt = NULL
      WHERE id = ?
      `,
      [id]
    );
  }
  async updateStatus(
    id: number,
    status: MedicationDoseStatus
  ): Promise<void> {
    if (status === "taken") {
      await this.markTaken(id);
      return;
    }
    if (status === "skipped") {
      await this.markSkipped(id);
      return;
    }
    await this.markPending(id);
  }
  async deleteForMedication(
    medicationId: number
  ): Promise<void> {
    db.runSync(
      `
      DELETE FROM medication_dose
      WHERE medicationId = ?
      `,
      [medicationId]
    );
  }
  async clearAll(): Promise<void> {
    db.runSync(`
      DELETE FROM medication_dose
    `);
  }
}