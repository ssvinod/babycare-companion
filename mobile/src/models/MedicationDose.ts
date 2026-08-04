export type MedicationDoseStatus = 'pending' | 'taken' | 'skipped';
export interface MedicationDose {
    id?: number;
    medicationId: number;
    /**
     * YYYY-MM-DD
     */
    scheduledDate: string;
    /**
     * HH:mm
     */
    scheduledTime: string;
    /**
     * Full ISO timestamp when actually given.
     */
    takenAt?: string | null;
    status: MedicationDoseStatus;
    notes?: string | null;
}
