import { generateParentInsights }
from "../src/services/parentInsightsService.js";
const insights =
generateParentInsights({
    feedings: [
        {
            type: "Formula",
            quantity: 120
        },
        {
            type: "Breastfeeding"
        }
    ],
    sleep: [
        {
            durationMinutes: 90
        },
        {
            durationMinutes: 360
        }
    ],
    medications: [
        {
            completed: false
        }
    ],
    vaccinations: [
        {
            completed: true
        },
        {
            completed: false
        }
    ],
    growth: [
        {
            weight: 4.6,
            percentile: 42,
            status: "Normal"
        }
    ]
});
console.dir(
    insights,
    {
        depth: null
    }
);