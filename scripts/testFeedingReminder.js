import {
    getLastFeeding
} from "../src/services/feedingService.js";
import {
    shouldFeedAgain,
    nextFeedTime
} from "../src/services/feedingReminderService.js";
import {
    shortDate,
    shortDateTime
} from "../src/utils/dateFormatter.js";
const last =
    getLastFeeding("baby");
console.log("\nLast Feed\n");
console.dir(last);
console.log("\nShould Feed Again?\n");
console.log(
    shouldFeedAgain(last)
);
console.log("\nNext Feed Time\n");
console.log(
    nextFeedTime(last)
        ? shortDateTime(nextFeedTime(last))
        : "Now"
);