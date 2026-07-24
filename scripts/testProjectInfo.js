import { shortDate } from "../src/utils/dateFormatter.js";
import { getProjectInfo } from "../src/services/projectInfoService.js";

console.table(
    getProjectInfo()
);