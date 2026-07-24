import { shortDate } from "../src/utils/dateFormatter.js";
import {
    addFeeding,
    getFeedings,
    getDailyNutritionSummary
} from "../src/services/feedingService.js";
addFeeding({
    childId: "baby",
    type: "Breastfeeding",
    duration: "10 min",
    date: new Date(),
    notes: "Left side"
});
addFeeding({
    childId: "baby",
    type: "Formula",
    quantity: 120,
    unit: "ml",
    date: new Date()
});
addFeeding({
    childId: "baby",
    type: "Water",
    quantity: 40,
    unit: "ml",
    date: new Date()
});
console.log("\nAll Feedings\n");
console.table(
    getFeedings("baby").map(feed => ({
        ...feed,
        date: shortDate(feed.date)
    }))
);
console.log("\nToday's Summary\n");
console.dir(
    getDailyNutritionSummary("baby"),
    { depth: null }
);