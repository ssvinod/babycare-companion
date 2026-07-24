import { createApplicationContext } from "../src/services/applicationContext.js";
import { buildWeeklyTimeline } from "../src/services/weeklyTimelineService.js";

const context = createApplicationContext();

console.table(
    buildWeeklyTimeline(
        context,
        context.child.birthDate
    )
);