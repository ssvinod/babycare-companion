import { shortDate } from "../src/utils/dateFormatter.js";
import { loadProfile } from "../src/services/profileService.js";
import { generateTimeline } from "../src/services/timelineService.js";

const child = loadProfile();

const timeline = generateTimeline(child);

console.log(
    JSON.stringify(
        timeline,
        null,
        4
    )
);