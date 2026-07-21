import { loadProfile } from "./profileService.js";
import { generateVaccinationPlan } from "./vaccinationService.js";
import { generateMilestonePlan } from "./milestoneService.js";
import { generateGrowthPlan } from "./growthService.js";

export function createApplicationContext() {

    const child = loadProfile();

    return {
        child,
        vaccinations: generateVaccinationPlan(child),
        milestones: generateMilestonePlan(child),
        growth: generateGrowthPlan(child)
    };
}