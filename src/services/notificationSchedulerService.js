export function generateNotifications(context) {
    const notifications = [];
    for (const vaccine of context.vaccinations ?? []) {
        if (!vaccine.completed) {
            notifications.push({
                id: vaccine.id,
                type: "vaccination",
                title: vaccine.visit,
                dueDate: vaccine.dueDate,
                priority: "high"
            });
        }
    }
    for (const medication of context.medications ?? []) {
        if (!medication.completed) {
            notifications.push({
                id: medication.id,
                type: "medication",
                title: medication.name,
                dueDate: medication.startDate,
                priority: "medium"
            });
        }
    }
    for (const appointment of context.appointments ?? []) {
        notifications.push({
            id: appointment.id,
            type: "appointment",
            title: appointment.age,
            dueDate: appointment.dueDate,
            priority: "medium"
        });
    }
    notifications.sort(
        (a, b) =>
            new Date(a.dueDate) -
            new Date(b.dueDate)
    );
    return notifications;
}