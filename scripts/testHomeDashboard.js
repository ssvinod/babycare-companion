import { shortDate } from "../src/utils/dateFormatter.js";
import { buildHomeDashboard }
from "../src/services/homeDashboardService.js";
const dashboard =
buildHomeDashboard({
    profile: {
        name: "Viha"
    },
    dashboard: {
        vaccinations: {
            next: {
                visit: "10 Weeks",
                dueDate:
                    new Date()
            }
        }
    },
    nextMeasurementDate:
        new Date(),
    reminders: [
        {
            title:
                "Vitamin D"
        }
    ],
    vaccinations: [
        {
            visit: "10 Weeks",
            completed: false,
            dueDate:
                new Date()
        }
    ],
    growthSummary: {
        weight: 4.4,
        weightStatus:
            "Normal"
    },
    alerts: [],
    timeline: []
});
console.dir(
    dashboard,
    { depth:null }
);