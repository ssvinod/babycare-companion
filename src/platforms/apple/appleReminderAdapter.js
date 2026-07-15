import { createCalendarUID } from "../../services/eventIdService.js";

export function toAppleReminders(child, vaccinations) {

    const reminders = [];

    for (const visit of vaccinations) {

        for (const reminderDate of visit.reminders) {

            reminders.push({

                uid: createCalendarUID(child, visit),

                title: visit.title ?? `${visit.visit} Vaccination`,

                dueDate: reminderDate,

                notes: visit.vaccines.join(", ")

            });

        }

    }

    return reminders;

}