import {
    isCompleted,
    isPending,
    isOverdue,
    isActive,
    getStatus
} from "../src/services/eventStatusService.js";

const completed = { status: "completed" };
const pending = { status: "pending" };
const overdue = { status: "overdue" };

console.table({

    completed: isCompleted(completed),

    pending: isPending(pending),

    overdue: isOverdue(overdue),

    activePending: isActive(pending),

    activeCompleted: isActive(completed),

    status: getStatus(overdue)

});