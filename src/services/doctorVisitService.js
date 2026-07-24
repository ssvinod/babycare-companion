import { DoctorVisitRepository } from "../repositories/doctorVisitRepository.js";
import { DoctorVisit } from "../models/doctorVisit.js";
const repo = new DoctorVisitRepository();
export function addDoctorVisit(data) {
    const visit =
        data instanceof DoctorVisit
            ? data
            : new DoctorVisit(data);
    return repo.save(visit);
}
export function getDoctorVisits(childId) {
    return repo.findByChild(childId);
}
export function getLatestDoctorVisit(childId) {
    const visits =
        repo.findByChild(childId);
    if (visits.length === 0)
        return null;
    visits.sort(
        (a, b) =>
            new Date(b.visitDate) -
            new Date(a.visitDate)
    );
    return visits[0];
}
export function getUpcomingDoctorVisit(childId) {
    const today = new Date();
    return repo
        .findByChild(childId)
        .filter(
            visit =>
                visit.nextVisitDate &&
                new Date(visit.nextVisitDate) >= today
        )
        .sort(
            (a, b) =>
                new Date(a.nextVisitDate) -
                new Date(b.nextVisitDate)
        )[0] ?? null;
}
export function removeDoctorVisit(id) {
    repo.remove(id);
}