import { loadProfile } from "./profileService.js";
import { generateVaccinationPlan } from "./vaccinationService.js";
import { generateMilestonePlan } from "./milestoneService.js";
import { generateGrowthPlan } from "./growthService.js";
import { aggregateTimeline } from "./timelineAggregator.js";
import { generateReminders } from "./reminderService.js";
import { buildDashboardSummary } from "./dashboardSummaryService.js";
import { loadHistory } from "./historyService.js";
import { calculateHealthScore } from "./healthScoreService.js";
import { generateParentInsights } from "./parentInsightsService.js";
import { generateRecommendations } from "./recommendationEngine.js";
import { buildNotificationCenter } from "./notificationCenterService.js";
import { buildDailyBrief } from "./dailyBriefService.js";
import { buildBabyStatus } from "./babyStatusService.js";
import { buildTimelineExportSummary } from "./timelineExportSummaryService.js";
import { getProjectInfo } from "./versionService.js";
import { runDiagnostics } from "./applicationDiagnosticsService.js";

export function createApplicationContext() {
    const child = loadProfile();
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
            alerts: []
        });
    const healthScore =
        calculateHealthScore({
            dashboard,
            alerts: []
        });
    const recommendations =
        generateRecommendations({
            dashboard,
            healthScore
        });
    const parentInsights =
        generateParentInsights({
            feedings: history.feedings ?? [],
            sleep: history.sleep ?? [],
            medications: history.medications ?? [],
            vaccinations,
            growth: history.growth ?? []
        });
    const insights =
        parentInsights.messages;
    const insightSummary =
        parentInsights.summary;
    const dailyBrief =
        buildDailyBrief({
            dashboard,
            healthScore,
            recommendations,
            insights
        });
    const timelineSummary =
        buildTimelineExportSummary(
            timeline
        );
    const babyStatus =
        buildBabyStatus({
            dashboard,
            healthScore
        });
    const notifications =
        buildNotificationCenter({
            timeline,
            insights,
            recommendations
        });
    const diagnostics =
        runDiagnostics({
            profile: child,
            timeline,
            vaccinations,
            milestones,
            growth,
            dashboard,
            healthScore,
            recommendations,
            notifications
        });
    const project = getProjectInfo();
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
        healthScore,
        recommendations,
        insights,
        insightSummary,
        dailyBrief,
        timelineSummary,
        babyStatus,
        notifications,
        diagnostics,
        project,
        appointments: []
    };
}