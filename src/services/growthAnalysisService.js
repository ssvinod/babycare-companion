import { getWeightPercentile } from "./whoGrowthService.js";
import { getWeightStatus } from "./growthStatusService.js";

export function analyzeGrowth(child, history) {
    return history.map(record => {
        const percentile = getWeightPercentile(
            child,
            record
        );
        return {
            childId: record.childId,
            date: record.date,
            weight: record.weight,
            length: record.length,
            headCircumference: record.headCircumference,
            notes: record.notes,
            weightPercentile: percentile,
            weightStatus: getWeightStatus(percentile)
        };
    });
}