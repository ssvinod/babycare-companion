import fs from "fs";
import { generateICS }
from "./icsGenerator.js";
export function exportCalendar(
    child,
    events,
    outputFile = "./output/babycare-calendar.ics"
) {
    const ics = generateICS(
        child,
        events
    );
    fs.writeFileSync(
        outputFile,
        ics
    );
    return outputFile;
}