import { shortDate } from "../src/utils/dateFormatter.js";
import { loadProfile } from "../src/services/profileService.js";
import { loadGrowthHistory } from "../src/services/growthHistoryService.js";
import { analyzeGrowth } from "../src/services/growthAnalysisService.js";
const child = loadProfile();
const history = loadGrowthHistory(child.id);
const analysis = analyzeGrowth(child, history);
console.table(
    analysis.map(item => ({
        Date:
            item.date.toISOString().slice(0,10),
        Weight:
            item.weight,
        WeightPct:
            item.weightPercentile,
        Length:
            item.length,
        LengthPct:
            item.lengthPercentile,
        HC:
            item.headCircumference,
        HCPct:
            item.headCircumferencePercentile
    }))
);