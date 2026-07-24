import { shortDate } from "../src/utils/dateFormatter.js";
import { createApplicationContext } from "../src/services/applicationContext.js";

const context = createApplicationContext();

console.log(JSON.stringify(context, null, 4));