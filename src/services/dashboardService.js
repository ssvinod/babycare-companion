export function generateDashboard(context) {
    const dashboard = [];
    for (const visit of context.vaccinations) {
        dashboard.push({
            type: "vaccination",
            title: `${visit.visit} Vaccination`,
            dueDate: visit.dueDate,
            details: visit.vaccines
        });
    }
    for (const milestone of context.milestones) {
        dashboard.push({
            type: "milestone",
            title: `${milestone.age} Development Milestone`,
            dueDate: milestone.dueDate,
            details: milestone.milestones
        });
    }
    dashboard.sort(
        (a, b) => a.dueDate - b.dueDate
    );
    return dashboard;
}