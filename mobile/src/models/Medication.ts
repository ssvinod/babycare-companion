export interface Medication {
    id?: number;
    medicine: string;
    dosage?: string;
    unit?: string;
    frequency?: string;
    /**
     * Legacy single reminder time.
     * Kept temporarily for older records.
     */
    reminderTime?: string;
    /**
     * JSON string such as:
     * ["08:00","20:00"]
     */
    reminderTimes?: string;
    /**
     * YYYY-MM-DD
     */
    startDate?: string;
    /**
     * YYYY-MM-DD or empty when ongoing.
     */
    endDate?: string;
    remindersEnabled?: number;
    /**
     * JSON list of Expo notification IDs.
     */
    notificationIds?: string;
    notes?: string;
    completed: number;
    completedAt?: string | null;
    createdAt: string;
}
