import { loadProfile } from "../src/services/profileService.js";
import { generateTimeline } from "../src/services/timelineService.js";
import { filterTimeline } from "../src/services/timelineFilterService.js";

const child = loadProfile();

const timeline = generateTimeline(child);

const vaccinations = filterTimeline(
    timeline,
    "vaccination"
);

console.log(JSON.stringify(vaccinations, null, 4));