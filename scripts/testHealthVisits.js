import { loadProfile } from "../src/services/profileService.js";
import { generateHealthVisitPlan } from "../src/services/healthVisitService.js";

const child = loadProfile();

const visits = generateHealthVisitPlan(child);

console.log(

    JSON.stringify(
        visits,
        null,
        4
    )

);