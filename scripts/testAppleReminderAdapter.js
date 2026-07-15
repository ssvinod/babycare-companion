import { loadProfile } from "../src/services/profileService.js";
import { generateVaccinationPlan } from "../src/services/vaccinationService.js";
import { toAppleReminders } from "../src/platforms/apple/appleReminderAdapter.js";

const child = loadProfile();

const vaccinations = generateVaccinationPlan(child);

const reminders = toAppleReminders(child, vaccinations);

console.log(JSON.stringify(reminders, null, 4));