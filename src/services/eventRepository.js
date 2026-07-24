export class EventRepository {
    constructor(events = []) {
        this.events = [...events];
    }
    getAll() {
        return [...this.events];
    }
    findById(id) {
        return this.events.find(
            e => e.id === id
        );
    }
    findByType(type) {
        return this.events.filter(
            e => e.type === type
        );
    }
    findPending() {
        return this.events.filter(
            e => e.status === "pending"
        );
    }
    findCompleted() {
        return this.events.filter(
            e => e.status === "completed"
        );
    }
    findOverdue() {
        return this.events.filter(
            e => e.status === "overdue"
        );
    }
}