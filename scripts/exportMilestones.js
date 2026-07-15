import fs from "fs";

import { Child } from "../src/models/child.js";
import { generateMilestonePlan } from "../src/services/milestoneService.js";
import { exportMilestoneCalendar } from "../src/services/milestoneCalendarExporter.js";

const child = new Child({
    name: "Viha",
    birthDate: "2026-06-22"
});

const milestones = generateMilestonePlan(child);

const ics = exportMilestoneCalendar(child, milestones);

fs.mkdirSync("./output", { recursive: true });

fs.writeFileSync(
    "./output/milestones.ics",
    ics
);

console.log("Milestone calendar exported.");
console.log("./output/milestones.ics");