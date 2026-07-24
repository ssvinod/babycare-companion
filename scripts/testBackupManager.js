import { shortDate } from "../src/utils/dateFormatter.js";
import {
    createAutomaticBackup,
    listBackups
}
from "../src/services/backupManagerService.js";
createAutomaticBackup({
    profile: {
        name: "Viha"
    }
});
console.table(
    listBackups()
);