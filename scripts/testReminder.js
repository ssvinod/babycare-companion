import { shortDate } from "../src/utils/dateFormatter.js";
import { createApplicationContext }
from "../src/services/applicationContext.js";

const context =
    createApplicationContext();

console.table(
    context.reminders.slice(0,5)
);