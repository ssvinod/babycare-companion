import MedicationRepository from '../database/MedicationRepository';
import MedicationDoseRepository from '../database/MedicationDoseRepository';
import { Medication } from '../models/Medication';
import { MedicationDose } from '../models/MedicationDose';
const medicationRepository = new MedicationRepository();
const doseRepository = new MedicationDoseRepository();
export interface TodayMedicationDose {
    dose: MedicationDose;
    medication: Medication;
}
function getLocalDateString(date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function parseReminderTimes(medication: Medication): string[] {
    try {
        const parsed = JSON.parse(medication.reminderTimes ?? '[]');
        if (Array.isArray(parsed)) {
            const validTimes = parsed
                .filter((value) => typeof value === 'string')
                .map((value) => value.trim())
                .filter(Boolean);
            if (validTimes.length > 0) {
                return Array.from(new Set(validTimes)).sort();
            }
        }
    } catch (error) {
        console.warn(
            'Invalid medication reminderTimes:',
            medication.reminderTimes,
            error
        );
    }
    const legacyTime = medication.reminderTime?.trim();
    return legacyTime ? [legacyTime] : [];
}
function isMedicationActiveOnDate(medication: Medication, date: string): boolean {
    if (medication.completed === 1) {
        return false;
    }
    if (medication.startDate && date < medication.startDate) {
        return false;
    }
    if (medication.endDate && date > medication.endDate) {
        return false;
    }
    return true;
}
export default class MedicationDoseService {
    static async ensureDosesForDate(date = getLocalDateString()): Promise<void> {
        const medications = await medicationRepository.getAll();
        for (const medication of medications) {
            if (
                medication.id === undefined ||
                !isMedicationActiveOnDate(medication, date)
            ) {
                continue;
            }
            const reminderTimes = parseReminderTimes(medication);
            for (const scheduledTime of reminderTimes) {
                await doseRepository.createIfMissing({
                    medicationId: medication.id,
                    scheduledDate: date,
                    scheduledTime,
                    takenAt: null,
                    status: 'pending',
                    notes: '',
                });
            }
        }
    }
    static async getDosesForDate(
        date = getLocalDateString()
    ): Promise<TodayMedicationDose[]> {
        await this.ensureDosesForDate(date);
        const [doses, medications] = await Promise.all([
            doseRepository.getForDate(date),
            medicationRepository.getAll(),
        ]);
        const medicationMap = new Map<number, Medication>();
        medications.forEach((medication) => {
            if (medication.id !== undefined) {
                medicationMap.set(medication.id, medication);
            }
        });
        return doses.flatMap((dose) => {
            const medication = medicationMap.get(dose.medicationId);
            if (!medication) {
                return [];
            }
            return [
                {
                    dose,
                    medication,
                },
            ];
        });
    }
    static async getTodayDoses(): Promise<TodayMedicationDose[]> {
        return this.getDosesForDate(getLocalDateString());
    }
    static async markTaken(doseId: number): Promise<void> {
        await doseRepository.markTaken(doseId);
    }
    static async markSkipped(doseId: number): Promise<void> {
        await doseRepository.markSkipped(doseId);
    }
    static async markPending(doseId: number): Promise<void> {
        await doseRepository.markPending(doseId);
    }
}
