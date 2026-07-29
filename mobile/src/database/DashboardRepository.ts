import { db } from "./database";
export interface DashboardMedication {
  id: number;
  medicine: string;
  dosage: string;
  unit: string;
  time: string;
  completed: number;
}
export interface DashboardSummary {
  todayFeedings: number;
  todayQuantity: number;
  lastFeeding: string | null;
  latestWeight: number | null;
  nextVaccine: string | null;
  nextVaccineDate: string | null;
  nextSleep: string | null;
  nextSleepTime: string | null;
  todayMedications:
    DashboardMedication[];
}
function localDateString(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function medicationTimes(
  reminderTimes: string | null,
  reminderTime: string | null
): string[] {
  if (reminderTimes) {
    try {
      const parsed = JSON.parse(
        reminderTimes
      );
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (value): value is string =>
            typeof value === "string"
        );
      }
    } catch {
      // Use legacy reminderTime.
    }
  }
  return reminderTime
    ? [reminderTime]
    : [];
}
export default class DashboardRepository {
  getSummary(): DashboardSummary {
    const today =
      localDateString();
    const feedings =
      db.getFirstSync<any>(
        `
        SELECT
          COUNT(*) count,
          COALESCE(
            SUM(quantity),
            0
          ) quantity
        FROM feeding
        WHERE date(time) = ?
        `,
        [today]
      );
    const latest =
      db.getFirstSync<any>(`
        SELECT time
        FROM feeding
        ORDER BY time DESC
        LIMIT 1
      `);
    const growth =
      db.getFirstSync<any>(`
        SELECT weight
        FROM growth
        ORDER BY date DESC
        LIMIT 1
      `);
    const vaccine =
      db.getFirstSync<any>(`
        SELECT
          vaccine,
          dueDate
        FROM vaccination
        WHERE completed = 0
        ORDER BY dueDate ASC
        LIMIT 1
      `);
    const latestSleep =
      db.getFirstSync<any>(`
        SELECT endTime
        FROM sleep
        ORDER BY endTime DESC
        LIMIT 1
      `);
    let predictedNap:
      | string
      | null = null;
    if (latestSleep?.endTime) {
      const nap = new Date(
        latestSleep.endTime
      );
      nap.setHours(
        nap.getHours() + 2
      );
      predictedNap =
        nap.toISOString();
    }
    const medicationRows =
      db.getAllSync<{
        id: number;
        medicine: string;
        dosage: string | null;
        unit: string | null;
        reminderTime:
          | string
          | null;
        reminderTimes:
          | string
          | null;
        startDate:
          | string
          | null;
        endDate:
          | string
          | null;
        completed: number;
      }>(`
        SELECT
          id,
          medicine,
          dosage,
          unit,
          reminderTime,
          reminderTimes,
          startDate,
          endDate,
          COALESCE(
            completed,
            0
          ) AS completed
        FROM medication
        WHERE
          COALESCE(
            remindersEnabled,
            0
          ) = 1
          AND (
            startDate IS NULL
            OR startDate = ''
            OR startDate <= '${today}'
          )
          AND (
            endDate IS NULL
            OR endDate = ''
            OR endDate >= '${today}'
          )
        ORDER BY medicine ASC
      `);
    const todayMedications =
      medicationRows
        .flatMap((row) =>
          medicationTimes(
            row.reminderTimes,
            row.reminderTime
          ).map((time) => ({
            id: row.id,
            medicine:
              row.medicine,
            dosage:
              row.dosage ?? "",
            unit:
              row.unit ?? "",
            time,
            completed:
              row.completed,
          }))
        )
        .sort((first, second) =>
          first.time.localeCompare(
            second.time
          )
        );
    return {
      todayFeedings:
        feedings?.count ?? 0,
      todayQuantity:
        feedings?.quantity ?? 0,
      lastFeeding:
        latest?.time ?? null,
      latestWeight:
        growth?.weight ?? null,
      nextVaccine:
        vaccine?.vaccine ?? null,
      nextVaccineDate:
        vaccine?.dueDate ?? null,
      nextSleep: "Nap",
      nextSleepTime:
        predictedNap,
      todayMedications,
    };
  }
}