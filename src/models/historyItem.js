export class HistoryItem {
    constructor(data = {}) {
        this.id =
            data.id ?? "";
        this.type =
            data.type ?? "";
        this.date =
            data.date instanceof Date
                ? data.date
                : new Date(data.date);
        this.title =
            data.title ?? "";
        this.subtitle =
            data.subtitle ?? "";
        this.details =
            data.details ?? {};
    }
}