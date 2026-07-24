import {
    addDiaper,
    getDiapers
}
from "../src/services/diaperService.js";
import {
    getDiaperSummary
}
from "../src/services/diaperSummaryService.js";
import {
    shortDateTime
}
from "../src/utils/dateFormatter.js";
addDiaper({
    childId:"baby",
    type:"Wet",
    color:"Clear",
    consistency:"",
    rash:false
});
addDiaper({
    childId:"baby",
    type:"Dirty",
    color:"Yellow",
    consistency:"Soft",
    rash:false
});
console.table(
    getDiapers("baby").map(
        d=>({
            Time:
                shortDateTime(d.date),
            Type:
                d.type,
            Color:
                d.color,
            Rash:
                d.rash
        })
    )
);
console.log(
    "\nToday's Summary\n"
);
console.table(
    getDiaperSummary("baby")
);