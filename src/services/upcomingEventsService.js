export function getUpcomingEvents(
    timeline,
    today = new Date(),
    limit = 10
) {

    const events = [

        ...timeline.vaccinations.map(v => ({

            type: "vaccination",

            title: `${v.visit} Vaccination`,

            dueDate: v.dueDate,

            details: v.vaccines

        })),

        ...timeline.milestones.map(m => ({

            type: "milestone",

            title: `${m.age} Development Milestone`,

            dueDate: m.dueDate,

            details: m.milestones

        }))

    ];

    return events

        .filter(event => event.dueDate >= today)

        .sort((a, b) => a.dueDate - b.dueDate)

        .slice(0, limit);

}