import { shortDate } from "../src/utils/dateFormatter.js";
import { createApplicationContext } from "../src/services/applicationContext.js";
import { aggregateTimeline } from "../src/services/timelineAggregator.js";

const context =
    createApplicationContext();

context.growthHistory = [
    {
        id: "birth"
    }
];

context.vaccinationHistory = [
    {
        id: "birth"
    }
];

const timeline =
    aggregateTimeline(context);

console.table(
    timeline.slice(0,6).map(e => ({
        title: e.title,
        status: e.status
    }))
);