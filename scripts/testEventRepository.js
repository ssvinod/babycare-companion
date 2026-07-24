import { createApplicationContext } from "../src/services/applicationContext.js";
import { EventRepository } from "../src/services/eventRepository.js";

const context =
    createApplicationContext();
const repo =
    new EventRepository(
        context.timeline
    );
console.table({
    Total:
        repo.getAll().length,
    Vaccinations:
        repo.findByType("vaccination").length,
    Milestones:
        repo.findByType("milestone").length,
    Growth:
        repo.findByType("growth").length,
    Pending:
        repo.findPending().length,
    Completed:
        repo.findCompleted().length,
    Overdue:
        repo.findOverdue().length
});