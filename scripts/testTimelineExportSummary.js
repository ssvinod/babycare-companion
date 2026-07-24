import { shortDate } from "../src/utils/dateFormatter.js";
import { createApplicationContext } from "../src/services/applicationContext.js";
import { buildTimelineExportSummary } from "../src/services/timelineExportSummaryService.js";

const context = createApplicationContext();

console.table(
    buildTimelineExportSummary(
        context.timeline
    )
);