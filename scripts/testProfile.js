import { shortDate } from "../src/utils/dateFormatter.js";
import { loadProfile } from "../src/services/profileService.js";

const child = loadProfile();

console.log(child);