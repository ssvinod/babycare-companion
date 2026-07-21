export class Appointment {

    constructor({

        id,

        title,

        date,

        doctor = "",

        location = "",

        notes = ""

    }) {

        this.id = id;

        this.title = title;

        this.date = new Date(date);

        this.doctor = doctor;

        this.location = location;

        this.notes = notes;

    }

}