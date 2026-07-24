import { shortDate } from "../src/utils/dateFormatter.js";
import { loadAppointments } from "../src/services/appointmentService.js";

console.log(
    JSON.stringify(
        loadAppointments(),
        null,
        4
    )
);