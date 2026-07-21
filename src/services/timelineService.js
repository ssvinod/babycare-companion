import { generateVaccinationPlan } from "./vaccinationService.js";
import { generateMilestonePlan } from "./milestoneService.js";
import { generateHealthVisitPlan } from "./healthVisitService.js";

export function generateTimeline(child) {

    const vaccinations = generateVaccinationPlan(child).map(item => ({

        type: "vaccination",

        title: `${item.visit} Vaccination`,

        dueDate: item.dueDate,

        details: item.vaccines

    }));

    const milestones = generateMilestonePlan(child).map(item => ({

        type: "milestone",

        title: `${item.age} Development Milestone`,

        dueDate: item.dueDate,

        details: item.milestones

    }));

    const visits = generateHealthVisitPlan(child).map(item => ({

        type: "health-visit",

        title: `${item.age} Health Visit`,

        dueDate: item.dueDate,

        details: item.purpose

    }));

    return [

        ...vaccinations,

        ...milestones,

        ...visits

    ].sort(

        (a, b) => a.dueDate - b.dueDate

    );

}