export function isCompleted(event) {

    return event?.status === "completed";

}

export function isPending(event) {

    return event?.status === "pending";

}

export function isOverdue(event) {

    return event?.status === "overdue";

}

export function isActive(event) {

    return !isCompleted(event);

}

export function getStatus(event) {

    return event?.status ?? "pending";

}