import { IAP_SCHEDULE } from "../config/iapSchedule.js";
import { addOffset } from "../utils/dateUtils.js";
import { generateReminders } from "./reminderService.js";
import { Event } from "../models/event.js";
export function generateVaccinationPlan(child) {
    return IAP_SCHEDULE.map(visit => {
        const dueDate = addOffset(
            child.birthDate,
            visit.offset
        );
        const event = new Event({
            id: visit.id,
            type: "vaccination",
            title: `${visit.visit} Vaccination`,
            dueDate,
            details: visit.vaccines,
            status: "pending"
        });
        event.visit = visit.visit;
        event.vaccines = visit.vaccines;
        event.reminders = generateReminders(dueDate);
        return event;
    });
}