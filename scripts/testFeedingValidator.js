import {
    validateFeeding
}
from "../src/services/feedingValidator.js";
console.log(
    validateFeeding({
        childId: "baby",
        type: "Formula",
        date: "2026-07-24",
        quantity: 120
    })
);
console.log(
    validateFeeding({
        quantity: -20
    })
);