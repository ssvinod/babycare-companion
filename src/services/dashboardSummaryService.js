export function buildDashboardSummary(context) {
    const timeline = context.timeline ?? [];
    const completed =
        timeline.filter(e => e.status === "completed");
    const overdue =
        timeline.filter(e => e.status === "overdue");
    const pending =
        timeline.filter(e => e.status === "pending");
    const nextVaccination =
        pending.find(e => e.type === "vaccination");
    const nextGrowth =
        pending.find(e => e.type === "growth");
    return {
        completedCount:
            completed.length,
        overdueCount:
            overdue.length,
        pendingCount:
            pending.length,
        nextVaccination,
        nextGrowth,
        alerts:
            context.alerts ?? []
    };
}