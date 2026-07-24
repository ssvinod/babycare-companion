export function buildDailyTimeline(context, date = new Date()) {

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return (context.timeline ?? [])
        .filter(event => {
            const d = new Date(event.date);
            return d >= start && d <= end;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}