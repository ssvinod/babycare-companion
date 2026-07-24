import crypto from "crypto";
export class HealthVisit {
    constructor({
        id = crypto.randomUUID(),
        childId,
        visitDate,
        doctor,
        hospital,
        diagnosis = "",
        prescription = [],
        notes = "",
        followUpDate = null
    }) {
        this.id = id;
        this.childId = childId;
        this.visitDate = new Date(visitDate);
        this.doctor = doctor;
        this.hospital = hospital;
        this.diagnosis = diagnosis;
        this.prescription = prescription;
        this.notes = notes;
        this.followUpDate =
            followUpDate
                ? new Date(followUpDate)
                : null;
    }
}