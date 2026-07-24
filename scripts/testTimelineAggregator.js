import { shortDate } from "../src/utils/dateFormatter.js";
import { createApplicationContext } from "../src/services/applicationContext.js";
import { buildTimeline } from "../src/services/timelineAggregator.js";

const context = createApplicationContext();

console.log(
    JSON.stringify(
        buildTimeline(context),
        null,
        4
    )
);