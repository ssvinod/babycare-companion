import { loadProfile } from "../src/services/profileService.js";
import { generateTimeline } from "../src/services/timelineService.js";
import { getUpcomingEvents } from "../src/services/upcomingEventsService.js";

const child = loadProfile();

const timeline = generateTimeline(child);

const upcoming = getUpcomingEvents(
    timeline,
    new Date("2026-08-01")
);

console.log(JSON.stringify(upcoming, null, 4));