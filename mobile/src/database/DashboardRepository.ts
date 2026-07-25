import { db } from "./database";

export interface DashboardSummary {
  todayFeedings: number;
  lastFeeding: string | null;
}

export default class DashboardRepository {
  getSummary(): DashboardSummary {
    const today = new Date().toISOString().substring(0, 10);

    const feedings =
      db.getFirstSync<{ count: number }>(
        `
        SELECT COUNT(*) AS count
        FROM feeding
        WHERE substr(time,1,10)=?
        `,
        [today]
      );

    const latest =
      db.getFirstSync<{ time: string }>(
        `
        SELECT time
        FROM feeding
        ORDER BY time DESC
        LIMIT 1
        `
      );

    return {
      todayFeedings: feedings?.count ?? 0,
      lastFeeding: latest?.time ?? null,
    };
  }
}