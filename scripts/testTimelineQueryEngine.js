import { createApplicationContext } from "../src/services/applicationContext.js";
import { TimelineQueryEngine } from "../src/services/timelineQueryEngine.js";

const context =
    createApplicationContext();
const engine =
    new TimelineQueryEngine(
        context.timeline
    );
console.log("\nUpcoming\n");
console.table(
    engine.upcoming()
);
console.log("\nVaccinations\n");
console.table(
    engine.byType(
        "vaccination"
    )
);