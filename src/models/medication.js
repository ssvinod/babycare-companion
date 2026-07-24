import crypto from "crypto";
export class Medication {
    constructor({
        id = crypto.randomUUID(),
        childId,
        name,
        dosage,
        frequency,
        startDate,
        endDate = null,
        instructions = "",
        completed = false
    }) {
        this.id = id;
        this.childId = childId;
        this.name = name;
        this.dosage = dosage;
        this.frequency = frequency;
        this.startDate = new Date(startDate);
        this.endDate =
            endDate
                ? new Date(endDate)
                : null;
        this.instructions = instructions;
        this.completed = completed;
    }
}