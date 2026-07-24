/**
 * Medication Reminder Service
 */
export function getTodaysMedications(
    medications,
    date = new Date()
) {
    return medications.filter(med => {
        if (med.completed)
            return false;
        const start =
            new Date(med.startDate);
        const end =
            new Date(med.endDate);
        return (
            date >= start &&
            date <= end
        );
    });
}
export function markMedicationCompleted(
    medication
) {
    medication.completed = true;
    medication.completedDate =
        new Date();
    return medication;
}