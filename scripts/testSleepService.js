import { shortDateTime } from "../src/utils/dateFormatter.js";
import {
    addSleep,
    getSleepRecords,
    getLatestSleep,
    getTotalSleepToday
}
from "../src/services/sleepService.js";
addSleep({
    childId: "baby",
    startTime: "2026-07-24T13:00:00",
    endTime: "2026-07-24T14:30:00",
    type: "Nap",
    quality: "Good",
    notes: ""
});
console.table(
    getSleepRecords("baby").map(
        sleep => ({
            Type:
                sleep.type,
            Start:
                shortDateTime(sleep.startTime),
            End:
                shortDateTime(sleep.endTime),
            Minutes:
                sleep.durationMinutes
        })
    )
);
console.log(
    "\nLatest Sleep\n"
);
console.dir(
    getLatestSleep("baby"),
    { depth: null }
);
console.log(
    "\nToday's Sleep (minutes)\n"
);
console.log(
    getTotalSleepToday("baby")
);