export function getTodayTasks(context) {
    const tasks = [];
    const today = new Date();
    if (context.dashboard?.vaccinations?.next) {
        const next =
            context.dashboard.vaccinations.next;
        if (next.dueDate <= today) {
            tasks.push({
                type: "vaccination",
                priority: "high",
                title:
                    `${next.visit} vaccination due`
            });
        }
    }
    if (context.nextMeasurementDate) {
        if (context.nextMeasurementDate <= today) {
            tasks.push({
                type: "growth",
                priority: "medium",
                title:
                    "Growth measurement due"
            });
        }
    }
    for (const reminder of context.reminders ?? []) {
        tasks.push({
            type: "reminder",
            priority: "medium",
            title: reminder.title
        });
    }
    return tasks;
}