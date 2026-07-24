import { shortDate } from "../src/utils/dateFormatter.js";
import { generateHealthReport }
from "../src/services/healthReportService.js";
generateHealthReport({
    growthSummary: {
        child: "Viha",
        gender: "Female",
        birthDate: "2026-06-22",
        age: "6 Weeks",
        lastMeasurement: "2026-08-03",
        weight: 4.4,
        length: 55.2,
        headCircumference: 38.0,
        weightPercentile: 38.3,
        weightStatus: "Normal",
        trend: "Increasing",
        alertCount: 0,
        alerts: []
    }
});
console.log("Health Report generated.");