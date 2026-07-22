export class Event {
    constructor({
        id,
        type,
        title,
        dueDate,
        details = [],
        status = "pending",
        completedDate = null
    }) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.dueDate = new Date(dueDate);
        this.details = details;
        this.status = status;
        this.completedDate =
            completedDate
                ? new Date(completedDate)
                : null;
    }
    isCompleted() {
        return this.completedDate !== null;
    }
}