export function generateDashboard(context) {
    return {
        profile: context.profile,
        growth: context.growthSummary,
        vaccinations: {
            completed:
                context.vaccinations.filter(v => v.completed).length,
            pending:
                context.vaccinations.filter(v => !v.completed).length,
            next:
                context.vaccinations.find(v => !v.completed) ?? null
        },
        appointments:
            context.appointments,
        reminders:
            context.reminders,
        milestones:
            context.milestones,
        alerts:
            context.alerts,
        timeline:
            context.timeline
    };
}