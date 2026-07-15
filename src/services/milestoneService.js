import { MILESTONE_SCHEDULE } from "../config/milestoneSchedule.js";
import { addOffset } from "../utils/dateUtils.js";

export function generateMilestonePlan(child) {

    return MILESTONE_SCHEDULE.map(item => ({

        ...item,

        dueDate: addOffset(
            child.birthDate,
            item.offset
        )

    }));

}