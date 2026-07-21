export function buildTimeline(context) {

    const timeline = [

        ...context.vaccinations.map(v => ({

            id: v.id,
            type: "vaccination",
            title: `${v.visit} Vaccination`,
            dueDate: v.dueDate,
            details: v.vaccines,
            reminders: v.reminders

        })),

        ...context.milestones.map(m => ({

            id: m.id,
            type: "milestone",
            title: `${m.age} Development Milestone`,
            dueDate: m.dueDate,
            details: m.milestones

        }))

    ];

    return timeline.sort(
        (a, b) => a.dueDate - b.dueDate
    );

}