import { db } from "./database";
import { Growth } from "../models/Growth";
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
        growth.weight,
        growth.height,
        growth.headCircumference,
        growth.notes ?? "",
      ]
    );
  }
  async delete(id:number){
    db.runSync(
      `
      DELETE FROM growth
      WHERE id=?
      `,
      [id]
    );
  }
}