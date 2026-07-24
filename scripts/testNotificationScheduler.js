import {
    generateNotifications
}
from "../src/services/notificationSchedulerService.js";
console.table(
    generateNotifications({
        vaccinations: [
            {
                id: "v1",
                visit: "10 Weeks",
                dueDate: "2026-09-01",
                completed: false
            }
        ],
        medications: [
            {
                id: "m1",
                name: "Vitamin D",
                startDate: "2026-07-25",
                completed: false
            }
        ],
        appointments: [
            {
                id: "a1",
                age: "6 Months",
                dueDate: "2026-12-22"
            }
        ]
    })
);