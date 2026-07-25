import { db } from "./database";
import { Feeding } from "../models/Feeding";

export default class FeedingRepository {
  async getAll(): Promise<Feeding[]> {
    return db.getAllSync<Feeding>(
      `
      SELECT *
      FROM feeding
      ORDER BY time DESC
      `
    );
  }

  async insert(
    feeding: Feeding
  ): Promise<void> {
    db.runSync(
      `
      INSERT INTO feeding(
        time,
        type,
        quantity,
        notes
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        feeding.time,
        feeding.type,
        feeding.quantity,
        feeding.notes ?? "",
      ]
    );

  }

  async delete(id: number) {
    db.runSync(
      `
      DELETE FROM feeding
      WHERE id=?
      `,
      id
    );
  }
}