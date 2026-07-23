export function buildTimelineStatistics(timeline) {

    const stats = {

        total: timeline.length,

        completed: 0,

        pending: 0,

        overdue: 0,

        vaccination: 0,

        milestone: 0,

        growth: 0,

        appointment: 0

    };

    timeline.forEach(event => {

        switch (event.status) {

            case "completed":
                stats.completed++;
                break;

            case "overdue":
                stats.overdue++;
                break;

            default:
                stats.pending++;
                break;

        }

        switch (event.type) {

            case "vaccination":
                stats.vaccination++;
                break;

            case "milestone":
                stats.milestone++;
                break;

            case "growth":
                stats.growth++;
                break;

            case "appointment":
                stats.appointment++;
                break;

        }

    });

    stats.completionPercent =
        stats.total === 0
            ? 0
            : Number(
                (
                    stats.completed /
                    stats.total *
                    100
                ).toFixed(1)
            );

    return stats;

}