import { db } from "./database";
import MedicationDoseService from "../services/MedicationDoseService";
export type DashboardMedicationStatus =
  | "pending"
  | "taken"
  | "skipped";
export interface DashboardMedication {
  id: number;
  medicationId: number;
  medicine: string;
  dosage: string;
  unit: string;
  time: string;
  status: DashboardMedicationStatus;
  takenAt: string | null;
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
interface FeedingSummaryRow {
  count: number;
  quantity: number;
}
interface LatestFeedingRow {
  time: string | null;
}
interface LatestGrowthRow {
  weight: number | null;
}
interface VaccineRow {
  vaccine: string | null;
  dueDate: string | null;
}
interface LatestSleepRow {
  endTime: string | null;
}
export default class DashboardRepository {
  async getSummary(): Promise<
    DashboardSummary
  > {
    const today =
      localDateString();
    /*
     * Ensure today's medication-dose rows
     * exist before loading the dashboard.
     */
    await MedicationDoseService.ensureDosesForDate(
      today
    );
    const feedings =
      db.getFirstSync<FeedingSummaryRow>(
        `
        SELECT
          COUNT(*) AS count,
          COALESCE(
            SUM(quantity),
            0
          ) AS quantity
        FROM feeding
        WHERE date(time) = ?
        `,
        [today]
      );
    const latest =
      db.getFirstSync<LatestFeedingRow>(
        `
        SELECT time
        FROM feeding
        ORDER BY time DESC
        LIMIT 1
        `
      );
    const growth =
      db.getFirstSync<LatestGrowthRow>(
        `
        SELECT weight
        FROM growth
        ORDER BY date DESC
        LIMIT 1
        `
      );
    const vaccine =
      db.getFirstSync<VaccineRow>(
        `
        SELECT
          vaccine,
          dueDate
        FROM vaccination
        WHERE completed = 0
        ORDER BY dueDate ASC
        LIMIT 1
        `
      );
    const latestSleep =
      db.getFirstSync<LatestSleepRow>(
        `
        SELECT endTime
        FROM sleep
        WHERE endTime IS NOT NULL
        ORDER BY endTime DESC
        LIMIT 1
        `
      );
    let predictedNap:
      | string
      | null = null;
    if (latestSleep?.endTime) {
      const nap = new Date(
        latestSleep.endTime
      );
      if (
        !Number.isNaN(
          nap.getTime()
        )
      ) {
        nap.setHours(
          nap.getHours() + 2
        );
        predictedNap =
          nap.toISOString();
      }
    }
    /*
     * Read today's individual doses.
     *
     * medication.completed is intentionally
     * not used here. Each dose has its own
     * status in medication_dose.
     */
    const todayMedications =
      db.getAllSync<DashboardMedication>(
        `
        SELECT
          dose.id AS id,
          dose.medicationId
            AS medicationId,
          medication.medicine
            AS medicine,
          COALESCE(
            medication.dosage,
            ''
          ) AS dosage,
          COALESCE(
            medication.unit,
            ''
          ) AS unit,
          dose.scheduledTime
            AS time,
          CASE
            WHEN dose.status =
              'taken'
              THEN 'taken'
            WHEN dose.status =
              'skipped'
              THEN 'skipped'
            ELSE 'pending'
          END AS status,
          dose.takenAt
            AS takenAt
        FROM medication_dose
          AS dose
        INNER JOIN medication
          ON medication.id =
             dose.medicationId
        WHERE
          dose.scheduledDate = ?
        ORDER BY
          dose.scheduledTime ASC,
          dose.id ASC
        `,
        [today]
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