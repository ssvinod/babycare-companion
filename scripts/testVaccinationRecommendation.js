import { shortDate } from "../src/utils/dateFormatter.js";
import {
    getVaccinationRecommendations
}
from "../src/services/vaccinationRecommendationService.js";
const recommendations =
getVaccinationRecommendations([
    {
        visit: "6 Weeks",
        completed: false,
        dueDate:
            new Date("2026-01-01")
    },
    {
        visit: "10 Weeks",
        completed: false,
        dueDate:
            new Date(Date.now() + 3 * 86400000)
    }
]);
console.table(recommendations);