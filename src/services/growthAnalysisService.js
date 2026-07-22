import { getWeightResult, getLengthResult, getHeadCircumferenceResult } from "./whoGrowthService.js";
import { getWeightStatus } from "./growthStatusService.js";

export function analyzeGrowth(child, history) {
    return history.map(record => {
        const weightResult =
            getWeightResult(
                child,
                record
            );
        const lengthResult =
            getLengthResult(
                child,
                record
            );
        const headResult =
            getHeadCircumferenceResult(
                child,
                record
            );

        return {
            childId: record.childId,
            date: record.date,
            weight: record.weight,
            weightZScore:
                weightResult?.zScore ?? null,
            weightPercentile:
                weightResult?.percentile ?? null,
            weightCategory:
                weightResult?.category ?? null,
            weightStatus:
                weightResult
                    ? getWeightStatus(weightResult.category)
                    : null,
            length:
                record.length,
            lengthZScore:
                lengthResult?.zScore ?? null,
            lengthPercentile:
                lengthResult?.percentile ?? null,
            lengthCategory:
                lengthResult?.category ?? null,
            lengthStatus:
                lengthResult
                    ? getWeightStatus(lengthResult.category)
                    : null,
            headCircumference:
                record.headCircumference,
            headCircumferenceZScore:
                headResult?.zScore ?? null,
            headCircumferencePercentile:
                headResult?.percentile ?? null,
            headCircumferenceCategory:
                headResult?.category ?? null,
            headCircumferenceStatus:
                headResult
                    ? getWeightStatus(headResult.category)
                    : null,
            notes:
                record.notes
        }
    });
}