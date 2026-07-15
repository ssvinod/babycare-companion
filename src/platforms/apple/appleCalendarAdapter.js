import {
    createCalendarUID
} from "../../services/eventIdService.js";

export function toAppleCalendar(child, schedule) {

    return schedule.map(visit => ({

        uid: createCalendarUID(child, visit),

        title:
            visit.title ??
            `${visit.visit} Vaccination`,

        startDate: visit.dueDate,

        notes:
            visit.vaccines?.join(", ") ??
            visit.milestones?.join(", ") ??
            ""

    }));

}