export function generateRecommendations(context) {
    const recommendations = [];
    const dashboard = context.dashboard;
    if (dashboard.overdueCount > 0) {
        recommendations.push({
            severity: "high",
            category: "vaccination",
            message:
                `${dashboard.overdueCount} scheduled items are overdue.`
        });
    }
    if (dashboard.nextVaccination) {
        recommendations.push({
            severity: "info",
            category: "vaccination",
            message:
                `Next vaccination: ${dashboard.nextVaccination.title}`
        });
    }
    if (dashboard.nextGrowth) {
        recommendations.push({
            severity: "info",
            category: "growth",
            message:
                `Next growth check: ${dashboard.nextGrowth.title}`
        });
    }
    return recommendations;
}