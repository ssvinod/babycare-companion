import { shortDate } from "../src/utils/dateFormatter.js";
import { HealthVisit } from "../src/models/HealthVisit.js";
import {
    saveVisit,
    loadVisits,
    getUpcomingFollowUps
} from "../src/services/healthVisitService.js";
const visit = new HealthVisit({
    childId: "baby",
    visitDate: "2026-07-24",
    doctor: "Dr. Vindhya",
    hospital: "Moon Maternity Hospital",
    diagnosis: "Routine Checkup",
    prescription: [
        "Vitamin D"
    ],
    notes: "Healthy",
    followUpDate: "2026-08-24"
});
saveVisit(visit);
console.log("\nVisits\n");
console.table(loadVisits());
console.log("\nUpcoming Follow-ups\n");
console.table(getUpcomingFollowUps());