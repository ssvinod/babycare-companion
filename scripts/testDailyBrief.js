import { createApplicationContext } from "../src/services/applicationContext.js";

const context = createApplicationContext();

console.log("\n========== DAILY BRIEF ==========\n");

console.log(
    JSON.stringify(
        context.dailyBrief,
        null,
        4
    )
);