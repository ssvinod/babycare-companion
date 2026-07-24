import { JsonDatabaseProvider } from "../database/jsonDatabaseProvider.js";
export class ProfileRepository {
    constructor(basePath = "./data") {
        this.db = new JsonDatabaseProvider(basePath);
        this.db.initialize();
    }
    save(profile) {
        this.db.save(
            "profile",
            [profile]
        );
    }
    load() {
        const items =
            this.db.load("profile");
        return items[0] ?? null;
    }
}