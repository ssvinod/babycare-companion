import { loadGrowthHistory } from "../src/services/growthHistoryService.js";

console.log(
    JSON.stringify(loadGrowthHistory(), null, 4)
);