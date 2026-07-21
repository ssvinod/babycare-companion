import { HEALTH_VISIT_SCHEDULE } from "../config/healthVisitSchedule.js";
import { addOffset } from "../utils/dateUtils.js";

export function generateHealthVisitPlan(child) {

    return HEALTH_VISIT_SCHEDULE.map(visit => ({

        ...visit,

        dueDate: addOffset(
            child.birthDate,
            visit.offset
        )

    }));

}