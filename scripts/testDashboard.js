import { createApplicationContext } from "../src/services/applicationContext.js";
import { generateDashboard } from "../src/services/dashboardService.js";

const context = createApplicationContext();

console.log(
    JSON.stringify(
        generateDashboard(context),
        null,
        4
    )
);