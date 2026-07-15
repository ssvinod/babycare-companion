import { generateVaccinationPlan } from "./vaccinationService.js";
import { generateMilestonePlan } from "./milestoneService.js";

export function generateTimeline(child) {

    const vaccinations = generateVaccinationPlan(child);

    const milestones = generateMilestonePlan(child);

    return {

        vaccinations,

        milestones

    };

}