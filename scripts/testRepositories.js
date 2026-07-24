import { shortDate } from "../src/utils/dateFormatter.js";
import fs from "fs";
import { ProfileRepository } from "../src/repositories/profileRepository.js";
import { HistoryRepository } from "../src/repositories/historyRepository.js";
const TEST_DB = "./output/test-db";
fs.mkdirSync(TEST_DB, {
    recursive: true
});
const profileRepo =
    new ProfileRepository(TEST_DB);
profileRepo.save({
    id: "baby",
    name: "Viha"
});
console.log(
    profileRepo.load()
);
const historyRepo =
    new HistoryRepository(TEST_DB);
historyRepo.save([
    {
        id: 1,
        event: "Birth"
    }
]);
console.table(
    historyRepo.load()
);
// cleanup
fs.rmSync(TEST_DB, {
    recursive: true,
    force: true
});