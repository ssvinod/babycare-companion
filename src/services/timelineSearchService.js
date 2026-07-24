export function searchTimeline(context, keyword = "") {
    const timeline = context.timeline ?? [];
    const q = String(keyword)
        .trim()
        .toLowerCase();
    if (!q) {
        return timeline;
    }
    return timeline.filter(event => {
        const title =
            (event.title ?? "")
                .toLowerCase();
        const details =
            (event.details ?? [])
                .join(" ")
                .toLowerCase();
        const type =
            (event.type ?? "")
                .toLowerCase();
        return (
            title.includes(q) ||
            details.includes(q) ||
            type.includes(q)
        );
    });
}