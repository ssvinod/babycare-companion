import { shortDate } from "../src/utils/dateFormatter.js";
import {
    createApplicationContext
}
from "../src/services/applicationContext.js";

console.table(
    createApplicationContext()
        .dashboard
);