import { buildCompletionMap, getCompletionStatus } from "./completionService.js";

export function aggregateTimeline(context) {
    const timeline = [];
    const completion = buildCompletionMap(context);
    context.vaccinations?.forEach(v => {
        timeline.push({
            id: v.id,
            type: "vaccination",
            title: `${v.visit} Vaccination`,
            date: v.dueDate,
            details: v.vaccines
        });
    });
    context.milestones?.forEach(m => {
        timeline.push({
            id: m.id,
            type: "milestone",
            title: `${m.age} Milestone`,
            date: m.dueDate,
            details: m.milestones
        });
    });
    context.growth?.forEach(g => {
        timeline.push({
            id: g.id,
            type: "growth",
            title: `Growth Measurement (${g.age})`,
            date: g.dueDate,
            id: g.id,
            details: g.measurements
        });
    });
    context.appointments?.forEach(a => {
        timeline.push({
            id: a.id,
            type: "appointment",
            title: a.title,
            date: a.date,
            details: a.notes ?? []
        });
    });
    timeline.forEach(event => {
        event.status =
            getCompletionStatus(
                event,
                completion
            );
    });
    
    return timeline.sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );
}
export function buildTimeline(context) {
    return aggregateTimeline(context);
}