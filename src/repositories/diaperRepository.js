import { BaseRepository } from "./baseRepository.js";
import { DiaperRecord } from "../models/diaperRecord.js";
export class DiaperRepository extends BaseRepository {
    constructor() {
        super(
            "diaper",
            DiaperRecord
        );
    }
    findByChild(childId) {
        return this.findAll()
            .filter(
                record => record.childId === childId
            );
    }
}