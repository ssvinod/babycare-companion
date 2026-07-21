import { loadProfile } from "../src/services/profileService.js";
import { loadGrowthHistory } from "../src/services/growthHistoryService.js";
import { analyzeGrowth } from "../src/services/growthAnalysisService.js";
import { analyzeGrowthTrend } from "../src/services/growthTrendService.js";
import { generateGrowthAlerts } from "../src/services/growthAlertService.js";

const child = loadProfile();
const history = loadGrowthHistory();
const analysis = analyzeGrowth(
    child,
    history
);

const trend = analyzeGrowthTrend(history);
const alerts = generateGrowthAlerts(
    analysis,
    trend
);

if (alerts.length === 0) {
    console.log("✅ No growth alerts.");
} else {
    console.table(alerts);
}