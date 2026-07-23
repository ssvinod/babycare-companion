export function buildDailyBrief(context) {
    const dashboard = context.dashboard;
    return {
        date: new Date(),
        healthScore:
            context.healthScore,
        recommendations:
            context.recommendations,
        insights:
            context.insights,
        overdue:
            dashboard.overdueCount,
        pending:
            dashboard.pendingCount,
        completed:
            dashboard.completedCount,
        nextVaccination:
            dashboard.nextVaccination,
        nextGrowth:
            dashboard.nextGrowth
    };
}