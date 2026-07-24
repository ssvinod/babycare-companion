import {
    getSleepRecords
} from "./sleepService.js";
export function generateSleepInsights(childId) {
    const sleeps =
        getSleepRecords(childId);
    if (sleeps.length === 0) {
        return {
            totalMinutes: 0,
            averageNap: 0,
            longestNap: 0
        };
    }
    const durations =
        sleeps.map(
            s => s.durationMinutes
        );
    const total =
        durations.reduce(
            (a, b) => a + b,
            0
        );
    return {
        totalMinutes:
            total,
        averageNap:
            Math.round(
                total /
                durations.length
            ),
        longestNap:
            Math.max(...durations)
    };
}