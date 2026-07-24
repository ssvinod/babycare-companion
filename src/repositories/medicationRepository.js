import { BaseRepository } from "./baseRepository.js";
import { Medication } from "../models/medication.js";
export class MedicationRepository extends BaseRepository {
    constructor() {
        super(
            "medication",
            Medication
        );
    }
    findByChild(childId) {
        return this.findAll()
            .filter(
                medication => medication.childId === childId
            );
    }
}