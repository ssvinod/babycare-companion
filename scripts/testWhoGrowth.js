import { shortDate } from "../src/utils/dateFormatter.js";
import { loadProfile } from "../src/services/profileService.js";
import { GrowthRecord } from "../src/models/GrowthRecord.js";
import { calculateGrowth } from "../src/services/whoGrowthService.js";

const child = loadProfile();

const record = new GrowthRecord({
    childId: child.id,
    date: "2026-06-22",
    weight: 3.2,
    length: 49,
    headCircumference: 34
});

console.table({

    Weight:
        calculateGrowth(
            "weightForAge",
            child,
            record,
            record.weight
        ),

    Length:
        calculateGrowth(
            "lengthForAge",
            child,
            record,
            record.length
        ),

    HeadCircumference:
        calculateGrowth(
            "headCircumference",
            child,
            record,
            record.headCircumference
        )

});