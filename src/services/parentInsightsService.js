import { isPending, isOverdue } from "./eventStatusService.js";

export function generateParentInsights(context) {
    const insights = [];
    const dashboard = context.dashboard;
    const score = context.healthScore;
    if (dashboard.overdueCount > 0) {
        insights.push({
            severity: "warning",
            title: "Pending activities",
            message: `${dashboard.overdueCount} baby care activities require attention.`
        });
    }
    if (score.level !== "Excellent") {
        insights.push({
            severity: "info",
            title: "Health score",
            message: `Current health score: ${score.score}/100 (${score.level}).`
        });
    }
    if (dashboard.nextVaccination) {
        insights.push({
            severity: "info",
            title: "Next vaccination",
            message: dashboard.nextVaccination.title
        });
    }
    if (dashboard.nextGrowth) {
        insights.push({
            severity: "info",
            title: "Next growth measurement",
            message: dashboard.nextGrowth.title
        });
    }
    return insights;
}