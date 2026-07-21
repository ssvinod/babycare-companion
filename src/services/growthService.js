import { GROWTH_SCHEDULE } from "../config/growthSchedule.js";
import { addOffset } from "../utils/dateUtils.js";

export function generateGrowthPlan(child) {

    return GROWTH_SCHEDULE.map(item => ({

        ...item,

        dueDate: addOffset(
            child.birthDate,
            item.offset
        )

    }));

}