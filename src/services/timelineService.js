import { generateVaccinationPlan } from "./vaccinationService.js";
import { generateMilestonePlan } from "./milestoneService.js";
import { generateHealthVisitPlan } from "./healthVisitService.js";
import { Event } from "../models/event.js";
import { generateAppointments } from "./appointmentGenerator.js";
import { getFeedings } from "./feedingService.js";
import { getSleepRecords } from "./sleepService.js";
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
    const healthVisits =
        generateHealthVisitPlan(child);
    const visits =
        healthVisits.map(
            visit =>
                new Event({
                    id: visit.id,
                    type: "health-visit",
                    title: `${visit.age} Health Visit`,
                    dueDate: visit.dueDate,
                    details: visit.purpose
                })
        );
    const appointments =
        generateAppointments(healthVisits).map(
            appointment =>
                new Event({
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
    const feedings =
    getFeedings(child.id)
        .map(feed =>
            new Event({
                id: feed.id,
                type: "feeding",
                title:
                    `${feed.type} Feeding`,
                dueDate:
                    new Date(feed.date),
                details: [
                    feed.quantity
                        ? `${feed.quantity} ${feed.unit}`
                        : feed.duration,
                    feed.notes
                ]
            })
        );
    const sleepEvents =
        getSleepRecords(child.id).map(
            sleep => new Event({
                id:
                    sleep.id,
                type:
                    "sleep",
                title:
                    `${sleep.type} Sleep`,
                dueDate:
                    sleep.startTime,
                details: [
                    `${sleep.durationMinutes} minutes`
                ]
            })
        );
    return [
        ...vaccinations,
        ...milestones,
        ...visits,
        ...appointments,
        ...sleepEvents,
        ...feedings
    ].sort(
        (a, b) => a.dueDate - b.dueDate
    );
}