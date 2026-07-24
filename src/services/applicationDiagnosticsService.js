export function runDiagnostics(context) {
    const issues = [];
    if (!context.profile)
        issues.push("Profile missing");
    if (!context.timeline?.length)
        issues.push("Timeline empty");
    if (!context.vaccinations?.length)
        issues.push("Vaccination schedule missing");
    if (!context.milestones?.length)
        issues.push("Milestone schedule missing");
    if (!context.growth?.length)
        issues.push("Growth schedule missing");
    if (!context.dashboard)
        issues.push("Dashboard not built");
    if (!context.healthScore)
        issues.push("Health score unavailable");
    if (!context.recommendations)
        issues.push("Recommendations unavailable");
    if (!context.notifications)
        issues.push("Notification center unavailable");
    return {
        healthy: issues.length === 0,
        issueCount: issues.length,
        issues
    };
}