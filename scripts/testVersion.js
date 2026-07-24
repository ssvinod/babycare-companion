import { shortDate } from "../src/utils/dateFormatter.js";
import { getProjectInfo } from "../src/services/versionService.js";

console.table(getProjectInfo());