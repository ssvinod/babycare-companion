import { shortDate } from "../src/utils/dateFormatter.js";
import { loadProfile } from "../src/services/profileService.js";
import { generateVaccinationPlan } from "../src/services/vaccinationService.js";
import {
    updateVaccinationStatus,
    getNextVaccination
} from "../src/services/vaccinationTrackingService.js";
const child = loadProfile();
console.log(child);
const plan = generateVaccinationPlan(child);
console.log(plan[0]);
console.log(plan[0].dueDate);
console.log(plan[0].dueDate instanceof Date);
console.log(Number.isNaN(plan[0].dueDate.getTime()));
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
        Due: shortDate(v.dueDate)
    }))
);
const next = getNextVaccination(plan);
console.log("\nNext Vaccination\n");
console.log({
    ...next,
    dueDate: shortDate(next.dueDate)
});