import { randomUUID } from "crypto";
export class DiaperRecord {
    constructor({
        id = randomUUID(),
        childId,
        date = new Date(),
        type,
        color = "",
        consistency = "",
        rash = false,
        notes = ""
    }) {
        this.id = id;
        this.childId = childId;
        this.date = new Date(date);
        this.type = type;
        this.color = color;
        this.consistency = consistency;
        this.rash = rash;
        this.notes = notes;
    }
}