import { shortDate } from "../src/utils/dateFormatter.js";
import {
    addDoctorVisit,
    getDoctorVisits,
    getLatestDoctorVisit,
    getUpcomingDoctorVisit
}
from "../src/services/doctorVisitService.js";

addDoctorVisit({
    childId: "baby",
    visitDate: "2026-07-24",
    doctorName: "Dr. Rao",
    hospital: "Apollo",
    purpose: "Routine Checkup",
    diagnosis: "Healthy",
    prescription: [
        "Vitamin D"
    ],
    notes: "Everything normal.",
    nextVisitDate: "2026-10-24"
});
console.table(
    getDoctorVisits("baby")
);
console.log(
    "\nLatest Visit\n",
    getLatestDoctorVisit("baby")
);
console.log(
    "\nUpcoming Visit\n",
    getUpcomingDoctorVisit("baby")
);