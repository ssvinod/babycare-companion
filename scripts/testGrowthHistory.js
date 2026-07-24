import { shortDate } from "../src/utils/dateFormatter.js";
import { loadGrowthHistory } from "../src/services/growthHistoryService.js";

console.log(
    JSON.stringify(loadGrowthHistory(), null, 4)
);