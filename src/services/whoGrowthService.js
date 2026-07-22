import { WHO_DATASETS } from "../config/whoDatasets.js";
import { WhoDatasetEngine } from "../engines/WhoDatasetEngine.js";
import {
    calculateZScore,
    calculatePercentile
} from "../engines/whoLmsEngine.js";
const cache = {};
function dataset(indicator, gender) {
    const key = `${indicator}-${gender}`;
    if (!cache[key]) {
        cache[key] = new WhoDatasetEngine(
            WHO_DATASETS[indicator][gender]
        );
    }
    return cache[key];
}
export function calculateGrowth(
    indicator,
    child,
    growthRecord,
    measurement
) {
    const engine = dataset(
        indicator,
        child.gender
    );
    const row = engine.findByDay(
        child.getAgeOnDate(
            growthRecord.date
        )
    );
    if (!row)
        return null;
    const z = calculateZScore(
        measurement,
        row.L,
        row.M,
        row.S
    );
    const percentile =
        Number(
            calculatePercentile(z).toFixed(1)
        );
    return {
        zScore:
            Number(z.toFixed(2)),
        percentile,
        category:
            classifyPercentile(percentile)
    };
}
export function getWeightResult(
    child,
    growthRecord
) {
    return calculateGrowth(
        "weightForAge",
        child,
        growthRecord,
        growthRecord.weight
    );
}
export function getLengthResult(
    child,
    growthRecord
) {
    return calculateGrowth(
        "lengthForAge",
        child,
        growthRecord,
        growthRecord.length
    );
}
export function getHeadCircumferenceResult(
    child,
    growthRecord
) {
    return calculateGrowth(
        "headCircumference",
        child,
        growthRecord,
        growthRecord.headCircumference
    );
}
function classifyPercentile(percentile) {
    if (percentile < 3)
        return "<3rd";
    if (percentile < 15)
        return "3rd-15th";
    if (percentile < 50)
        return "15th-50th";
    if (percentile < 85)
        return "50th-85th";
    if (percentile < 97)
        return "85th-97th";
    return ">97th";
}