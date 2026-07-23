export function calculateHealthMetrics(context) {
    const timeline = context.timeline ?? [];
    const vaccinations =
        timeline.filter(e => e.type === "vaccination");
    const milestones =
        timeline.filter(e => e.type === "milestone");
    const growth =
        timeline.filter(e => e.type === "growth");
    const completedVaccinations =
        vaccinations.filter(e => e.status === "completed").length;
    const completedGrowth =
        growth.filter(e => e.status === "completed").length;
    const overdue =
        timeline.filter(e => e.status === "overdue").length;
    return {
        vaccinationCompletion:
            vaccinations.length
                ? completedVaccinations / vaccinations.length
                : 1,
        growthCompletion:
            growth.length
                ? completedGrowth / growth.length
                : 1,
        milestoneCount:
            milestones.length,
        overdueCount:
            overdue
    };
}