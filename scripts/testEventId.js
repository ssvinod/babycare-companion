import { loadProfile } from "../src/services/profileService.js";
import { generateVaccinationPlan } from "../src/services/vaccinationService.js";
import { createCalendarUID } from "../src/services/eventIdService.js";

const child = loadProfile();
const visits = generateVaccinationPlan(child);

for (const visit of visits) {
    console.log(createCalendarUID(child, visit));
}