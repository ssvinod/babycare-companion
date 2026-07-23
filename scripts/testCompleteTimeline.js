import {
    aggregateTimeline
}
from "../src/services/timelineAggregator.js";
const timeline =
aggregateTimeline({
    vaccinations: [
        {
            visit: "Birth",
            dueDate: "2026-06-22",
            vaccines: ["BCG"]
        }
    ],
    milestones: [
        {
            age: "2 Months",
            dueDate: "2026-08-22",
            milestones: ["Smile"]
        }
    ],
    growth: [
        {
            date: "2026-07-22",
            weight: 4.2
        }
    ],
    appointments: [
        {
            title: "Pediatrician",
            date: "2026-07-01"
        }
    ]
});
console.table(
    timeline.map(x=>({
        Date:x.date,
        Type:x.type,
        Title:x.title
    }))
);