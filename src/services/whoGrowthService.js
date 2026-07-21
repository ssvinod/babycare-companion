import { WHO_WEIGHT_GIRLS } from "../config/whoWeightGirls0to24.js";

export function getWeightPercentile(child, growthRecord) {

    if (child.gender !== "Female")
        return null;

    const ageDays = child.getAgeOnDate(growthRecord.date);

    const match = WHO_WEIGHT_GIRLS.find(
        item => item.ageDays === ageDays
    );

    if (!match)
        return null;

    const weight = growthRecord.weight;

    if (weight <= match.p3)
        return "<3rd";

    if (weight <= match.p15)
        return "3rd-15th";

    if (weight <= match.p50)
        return "15th-50th";

    if (weight <= match.p85)
        return "50th-85th";

    if (weight <= match.p97)
        return "85th-97th";

    return ">97th";

}