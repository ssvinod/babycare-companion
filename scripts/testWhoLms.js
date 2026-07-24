import { shortDate } from "../src/utils/dateFormatter.js";
import {
    calculateZScore,
    calculatePercentile
}
from "../src/engines/whoLmsEngine.js";

const z =
    calculateZScore(
        3.1,
        0.3809,
        3.2322,
        0.14171
    );

console.log(
    "Z Score:",
    z.toFixed(2)
);

console.log(
    "Percentile:",
    calculatePercentile(z).toFixed(1)
);