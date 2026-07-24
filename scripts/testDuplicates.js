import { shortDate } from "../src/utils/dateFormatter.js";
import { findDuplicateEventIds } from "../src/services/duplicateService.js";

const events = [
    { uid: "birth" },
    { uid: "6weeks" },
    { uid: "birth" },
    { uid: "10weeks" },
    { uid: "6weeks" }
];

console.log(findDuplicateEventIds(events));