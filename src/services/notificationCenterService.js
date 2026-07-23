import { isPending, isOverdue } from "./eventStatusService.js";

export function buildNotificationCenter(context) {
    const notifications = [];
    context.timeline.forEach(event => {
        if (isOverdue(event)) {
            notifications.push({
                severity: "high",
                type: event.type,
                title: event.title,
                message: `${event.title} is overdue.`,
                dueDate: event.date
            });
        }
        else if (isPending(event)) {
            notifications.push({
                severity: "info",
                type: event.type,
                title: event.title,
                message: `${event.title} is upcoming.`,
                dueDate: event.date
            });
        }
    });
    context.insights?.forEach(insight => {
        notifications.push({
            severity: insight.severity,
            type: "insight",
            title: insight.title,
            message: insight.message
        });
    });
    context.recommendations?.forEach(rec => {
        notifications.push({
            severity: rec.priority,
            type: "recommendation",
            title: rec.category,
            message: rec.action
        });
    });
    return notifications;
}