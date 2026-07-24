import { shortDate } from "../src/utils/dateFormatter.js";
import {
    addMedication,
    getMedications,
    getActiveMedications
} from "../src/services/medicationService.js";
addMedication({
    childId: "baby",
    name: "Vitamin D",
    dosage: "1 ml",
    frequency: "Once Daily",
    startDate: "2026-07-24",
    endDate: "2026-08-24",
    instructions: "After feeding"
});
console.table(
    getMedications("baby").map(m => ({
        ...m,
        startDate: shortDate(m.startDate),
        endDate: shortDate(m.endDate),
        completedDate: m.completedDate
            ? shortDate(m.completedDate)
            : null
    }))
);
console.log("\nActive Medications\n");
console.table(
    getActiveMedications("baby").map(m => ({
        ...m,
        startDate: shortDate(m.startDate),
        endDate: shortDate(m.endDate),
        completedDate: m.completedDate
            ? shortDate(m.completedDate)
            : null
    }))
);