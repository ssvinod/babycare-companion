import { shortDate } from "../src/utils/dateFormatter.js";
import { Child }
from "../src/models/child.js";
import { GrowthRecord }
from "../src/models/GrowthRecord.js";
import {
    getNextMeasurementDate
}
from "../src/services/measurementScheduleService.js";
const child =
new Child({
    id: "1",
    name: "Viha",
    birthDate: "2026-06-22",
    gender: "Female"
});
const history = [
    new GrowthRecord({
        childId: "1",
        date: "2026-08-03",
        weight: 4.4,
        length: 55,
        headCircumference: 38
    })
];
console.log(
    getNextMeasurementDate(
        child,
        history
    )
);