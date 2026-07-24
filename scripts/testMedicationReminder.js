import { shortDate } from "../src/utils/dateFormatter.js";
import {
    addMedication,
    getMedications,
    completeMedication
} from "../src/services/medicationService.js";
import {
    getTodaysMedications
} from "../src/services/medicationReminderService.js";
// --------------------------------------------------
// Create sample medication
// --------------------------------------------------
addMedication({
    childId: "baby",
    name: "Vitamin D",
    dosage: "1 ml",
    frequency: "Once Daily",
    startDate: "2026-07-20",
    endDate: "2026-08-20",
    instructions: ""
});
// --------------------------------------------------
// Fetch from repository
// --------------------------------------------------
let medications = getMedications("baby");
// --------------------------------------------------
// Today's reminders
// --------------------------------------------------
const today = getTodaysMedications(medications);
console.log("Today's");
console.table(
    today.map(m => ({
        ...m,
        startDate: shortDate(m.startDate),
        endDate: shortDate(m.endDate),
        completedDate:
            m.completedDate
                ? shortDate(m.completedDate)
                : null
    }))
);
// --------------------------------------------------
// Mark first reminder completed
// --------------------------------------------------
if (today.length) {
    completeMedication(
        today[0].id,
        "baby"
    );
}
// --------------------------------------------------
// Reload from repository
// --------------------------------------------------
medications = getMedications("baby");
console.log("\nCompleted");
console.table(
    medications.map(m => ({
        ...m,
        startDate: shortDate(m.startDate),
        endDate: shortDate(m.endDate),
        completedDate:
            m.completedDate
                ? shortDate(m.completedDate)
                : null
    }))
);