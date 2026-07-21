import { generateVaccinationPlan } from "./vaccinationService.js";
import { generateMilestonePlan } from "./milestoneService.js";
import { generateHealthVisitPlan } from "./healthVisitService.js";
import { Event } from "../models/event.js";

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

    return [
        ...vaccinations,
        ...milestones,
        ...visits
    ].sort(
        (a, b) => a.dueDate - b.dueDate
    );
}