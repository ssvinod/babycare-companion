import { shortDate } from "../src/utils/dateFormatter.js";
import { createApplicationContext }
from "../src/services/applicationContext.js";

import { generateRecommendations }
from "../src/services/recommendationService.js";

const context =
    createApplicationContext();

console.table(
    generateRecommendations(context)
);