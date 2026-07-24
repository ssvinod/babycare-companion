import { HealthVisitRepository } from "../repositories/healthVisitRepository.js";
import { HEALTH_VISIT_SCHEDULE } from "../config/healthVisitSchedule.js";
import { addOffset } from "../utils/dateUtils.js";
const repository = new HealthVisitRepository();
/* ============================================================
   CRUD
============================================================ */
export function saveVisit(visit) {
    const visits = repository.load();
    visits.push(visit);
    repository.save(visits);
}
export function loadVisits() {
    return repository.load();
}
export function getUpcomingFollowUps() {
    const today = new Date();
    return loadVisits()
        .filter(v => v.followUpDate)
        .filter(v =>
            new Date(v.followUpDate) >= today
        )
        .sort(
            (a, b) =>
                new Date(a.followUpDate) -
                new Date(b.followUpDate)
        );
}
/* ============================================================
   Planner
============================================================ */
export function generateHealthVisitPlan(child) {
    return HEALTH_VISIT_SCHEDULE.map(visit => ({
        id: visit.id,
        age: visit.age,
        purpose: visit.purpose,
        dueDate: addOffset(
            new Date(child.birthDate),
            visit.offset
        )
    }));
}