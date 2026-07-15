import { loadProfile } from "../src/services/profileService.js";
import { generateVaccinationPlan } from "../src/services/vaccinationService.js";
import { toAppleReminders } from "../src/platforms/apple/appleReminderAdapter.js";

const child = loadProfile();
const vaccinations = generateVaccinationPlan(child);

console.log(
    JSON.stringify(
        toAppleReminders(child, vaccinations),
        null,
        4
    )
);