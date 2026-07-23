import { createApplicationContext }
from "../src/services/applicationContext.js";
import { aggregateTimeline }
from "../src/services/timelineAggregator.js";
import { exportCalendar }
from "../src/services/calendarExporter.js";
const context =
createApplicationContext();
const events =
aggregateTimeline(context);
exportCalendar(
    context.child,
    events
);
console.log(
    "Unified calendar exported."
);