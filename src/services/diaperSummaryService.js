import { getTodaysDiapers } from "./diaperService.js";
export function getDiaperSummary(childId) {
    const diapers =
        getTodaysDiapers(childId);
    return {
        total:
            diapers.length,
        wet:
            diapers.filter(
                d => d.type === "Wet"
            ).length,
        dirty:
            diapers.filter(
                d => d.type === "Dirty"
            ).length,
        mixed:
            diapers.filter(
                d => d.type === "Mixed"
            ).length,
        rashObserved:
            diapers.some(
                d => d.rash
            )
    };
}