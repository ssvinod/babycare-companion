import { createApplicationContext } from "../src/services/applicationContext.js";

const context = createApplicationContext();

console.table(context.notifications);