import { db } from "./database";
import { Vaccination } from "../models/Vaccination";
export default class VaccinationRepository {
  async getAll(): Promise<Vaccination[]> {
    return db.getAllSync<Vaccination>(`
      SELECT *
      FROM vaccination
      ORDER BY dueDate ASC
    `);
  }
  async count(): Promise<number> {
    const row =
      db.getFirstSync<{ count: number }>(`
        SELECT COUNT(*) AS count
        FROM vaccination
      `);
    return row?.count ?? 0;
  }
  async insertMany(
    vaccines: Vaccination[]
  ): Promise<void> {
    for (const v of vaccines) {
      const birthDose =
        v.vaccine.includes("BCG");
      db.runSync(
        `
        INSERT INTO vaccination(
          vaccine,
          dueDate,
          completed,
          completedDate
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          v.vaccine,
          v.dueDate,
          birthDose ? 1 : 0,
          birthDose
            ? new Date().toISOString()
            : null,
        ]
      );
    }
    console.log(
      "Vaccinations:",
      db.getAllSync(`
        SELECT *
        FROM vaccination
      `)
    );
  }
  async getUpcoming(): Promise<Vaccination[]> {
    return db.getAllSync<Vaccination>(`
      SELECT *
      FROM vaccination
      WHERE completed = 0
      ORDER BY dueDate ASC
    `);
  }
  async getCompleted(): Promise<Vaccination[]> {
    return db.getAllSync<Vaccination>(`
      SELECT *
      FROM vaccination
      WHERE completed = 1
      ORDER BY dueDate DESC
    `);
  }
  async upcomingCount(): Promise<number> {
    const row =
      db.getFirstSync<{ count: number }>(`
        SELECT COUNT(*) AS count
        FROM vaccination
        WHERE completed = 0
      `);
    return row?.count ?? 0;
  }
  async completedCount(): Promise<number> {
    const row =
      db.getFirstSync<{ count: number }>(`
        SELECT COUNT(*) AS count
        FROM vaccination
        WHERE completed = 1
      `);
    return row?.count ?? 0;
  }
  async nextVaccination(): Promise<Vaccination | null> {
    return db.getFirstSync<Vaccination>(`
      SELECT *
      FROM vaccination
      WHERE completed = 0
      ORDER BY dueDate ASC
      LIMIT 1
    `);
  }
  async markCompleted(
    id: number
  ): Promise<void> {
    db.runSync(
      `
      UPDATE vaccination
      SET
        completed = 1,
        completedDate = ?
      WHERE id = ?
      `,
      [
        new Date().toISOString(),
        id,
      ]
    );
  }
  async markPending(id: number) {
    db.runSync(
      `
      UPDATE vaccination
      SET
        completed=0,
        completedDate=NULL
      WHERE id=?
      `,
      [id]
    );
  }
}