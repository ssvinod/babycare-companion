import { shortDate } from "../src/utils/dateFormatter.js";
import { createApplicationContext }
from "../src/services/applicationContext.js";

console.table(
    createApplicationContext()
        .reminders
        .slice(0,5)
);