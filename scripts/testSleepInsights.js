import {
    generateSleepInsights
}
from "../src/services/sleepInsightService.js";
console.table(
    generateSleepInsights(
        "baby"
    )
);