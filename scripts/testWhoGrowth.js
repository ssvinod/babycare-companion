import { loadProfile } from "../src/services/profileService.js";
import { GrowthRecord } from "../src/models/GrowthRecord.js";
import { getWeightPercentile } from "../src/services/whoGrowthService.js";

const child = loadProfile();

const record = new GrowthRecord({
    childId: child.id,
    date: "2026-06-22",
    weight: 3.2,
    length: 49,
    headCircumference: 34
});

console.log(
    getWeightPercentile(
        child,
        record
    )
);