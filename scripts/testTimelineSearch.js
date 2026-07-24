import { shortDate } from "../src/utils/dateFormatter.js";
import { createApplicationContext } from "../src/services/applicationContext.js";
import { searchTimeline } from "../src/services/timelineSearchService.js";

const context = createApplicationContext();

console.log("\nSearch: vaccination\n");

console.table(
    searchTimeline(
        context,
        "vaccination"
    )
);