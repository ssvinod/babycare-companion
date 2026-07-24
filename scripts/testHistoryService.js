import { buildHistory }
from "../src/services/historyService.js";
import {
    shortDateTime
}
from "../src/utils/dateFormatter.js";
const history =
    buildHistory({
        vaccinations: [
            {
                id: "v1",
                visit: "Birth",
                dueDate: "2026-06-22",
                completed: false
            }
        ],
        medications: [
            {
                id: "m1",
                name: "Vitamin D",
                startDate: "2026-07-24"
            }
        ],
        feedings: [
            {
                id: "f1",
                type: "Formula",
                quantity: 120,
                unit: "ml",
                date: "2026-07-24T09:00:00"
            }
        ],
        sleep: [
            {
                id: "s1",
                type: "Nap",
                startTime: "2026-07-24T13:00:00"
            }
        ]
    });
console.table(
    history.map(
        h => ({
            Type: h.type,
            Date: shortDateTime(h.date),
            Title: h.title,
            Subtitle: h.subtitle
        })
    )
);