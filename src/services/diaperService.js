import { DiaperRepository } from "../repositories/diaperRepository.js";
import { DiaperRecord } from "../models/diaperRecord.js";
const repo = new DiaperRepository();
export function addDiaper(data) {
    const record =
        data instanceof DiaperRecord
            ? data
            : new DiaperRecord(data);
    return repo.save(record);
}
export function getDiapers(childId) {
    return repo.findByChild(childId);
}
export function getTodaysDiapers(childId) {
    const today =
        new Date()
            .toISOString()
            .slice(0,10);
    return getDiapers(childId)
        .filter(
            d =>
                d.date
                    .toISOString()
                    .startsWith(today)
        );
}