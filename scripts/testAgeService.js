import {
    getAgeInDays,
    getAgeInWeeks,
    getAgeInMonths,
    getAgeDisplay
} from "../src/services/ageService.js";

const birth = new Date("2026-06-22");
const today = new Date("2026-08-03");

console.table({

    days: getAgeInDays(birth, today),

    weeks: getAgeInWeeks(birth, today),

    months: getAgeInMonths(birth, today),

    display: getAgeDisplay(birth, today)

});