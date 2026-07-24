export function buildTimelineSummary(context) {

    return {
        totalEvents: context.timeline.length,

        vaccinations:
            context.timeline.filter(e =>
                e.type === "vaccination"
            ).length,

        milestones:
            context.timeline.filter(e =>
                e.type === "milestone"
            ).length,

        growth:
            context.timeline.filter(e =>
                e.type === "growth"
            ).length,

        appointments:
            context.timeline.filter(e =>
                e.type === "appointment"
            ).length
    };
}