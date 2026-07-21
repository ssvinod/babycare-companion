import { generateVaccinationPlan } from "./vaccinationService.js";
import { generateMilestonePlan } from "./milestoneService.js";
import { generateHealthVisitPlan } from "./healthVisitService.js";
import { Event } from "../models/event.js";
import { loadAppointments } from "./appointmentService.js";

export function generateTimeline(child) {

    const vaccinations = generateVaccinationPlan(child).map(
        visit => new Event({
            id: visit.id,
            type: "vaccination",
            title: `${visit.visit} Vaccination`,
            dueDate: visit.dueDate,
            details: visit.vaccines
        })
    );

    const milestones = generateMilestonePlan(child).map(
        visit => new Event({
            id: visit.id,
            type: "milestone",
            title: `${visit.age} Development Milestone`,
            dueDate: visit.dueDate,
            details: visit.milestones
        })
    );

    const visits = generateHealthVisitPlan(child).map(
        visit => new Event({
            id: visit.id,
            type: "health-visit",
            title: `${visit.age} Health Visit`,
            dueDate: visit.dueDate,
            details: visit.purpose
        })
    );

    const appointments = loadAppointments().map(
        appointment => new Event({
            id: appointment.id,
            type: "appointment",
            title: appointment.title,
            dueDate: appointment.date,
            details: [
                appointment.doctor,
                appointment.hospital
            ]
        })
    );

    return [
        ...vaccinations,
        ...milestones,
        ...visits,
        ...appointments
    ].sort(
        (a, b) => a.dueDate - b.dueDate
    );
}