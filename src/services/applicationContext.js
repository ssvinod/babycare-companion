import { loadProfile } from "./profileService.js";
import { generateVaccinationPlan } from "./vaccinationService.js";
import { generateMilestonePlan } from "./milestoneService.js";
import { generateGrowthPlan } from "./growthService.js";
import { aggregateTimeline } from "./timelineAggregator.js";
import { generateReminders } from "./reminderService.js";
import { buildDashboardSummary } from "./dashboardSummaryService.js";
import { loadHistory } from "./historyService.js";
import { generateRecommendations } from "./recommendationService.js";
import { calculateHealthScore } from "./healthScoreService.js";

export function createApplicationContext() {
    const child =
        loadProfile();
    const history = loadHistory();
    const vaccinations =
        generateVaccinationPlan(child);
    const milestones =
        generateMilestonePlan(child);
    const growth =
        generateGrowthPlan(child);
    const timeline =
        aggregateTimeline({
            vaccinations,
            milestones,
            growth
        });
    const reminders =
        generateReminders({
            timeline
        });
    const dashboard =
        buildDashboardSummary({
            timeline,
            alerts: [],
        });
    const recommendations =
        generateRecommendations({
            dashboard
        });
    const healthScore =
        calculateHealthScore({
            dashboard,
            alerts: []
        });
    return {
        profile: child,
        history,
        child,
        vaccinations,
        milestones,
        growth,
        timeline,
        reminders,
        dashboard,
        recommendations,
        healthScore,
        appointments: []
    };
}