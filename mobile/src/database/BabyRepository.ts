import * as SQLite from "expo-sqlite";
import { db } from "./database";
import { Baby } from "../models/Baby";

export default class BabyRepository {
  async getBaby(): Promise<Baby | null> {
    const row = db.getFirstSync<any>(`
      SELECT *
      FROM profile
      LIMIT 1
    `);

    if (!row) {
      return null;
    }

    return {
      id: String(row.id),
      name: row.name,
      gender: row.gender,
      birthDate: row.birthDate,
      weight: row.weight ?? undefined,
      height: row.height ?? undefined,
      bloodGroup: row.bloodGroup ?? undefined,
      photo: row.photo ?? undefined,
    };
  }

  async saveBaby(baby: Baby): Promise<void> {
    const params: SQLite.SQLiteBindParams = [
      baby.id,
      baby.name,
      baby.birthDate,
      baby.gender,
      baby.weight ?? null,
      baby.height ?? null,
      baby.bloodGroup ?? null,
      baby.photo ?? null,
    ];
  
    db.runSync(
      `
      INSERT OR REPLACE INTO profile (
        id,
        name,
        birthDate,
        gender,
        weight,
        height,
        bloodGroup,
        photo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      params
    );
  }
}