import { getTodayTasks }
from "./todayService.js";
import { getVaccinationRecommendations }
from "./vaccinationRecommendationService.js";
export function buildHomeDashboard(context) {
    return {
        profile:
            context.profile,
        today:
            getTodayTasks({
                dashboard:
                    context.dashboard,
                nextMeasurementDate:
                    context.nextMeasurementDate,
                reminders:
                    context.reminders
            }),
        growth:
            context.growthSummary,
        alerts:
            context.alerts,
        recommendations:
            getVaccinationRecommendations(
                context.vaccinations
            ),
        timeline:
            context.timeline.slice(0,5)
    };
}