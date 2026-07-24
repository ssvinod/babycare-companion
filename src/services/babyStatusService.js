export function buildBabyStatus(context) {
    const dashboard = context.dashboard;
    const health = context.healthScore;
    return {
        overallStatus:
            health.level,
        healthScore:
            health.score,
        overdueActivities:
            dashboard.overdueCount,
        pendingActivities:
            dashboard.pendingCount,
        completedActivities:
            dashboard.completedCount,
        nextVaccination:
            dashboard.nextVaccination?.title ?? null,
        nextGrowth:
            dashboard.nextGrowth?.title ?? null
    };
}