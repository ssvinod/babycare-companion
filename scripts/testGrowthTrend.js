import { shortDate } from "../src/utils/dateFormatter.js";
import { loadGrowthHistory } from "../src/services/growthHistoryService.js";
import { analyzeGrowthTrend } from "../src/services/growthTrendService.js";

const history = loadGrowthHistory();

const result = analyzeGrowthTrend(history);

console.table([result]);