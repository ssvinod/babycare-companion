import { db } from '../database/database';
import FeedingRepository from '../database/FeedingRepository';
import GrowthRepository from '../database/GrowthRepository';
import SleepRepository from '../database/SleepRepository';
import VaccinationRepository from '../database/VaccinationRepository';
import { TimelineItem } from '../types/Timeline';
interface MedicationDoseTimelineRow {
    id: number;
    medicationId: number;
    medicine: string;
    dosage: string | null;
    unit: string | null;
    scheduledDate: string;
    scheduledTime: string;
    takenAt: string | null;
    status: string;
}
const feedingRepository = new FeedingRepository();
const sleepRepository = new SleepRepository();
const growthRepository = new GrowthRepository();
const vaccinationRepository = new VaccinationRepository();
function formatSleepDuration(durationMinutes?: number | null): string {
    if (durationMinutes === null || durationMinutes === undefined) {
        return 'Sleep in progress';
    }
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    if (hours === 0) {
        return `${minutes} min`;
    }
    if (minutes === 0) {
        return `${hours} hr`;
    }
    return `${hours} hr ${minutes} min`;
}
function formatMedicationDose(dosage?: string | null, unit?: string | null): string {
    const value = [dosage?.trim(), unit?.trim()].filter(Boolean).join(' ');
    return value ? `${value} given` : 'Medication given';
}
function medicationDoseTimestamp(dose: MedicationDoseTimelineRow): string {
    if (dose.takenAt) {
        return dose.takenAt;
    }
    return `${dose.scheduledDate}T${dose.scheduledTime}:00`;
}
export type ClearableTimelineType = 'feeding' | 'sleep' | 'medication';
function vaccinationTimestamp(dueDate: string, completedDate?: string | null): string {
    if (completedDate) {
        return completedDate;
    }
    return `${dueDate}T00:00:00`;
}
function growthTimestamp(value: string): string {
    return value.includes('T') ? value : `${value}T00:00:00`;
}
function validTimestamp(timestamp: string): boolean {
    return !Number.isNaN(new Date(timestamp).getTime());
}
export default class TimelineService {
    static async clearHistory(type: ClearableTimelineType): Promise<void> {
        if (type === 'feeding') {
            db.runSync(`
        DELETE FROM feeding
      `);

            return;
        }
        if (type === 'sleep') {
            /*
             * Preserve an active sleep session.
             * Only completed sleep history is removed.
             */
            db.runSync(`
        DELETE FROM sleep
        WHERE endTime IS NOT NULL
      `);

            return;
        }
        /*
         * Remove dose history only.
         * Medication prescriptions and reminder
         * schedules remain untouched.
         */
        db.runSync(`
      DELETE FROM medication_dose
    `);
    }
    static async getTimeline(): Promise<TimelineItem[]> {
        const [feedings, sleeps, growthRecords, vaccinations] = await Promise.all([
            feedingRepository.getAll(),
            sleepRepository.getAll(),
            growthRepository.getAll(),
            vaccinationRepository.getAll(),
        ]);
        const medicationDoses = db.getAllSync<MedicationDoseTimelineRow>(
            `
        SELECT
          dose.id,
          dose.medicationId,
          medication.medicine,
          medication.dosage,
          medication.unit,
          dose.scheduledDate,
          dose.scheduledTime,
          dose.takenAt,
          dose.status
        FROM medication_dose AS dose
        INNER JOIN medication
          ON medication.id =
             dose.medicationId
        WHERE dose.status = 'taken'
        ORDER BY
          COALESCE(
            dose.takenAt,
            dose.scheduledDate ||
              'T' ||
              dose.scheduledTime ||
              ':00'
          ) DESC
        `
        );
        const feedingItems: TimelineItem[] = feedings.map(
            (feeding, index): TimelineItem => ({
                id: `feeding-${feeding.id ?? index}`,
                type: 'feeding',
                title: 'Feeding',
                subtitle: [feeding.type, feeding.quantity]
                    .filter(
                        (value) => value !== null && value !== undefined && value !== ''
                    )
                    .join(' • '),
                timestamp: feeding.time,
            })
        );
        const sleepItems: TimelineItem[] = sleeps.map((sleep, index): TimelineItem => ({
            id: `sleep-${sleep.id ?? index}`,
            type: 'sleep',
            title: sleep.endTime ? 'Sleep' : 'Sleep started',
            subtitle: formatSleepDuration(sleep.durationMinutes),
            timestamp: sleep.startTime,
            status: sleep.endTime ? 'completed' : 'active',
        }));
        const growthItems: TimelineItem[] = growthRecords.map(
            (growth, index): TimelineItem => {
                const measurements = [`${growth.weight} kg`, `${growth.height} cm`];
                if (
                    growth.headCircumference !== null &&
                    growth.headCircumference !== undefined
                ) {
                    measurements.push(`Head ${growth.headCircumference} cm`);
                }
                return {
                    id: `growth-${growth.id ?? index}`,
                    type: 'growth',
                    title: 'Growth recorded',
                    subtitle: measurements.join(' • '),
                    timestamp: growthTimestamp(growth.date),
                };
            }
        );
        const medicationItems: TimelineItem[] = medicationDoses.map(
            (dose): TimelineItem => ({
                id: `medication-dose-${dose.id}`,
                type: 'medication',
                title: dose.medicine,
                subtitle: formatMedicationDose(dose.dosage, dose.unit),
                timestamp: medicationDoseTimestamp(dose),
                status: 'completed',
                payload: {
                    medicationId: dose.medicationId,
                    scheduledDate: dose.scheduledDate,
                    scheduledTime: dose.scheduledTime,
                    takenAt: dose.takenAt,
                },
            })
        );
        const vaccinationItems: TimelineItem[] = vaccinations
            .filter((vaccination) => vaccination.completed === 1)
            .map((vaccination, index): TimelineItem => ({
                id: `vaccination-${vaccination.id ?? index}`,
                type: 'vaccination',
                title: vaccination.vaccine,
                subtitle: 'Vaccination completed',
                timestamp: vaccinationTimestamp(
                    vaccination.dueDate,
                    vaccination.completedDate
                ),
                status: 'completed',
            }));
        const items: TimelineItem[] = [
            ...feedingItems,
            ...sleepItems,
            ...growthItems,
            ...medicationItems,
            ...vaccinationItems,
        ];
        return items
            .filter((item) => validTimestamp(item.timestamp))
            .sort(
                (first, second) =>
                    new Date(second.timestamp).getTime() -
                    new Date(first.timestamp).getTime()
            );
    }
}
