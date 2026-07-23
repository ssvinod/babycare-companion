import { buildTimelineStatistics } from "./timelineStatisticsService.js";
import { isPending } from "./eventStatusService.js";

export function buildDashboardSummary(context) {
    const timeline =
        context.timeline ?? [];
    const stats =
        buildTimelineStatistics(timeline);
    const pending =
        timeline.filter(isPending);
    const nextVaccination =
        pending.find(
            event => event.type === "vaccination"
        );
    const nextGrowth =
        pending.find(
            event => event.type === "growth"
        );
    return {
        completedCount:
            stats.completed,
        overdueCount:
            stats.overdue,
        pendingCount:
            stats.pending,
        completionPercent:
            stats.completionPercent,
        nextVaccination,
        nextGrowth,
        alerts:
            context.alerts ?? []
    };
}