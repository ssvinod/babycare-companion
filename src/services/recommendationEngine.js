export function generateRecommendations(context) {

    const recommendations = [];

    const dashboard = context.dashboard;

    if (dashboard.overdueCount > 0) {
        recommendations.push({
            priority: "high",
            category: "vaccination",
            action: "Complete overdue vaccinations."
        });
    }

    if (dashboard.nextGrowth) {
        recommendations.push({
            priority: "medium",
            category: "growth",
            action: "Record the next growth measurement."
        });
    }

    if (context.healthScore.score < 80) {
        recommendations.push({
            priority: "medium",
            category: "health",
            action: "Schedule a pediatric consultation."
        });
    }

    if (recommendations.length === 0) {
        recommendations.push({
            priority: "low",
            category: "general",
            action: "Everything is up to date."
        });
    }

    return recommendations;
}