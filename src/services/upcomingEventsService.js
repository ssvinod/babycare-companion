import { buildTimeline }
from "./timelineAggregator.js";
export function getUpcomingEvents(
    context,
    today = new Date(),
    limit = 10
) {
    return buildTimeline(context)
        .filter(event =>
            new Date(event.date) >= today
        )
        .sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        )
        .slice(0, limit);
}