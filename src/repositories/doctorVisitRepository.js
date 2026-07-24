import { JsonDatabaseProvider } from "../database/jsonDatabaseProvider.js";
import { DoctorVisit } from "../models/doctorVisit.js";
const db = new JsonDatabaseProvider();
db.initialize();
const COLLECTION = "doctorVisits";
export class DoctorVisitRepository {
    save(visit) {
        const visits = this.load();
        const index = visits.findIndex(
            v => v.id === visit.id
        );
        if (index >= 0) {
            visits[index] = visit;
        }
        else {
            visits.push(visit);
        }
        db.save(COLLECTION, visits);
        return visit;
    }
    load() {
        return db
            .load(COLLECTION)
            .map(
                item => new DoctorVisit(item)
            );
    }
    findById(id) {
        return this
            .load()
            .find(
                visit => visit.id === id
            ) ?? null;
    }
    findByChild(childId) {
        return this
            .load()
            .filter(
                visit => visit.childId === childId
            );
    }
    remove(id) {
        db.remove(
            COLLECTION,
            id
        );
    }
}