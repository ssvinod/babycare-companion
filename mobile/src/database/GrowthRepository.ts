import { db } from './database';
import { Growth } from '../models/Growth';
export default class GrowthRepository {
    async getAll(): Promise<Growth[]> {
        return db.getAllSync<Growth>(`
      SELECT *
      FROM growth
      ORDER BY date DESC
    `);
    }
    async insert(growth: Growth): Promise<void> {
        db.runSync(
            `
      INSERT INTO growth(
        date,
        weight,
        height,
        headCircumference,
        notes
      )
      VALUES (?, ?, ?, ?, ?)
      `,
            [
                growth.date,
                Number(growth.weight),
                Number(growth.height),
                growth.headCircumference === null
                    ? null
                    : Number(growth.headCircumference),
                growth.notes ?? '',
            ]
        );
    }
    async update(growth: Growth): Promise<void> {
        if (growth.id === undefined) {
            throw new Error('Growth record ID is required for update.');
        }
        db.runSync(
            `
      UPDATE growth
      SET
        date = ?,
        weight = ?,
        height = ?,
        headCircumference = ?,
        notes = ?
      WHERE id = ?
      `,
            [
                growth.date,
                Number(growth.weight),
                Number(growth.height),
                growth.headCircumference === null
                    ? null
                    : Number(growth.headCircumference),
                growth.notes ?? '',
                growth.id,
            ]
        );
    }
    async delete(id: number): Promise<void> {
        db.runSync(
            `
      DELETE FROM growth
      WHERE id = ?
      `,
            [id]
        );
    }
    async latest(): Promise<Growth | null> {
        const row = db.getFirstSync<Growth>(`
      SELECT *
      FROM growth
      ORDER BY date DESC
      LIMIT 1
    `);
        return row ?? null;
    }
}
