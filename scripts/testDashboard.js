import { generateDashboard }
from "../src/services/dashboardService.js";
const dashboard =
generateDashboard({
    profile: {
        name: "Viha"
    },
    growthSummary: {
        weight: 4.4,
        weightPercentile: 38.3,
        weightStatus: "Normal"
    },
    vaccinations: [
        {
            completed: true
        },
        {
            completed: false,
            visit: "10 Weeks"
        }
    ],
    appointments: [],
    reminders: [],
    milestones: [],
    alerts: [],
    timeline: []
});
console.table({
    Child:
        dashboard.profile.name,
    Weight:
        dashboard.growth.weight,
    Percentile:
        dashboard.growth.weightPercentile,
    NextVaccine:
        dashboard.vaccinations.next.visit,
    PendingVaccines:
        dashboard.vaccinations.pending
});