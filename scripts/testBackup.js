import { shortDate } from "../src/utils/dateFormatter.js";
import {
    exportBackup,
    importBackup
} from "../src/services/backupService.js";
const backup = {
    profile: {
        name: "Viha"
    },
    vaccinations: [
        {
            visit: "Birth"
        }
    ]
};
exportBackup(
    backup,
    "./output/backup.json"
);
const restored =
    importBackup(
        "./output/backup.json"
    );
console.log(
    restored.profile.name
);