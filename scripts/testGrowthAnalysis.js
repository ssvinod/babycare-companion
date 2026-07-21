import { loadProfile } from "../src/services/profileService.js";
import { loadGrowthHistory } from "../src/services/growthHistoryService.js";
import { analyzeGrowth } from "../src/services/growthAnalysisService.js";

const child = loadProfile();
const history = loadGrowthHistory();
const analysis = analyzeGrowth(child, history);

console.table(
    analysis.map(item => ({
        Date: item.date.toISOString().substring(0, 10),
        Weight: item.weight,
        Percentile: item.weightPercentile,
        Status: item.weightStatus
    }))
);