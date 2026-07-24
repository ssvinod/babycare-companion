import { randomUUID } from "crypto";
export class FeedingRecord {
    constructor({
        id = randomUUID(),
        childId,
        date = new Date(),
        type,
        quantity = "",
        unit = "",
        duration = "",
        notes = ""
    }) {
        this.id = id;
        this.childId = childId;
        this.date =
            new Date(date);
        this.type = type;
        this.quantity = quantity;
        this.unit = unit;
        this.duration = duration;
        this.notes = notes;
    }
}