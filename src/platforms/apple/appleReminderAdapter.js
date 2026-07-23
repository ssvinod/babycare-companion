export function toAppleReminders(reminders) {
    return reminders.map(reminder => ({
        title:
            reminder.title,
        dueDate:
            reminder.dueDate,
        notes:
            reminder.category,
        completed:
            reminder.completed
    }));
}