import { loadProfile } from "../src/services/profileService.js";
import { generateVaccinationPlan } from "../src/services/vaccinationService.js";
import {
    updateVaccinationStatus,
    getNextVaccination
} from "../src/services/vaccinationTrackingService.js";
const child = loadProfile();
const plan = generateVaccinationPlan(child);
updateVaccinationStatus(plan, [
    {
        id: "birth",
        completedDate: "2026-06-22"
    }
]);
console.table(
    plan.map(v => ({
        Visit: v.title,
        Status: v.status,
        Due: v.dueDate.toISOString().slice(0,10)
    }))
);
const next = getNextVaccination(plan);
console.log("\nNext Vaccination\n");
console.log(next);