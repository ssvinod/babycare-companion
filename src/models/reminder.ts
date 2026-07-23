export interface Reminder {
    id: string;
    title: string;
    dueDate: Date;
    category:
        | "vaccination"
        | "milestone"
        | "growth"
        | "appointment";
    completed: boolean;
}