import fs from "fs";

import { Child } from "../src/models/child.js";
import { generateVaccinationPlan } from "../src/services/vaccinationService.js";
import { generateICS } from "../src/services/icsGenerator.js";

const child = new Child({

    name: "Viha",

    birthDate: "2026-06-22"
});

const vaccinations = generateVaccinationPlan(child);
const ics = generateICS(child, vaccinations);

fs.mkdirSync("./output", { recursive: true });

fs.writeFileSync("./output/vaccination_schedule.ics", ics);

console.log("Calendar exported.");

console.log("./output/vaccination_schedule.ics");