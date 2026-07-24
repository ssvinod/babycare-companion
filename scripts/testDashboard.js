import { generateDashboard } from "../src/services/dashboardService.js";
const dashboard = generateDashboard({
    profile: {
        id: "baby",
        name: "Viha",
        birthDate: "2026-06-22",
        gender: "female"
    },
    growthSummary: {
        weight: 4.4,
        weightPercentile: 38.3,
        weightStatus: "Normal"
    },
    vaccinations: [
        {
            completed: true,
            visit: "Birth",
            dueDate: "2026-06-22"
        },
        {
            completed: false,
            visit: "10 Weeks",
            dueDate: "2026-08-31"
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
    BirthDate:
        dashboard.profile.birthDate,
    Weight:
        dashboard.growth.weight,
    Percentile:
        dashboard.growth.weightPercentile,
    NextVaccine:
        dashboard.vaccinations.next.visit,
    VaccineDue:
        dashboard.vaccinations.next.dueDate,
    PendingVaccines:
        dashboard.vaccinations.pending
});