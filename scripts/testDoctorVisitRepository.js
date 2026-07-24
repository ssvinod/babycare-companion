import { shortDate } from "../src/utils/dateFormatter.js";
import { DoctorVisitRepository } from "../src/repositories/doctorVisitRepository.js";
import { DoctorVisit } from "../src/models/doctorVisit.js";
const repo = new DoctorVisitRepository();
const visit = new DoctorVisit({
    childId: "baby",
    visitDate: "2026-07-24",
    doctorName: "Dr. Mehta",
    hospital: "City Hospital",
    purpose: "Routine Checkup",
    diagnosis: "Healthy",
    prescription: [
        "Vitamin D"
    ],
    notes: "Next visit after 3 months.",
    nextVisitDate: "2026-10-24"
});
repo.save(visit);
console.log(
    repo.findById(visit.id)
);
console.table(
    repo.findByChild("baby")
);