export function updateVaccinationStatus(events, completedVisits) {
    const completedMap = new Map();
    completedVisits.forEach(record => {
        completedMap.set(
            record.id,
            record.completedDate
        );
    });
    events.forEach(event => {
        if (completedMap.has(event.id)) {
            event.status = "completed";
            event.completedDate =
                new Date(
                    completedMap.get(event.id)
                );
        }
    });
    return events;
}

export function getNextVaccination(events) {
    const today = new Date();
    return events
        .filter(
            e =>
                !e.isCompleted() &&
                e.dueDate >= today
        )
        .sort(
            (a, b) =>
                a.dueDate - b.dueDate
        )[0] ?? null;
}