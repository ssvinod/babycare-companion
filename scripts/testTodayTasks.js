import { shortDate } from "../src/utils/dateFormatter.js";
import { getTodayTasks }
from "../src/services/todayService.js";
const tasks =
getTodayTasks({
    dashboard: {
        vaccinations: {
            next: {
                visit: "10 Weeks",
                dueDate: new Date("2026-01-01")
            }
        }
    },
    nextMeasurementDate:
        new Date("2026-01-01"),
    reminders: [
        {
            title:
                "Vitamin D Drops"
        }
    ]
});
console.table(tasks);