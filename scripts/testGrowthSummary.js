import { loadProfile } from "../src/services/profileService.js";
import { loadGrowthHistory } from "../src/services/growthHistoryService.js";
import { analyzeGrowth } from "../src/services/growthAnalysisService.js";
import { analyzeGrowthTrend } from "../src/services/growthTrendService.js";
import { generateGrowthAlerts } from "../src/services/growthAlertService.js";
import { createGrowthSummary } from "../src/services/growthSummaryService.js";

const child = loadProfile();
const history = loadGrowthHistory();
const analysis = analyzeGrowth(child, history);
const trend = analyzeGrowthTrend(history);
const alerts = generateGrowthAlerts(analysis, trend);

console.log(
    JSON.stringify(
        createGrowthSummary(
            child,
            analysis,
            trend,
            alerts
        ), null, 4
    )
);