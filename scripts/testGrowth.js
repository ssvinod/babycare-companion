import { shortDate } from "../src/utils/dateFormatter.js";
import { loadProfile } from "../src/services/profileService.js";
import { generateGrowthPlan } from "../src/services/growthService.js";

const child = loadProfile();

console.log(
    JSON.stringify(
        generateGrowthPlan(child),
        null,
        4
    )
);