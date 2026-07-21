export function filterTimeline(
    timeline,
    type = null,
    status = null
) {
    return timeline.filter(item => {
        if (type && item.type !== type)
            return false;

        if (status && item.status !== status)
            return false;

        return true;
    });
}