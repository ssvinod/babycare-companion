import { JsonDatabaseProvider } from "../database/jsonDatabaseProvider.js";
const db = new JsonDatabaseProvider();
db.initialize();
const COLLECTION = "healthVisits";
export class HealthVisitRepository {
    save(visits) {
        db.save(COLLECTION, visits);
    }
    load() {
        return db.load(COLLECTION);
    }
}