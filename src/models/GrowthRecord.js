export class GrowthRecord {
    constructor({
        childId,
        date,
        weight,
        length,
        headCircumference,
        notes = ""
    }) {
        this.childId = childId;
        this.date = new Date(date);
        this.weight = weight;
        this.length = length;
        this.headCircumference = headCircumference;
        this.notes = notes;
    }
}