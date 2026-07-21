import { buildTimeline } from "./timelineAggregator.js";

export function getUpcomingEvents(
    context,
    today = new Date(),
    limit = 10
) {

    return buildTimeline(context)

        .filter(event => event.dueDate >= today)

        .slice(0, limit);

}