import { BaseRepository } from "./baseRepository.js";
import { FeedingRecord } from "../models/feedingRecord.js";
export class FeedingRepository extends BaseRepository {
    constructor() {
        super(
            "feeding",
            FeedingRecord
        );
    }
    findByChild(childId) {
        return this.findAll()
            .filter(
                record => record.childId === childId
            );
    }
}