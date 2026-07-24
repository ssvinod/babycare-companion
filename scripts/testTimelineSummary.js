import { shortDate } from "../src/utils/dateFormatter.js";
import { createApplicationContext } from "../src/services/applicationContext.js";
import { buildTimelineSummary } from "../src/services/timelineSummaryService.js";

const context = createApplicationContext();

console.table(buildTimelineSummary(context));