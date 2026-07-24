export class TimelineQueryEngine {
    constructor(events = []) {
        this.events = [...events];
    }
    all() {
        return [...this.events];
    }
    byType(type) {
        return this.events.filter(
            e => e.type === type
        );
    }
    byStatus(status) {
        return this.events.filter(
            e => e.status === status
        );
    }
    between(start, end) {
        return this.events.filter(event => {
            const date =
                new Date(event.date);
            return (
                date >= start &&
                date <= end
            );
        });
    }
    search(keyword) {
        const q =
            keyword.toLowerCase();
        return this.events.filter(event =>
            event.title
                ?.toLowerCase()
                .includes(q)
        );
    }
    upcoming(limit = 5) {
        return this.events
            .filter(
                e => e.status === "pending"
            )
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            )
            .slice(0, limit);
    }
}