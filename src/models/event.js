export class Event {

    constructor({
        id,
        type,
        title,
        dueDate,
        details = [],
        status = "null"

    }) {

        this.id = id;
        this.type = type;
        this.title = title;
        this.dueDate = new Date(dueDate);
        this.details = details;
        this.status = status ?? null;

    }

}