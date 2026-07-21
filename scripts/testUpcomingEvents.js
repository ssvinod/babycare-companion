import { createApplicationContext } from "../src/services/applicationContext.js";
import { getUpcomingEvents } from "../src/services/upcomingEventsService.js";

const context = createApplicationContext();

const upcoming = getUpcomingEvents(
    context,
    new Date("2026-08-01")
);

console.log(JSON.stringify(upcoming, null, 4));