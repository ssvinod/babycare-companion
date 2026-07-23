import { createApplicationContext } from "../src/services/applicationContext.js";
import { buildTimelineStatistics } from "../src/services/timelineStatisticsService.js";

const context = createApplicationContext();

console.table(
    buildTimelineStatistics(
        context.timeline
    )
);