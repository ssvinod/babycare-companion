import { loadProfile } from "../src/services/profileService.js";
import { generateVaccinationPlan } from "../src/services/vaccinationService.js";
import { createScriptableSchedule } from "../src/platforms/scriptable/scriptableAdapter.js";

const child = loadProfile();
const visits = generateVaccinationPlan(child);

const schedule = createScriptableSchedule(child, visits);

console.log(JSON.stringify(schedule, null, 4));