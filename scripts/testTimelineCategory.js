import { createApplicationContext } from "../src/services/applicationContext.js";
import { groupTimelineByType } from "../src/services/timelineCategoryService.js";

const context = createApplicationContext();

const grouped =
    groupTimelineByType(context.timeline);

console.table({
    Vaccinations: grouped.vaccinations.length,
    Milestones: grouped.milestones.length,
    Growth: grouped.growth.length,
    Appointments: grouped.appointments.length
});