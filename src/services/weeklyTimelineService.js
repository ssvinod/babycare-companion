export function buildWeeklyTimeline(context, today = new Date()) {

    const end = new Date(today);
    end.setDate(end.getDate() + 7);

    return (context.timeline ?? [])
        .filter(event => {
            const d = new Date(event.date);
            return d >= today && d <= end;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}