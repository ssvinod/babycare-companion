export function groupTimelineByType(timeline) {
    return {
        vaccinations:
            timeline.filter(e => e.type === "vaccination"),
        milestones:
            timeline.filter(e => e.type === "milestone"),
        growth:
            timeline.filter(e => e.type === "growth"),
        appointments:
            timeline.filter(e => e.type === "appointment")
    };
}