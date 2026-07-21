export class Appointment {

    constructor({

        id,

        visitId,

        title,

        date,

        doctor = "",

        hospital = "",

        status = "scheduled",

        notes = ""

    }) {

        this.id = id;

        this.visitId = visitId;

        this.title = title;

        this.date = new Date(date);

        this.doctor = doctor;

        this.hospital = hospital;

        this.status = status;

        this.notes = notes;

    }

}