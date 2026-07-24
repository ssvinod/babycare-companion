import { HistoryItem } from "../models/historyItem.js";
/*
 * Legacy exports
 */
export function loadVaccinationHistory() {
    return [];
}
export function loadGrowthHistory() {
    return [];
}
export function loadAppointmentHistory() {
    return [];
}
export function loadHistory() {
    return {
        vaccinations: loadVaccinationHistory(),
        growth: loadGrowthHistory(),
        appointments: loadAppointmentHistory()
    };
}
/*
 * Unified history
 */
export function buildUnifiedHistory(context) {
    const history = [];
    for (const vaccine of context.vaccinations ?? []) {
        history.push(
            new HistoryItem({
                id: vaccine.id,
                type: "vaccination",
                date:
                    vaccine.completedDate ??
                    vaccine.dueDate,
                title:
                    vaccine.title ??
                    vaccine.visit,
                subtitle:
                    vaccine.completed
                        ? "Completed"
                        : "Scheduled",
                details: vaccine
            })
        );
    }
    for (const medication of context.medications ?? []) {
        history.push(
            new HistoryItem({
                id: medication.id,
                type: "medication",
                date:
                    medication.completedDate ??
                    medication.startDate,
                title: medication.name,
                subtitle:
                    medication.completed
                        ? "Completed"
                        : "Medication",
                details: medication
            })
        );
    }
    for (const feeding of context.feedings ?? []) {
        history.push(
            new HistoryItem({
                id: feeding.id,
                type: "feeding",
                date: feeding.date,
                title: feeding.type,
                subtitle:
                    `${feeding.quantity ?? ""} ${feeding.unit ?? ""}`.trim(),
                details: feeding
            })
        );
    }
    for (const sleep of context.sleep ?? []) {
        history.push(
            new HistoryItem({
                id: sleep.id,
                type: "sleep",
                date: sleep.startTime,
                title: sleep.type,
                subtitle: "Sleep",
                details: sleep
            })
        );
    }
    history.sort(
        (a, b) => b.date - a.date
    );
    return history;
}
/*
 * Compatibility alias
 */
export const buildHistory = buildUnifiedHistory;