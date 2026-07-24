import { shortDate } from "../src/utils/dateFormatter.js";
import { generateReleaseNotes } from "../src/services/releaseNotesService.js";

console.log(
    generateReleaseNotes()
);