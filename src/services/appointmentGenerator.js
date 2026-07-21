export function generateAppointments(healthVisits) {
    return healthVisits.map(visit => ({
        id: `appt-${visit.id}`,
        visitId: visit.id,
        title: `${visit.age} Pediatric Checkup`,
        date: visit.dueDate,
        doctor: "",
        hospital: "",
        notes: "",
        status: "scheduled"
    }));
}