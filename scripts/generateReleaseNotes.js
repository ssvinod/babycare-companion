import { shortDate } from "../src/utils/dateFormatter.js";
import fs from "fs";
import { generateReleaseNotes } from "../src/services/releaseNotesService.js";

fs.writeFileSync(
    "./output/release-notes.md",
    generateReleaseNotes()
);

console.log("Release notes generated.");