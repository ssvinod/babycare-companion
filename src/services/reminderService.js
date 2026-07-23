export function generateReminders(context) {
    const reminders = [];
    context.timeline.forEach(event => {
        reminders.push({
            id:
                event.id ??
                `${event.type}-${event.title}`,
            title:
                event.title,
            dueDate:
                event.date,
            category:
                event.type,
            completed:
                event.status ===
                "completed"
        });
    });
    reminders.sort(
        (a, b) =>
            new Date(a.dueDate) -
            new Date(b.dueDate)
    );
    return reminders;
}