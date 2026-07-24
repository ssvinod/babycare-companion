import { SleepRepository } from "../repositories/sleepRepository.js";
import { SleepRecord } from "../models/sleepRecord.js";
const repo = new SleepRepository();
export function addSleep(data) {
    const record =
        data instanceof SleepRecord
            ? data
            : new SleepRecord(data);
    return repo.save(record);
}
export function getSleepRecords(childId) {
    return repo.findByChild(childId);
}
export function getLatestSleep(childId) {
    return getSleepRecords(childId)
        .sort(
            (a, b) =>
                new Date(b.endTime) -
                new Date(a.endTime)
        )[0] ?? null;
}
export function getTotalSleepToday(childId) {
    const today =
        new Date()
            .toISOString()
            .slice(0, 10);
    return getSleepRecords(childId)
        .filter(
            sleep =>
                new Date(sleep.startTime)
                    .toISOString()
                    .startsWith(today)
        )
        .reduce(
            (sum, sleep) =>
                sum + sleep.durationMinutes,
            0
        );
}