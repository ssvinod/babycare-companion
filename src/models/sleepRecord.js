import { randomUUID } from "crypto";
export class SleepRecord {
    constructor({
        id = randomUUID(),
        childId,
        startTime,
        endTime,
        type = "Nap",
        quality = "",
        notes = ""
    }) {
        this.id = id;
        this.childId = childId;
        this.startTime = new Date(startTime);
        this.endTime = new Date(endTime);
        this.type = type;
        this.quality = quality;
        this.notes = notes;
    }
    get durationMinutes() {
        return Math.round(
            (
                this.endTime -
                this.startTime
            ) / 60000
        );
    }
}