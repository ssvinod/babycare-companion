import { findDuplicateEventIds } from "../src/services/duplicateService.js";

const events = [
    { uid: "birth" },
    { uid: "6weeks" },
    { uid: "birth" },
    { uid: "10weeks" },
    { uid: "6weeks" }
];

console.log(findDuplicateEventIds(events));