import { shortDate } from "../src/utils/dateFormatter.js";
import { createApplicationContext }
from "../src/services/applicationContext.js";

const score =
    createApplicationContext().healthScore;

console.table(score);

console.table(score.metrics);