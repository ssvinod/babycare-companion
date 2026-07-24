import { JsonDatabaseProvider } from "../database/jsonDatabaseProvider.js";
export class HistoryRepository {
    constructor(basePath = "./data") {
        this.db = new JsonDatabaseProvider(basePath);
        this.db.initialize();
    }
    save(history) {
        this.db.save(
            "history",
            history
        );
    }
    load() {
        return this.db.load("history");
    }
}