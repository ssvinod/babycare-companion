import { getWeightResult } from "./whoGrowthService.js";
import { getWeightStatus } from "./growthStatusService.js";

export function analyzeGrowth(child, history) {
    return history.map(record => {
        const weightResult =
            getWeightResult(
                child,
                record
            );

        return {
            childId: record.childId,
            date: record.date,
            weight: record.weight,
            length: record.length,
            headCircumference:
                record.headCircumference,
            notes: record.notes,
            weightZScore:
                weightResult?.zScore ?? null,
            weightPercentile:
                weightResult?.percentile ?? null,
            weightCategory:
                weightResult?.category ?? null,
            weightStatus:
                weightResult
                    ? getWeightStatus(
                        weightResult.category
                    )
                    : null
        };
    });
}