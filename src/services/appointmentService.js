import fs from "fs";

import { Appointment } from "../models/appointment.js";

export function loadAppointments() {

    const data = JSON.parse(

        fs.readFileSync(
            "./data/appointments.json",
            "utf8"
        )

    );

    return data.map(

        item => new Appointment(item)

    );

}