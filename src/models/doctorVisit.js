export class DoctorVisit {
    constructor(data = {}) {
        this.id =
            data.id ??
            crypto.randomUUID();
        this.childId =
            data.childId;
        this.visitDate =
            new Date(data.visitDate);
        this.doctorName =
            data.doctorName ?? "";
        this.hospital =
            data.hospital ?? "";
        this.purpose =
            data.purpose ?? "";
        this.diagnosis =
            data.diagnosis ?? "";
        this.prescription =
            data.prescription ?? [];
        this.notes =
            data.notes ?? "";
        this.nextVisitDate =
            data.nextVisitDate
                ? new Date(data.nextVisitDate)
                : null;
    }
    hasFollowUp() {
        return this.nextVisitDate !== null;
    }
    isFollowUpDue(today = new Date()) {
        if (!this.nextVisitDate)
            return false;
        return this.nextVisitDate <= today;
    }
    summary() {
        return {
            doctor: this.doctorName,
            hospital: this.hospital,
            diagnosis: this.diagnosis,
            visitDate: this.visitDate,
            nextVisitDate: this.nextVisitDate
        };
    }
}
import crypto from "crypto";