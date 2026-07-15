import { createCalendarUID } from "../../services/eventIdService.js";

export function toAppleReminders(child, vaccinations) {

    return vaccinations.map(visit => ({

        id: createCalendarUID(child, visit),

        title: visit.title ?? `${visit.visit} Vaccination`,

        dueDate: visit.dueDate,

        notes: (visit.vaccines ?? []).join(", "),

        reminders: visit.reminders

    }));

}