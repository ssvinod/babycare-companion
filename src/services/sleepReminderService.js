import { getLatestSleep } from "./sleepService.js";
const WAKE_WINDOWS = [
    { maxMonths: 1, minutes: 60 },
    { maxMonths: 3, minutes: 90 },
    { maxMonths: 6, minutes: 120 },
    { maxMonths: 12, minutes: 180 },
    { maxMonths: 24, minutes: 300 },
    { maxMonths: 60, minutes: 360 }
];
function wakeWindow(ageMonths) {
    return (
        WAKE_WINDOWS.find(
            w => ageMonths <= w.maxMonths
        ) ??
        WAKE_WINDOWS.at(-1)
    ).minutes;
}
export function nextSleepTime(child, lastSleep) {
    if (!lastSleep)
        return null;
    const end =
        new Date(lastSleep.endTime);
    const wake =
        wakeWindow(child.ageMonths ?? 6);
    return new Date(
        end.getTime() +
        wake * 60000
    );
}
export function shouldSleepNow(child) {
    const last =
        getLatestSleep(child.id);
    if (!last)
        return true;
    return (
        new Date() >=
        nextSleepTime(child, last)
    );
}