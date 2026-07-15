import { loadProfile } from "../src/services/profileService.js";
import { generateVaccinationPlan } from "../src/services/vaccinationService.js";
import { toAppleCalendar } from "../src/platforms/apple/appleCalendarAdapter.js";

const child = loadProfile();

const schedule = generateVaccinationPlan(child);

const calendar = toAppleCalendar(child, schedule);

console.log(JSON.stringify(calendar, null, 4));