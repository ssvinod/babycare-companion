export function buildTimelineExportSummary(timeline) {
    const summary = {
        totalEvents: timeline.length,
        vaccinations: 0,
        milestones: 0,
        growth: 0,
        appointments: 0,
        completed: 0,
        overdue: 0,
        pending: 0
    };
    for (const event of timeline) {
        switch (event.type) {
            case "vaccination":
                summary.vaccinations++;
                break;
            case "milestone":
                summary.milestones++;
                break;
            case "growth":
                summary.growth++;
                break;
            case "appointment":
                summary.appointments++;
                break;
        }
        switch (event.status) {
            case "completed":
                summary.completed++;
                break;
            case "overdue":
                summary.overdue++;
                break;
            case "pending":
                summary.pending++;
                break;
        }
    }
    return summary;
}