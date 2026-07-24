import { BaseRepository } from "./baseRepository.js";
import { SleepRecord } from "../models/sleepRecord.js";
export class SleepRepository extends BaseRepository {
    constructor() {
        super(
            "sleep",
            SleepRecord
        );
    }
    findByChild(childId) {
        return this.findAll()
            .filter(
                sleep => sleep.childId === childId
            );
    }
}