export function buildCompletionMap(context) {
    const completed = new Set();
    // Vaccinations
    (context.vaccinationHistory ?? []).forEach(v => {
        completed.add(
            `vaccination-${v.id}`
        );
    });
    // Growth
    (context.growthHistory ?? []).forEach(g => {
        completed.add(
            `growth-${g.id}`
        );
    });
    // Appointments
    (context.appointmentHistory ?? []).forEach(a => {
        completed.add(
            `appointment-${a.id}`
        );
    });
    return completed;
}
export function getCompletionStatus(
    event,
    completionMap,
    today = new Date()
) {
    if (
        completionMap.has(
            `${event.type}-${event.id}`
        )
    ) {
        return "completed";
    }
    if (
        event.date &&
        new Date(event.date) < today
    ) {
        return "overdue";
    }
    return "pending";
}