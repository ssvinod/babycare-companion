import { IAP_SCHEDULE } from "../config/iapSchedule.js";
import { addOffset } from "../utils/dateUtils.js";

export function generateVaccinationPlan(child) {

    return IAP_SCHEDULE.map(visit => {

        const dueDate = addOffset(
            child.birthDate,
            visit.offset
        );

        return {

            ...visit,

            dueDate,

            reminders: [

                addOffset(dueDate, { days: -7 }),

                addOffset(dueDate, { days: -3 }),

                dueDate

            ]

        };

    });

}