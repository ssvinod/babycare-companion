import { createApplicationContext } from "../src/services/applicationContext.js";
import { buildDailyTimeline } from "../src/services/dailyTimelineService.js";

const context = createApplicationContext();

console.table(
    buildDailyTimeline(
        context,
        context.child.birthDate
    )
);