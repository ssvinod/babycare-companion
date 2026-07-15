/**
 * Scriptable Adapter
 *
 * Converts core models into Scriptable-friendly objects.
 */

export function createScriptableSchedule(child, visits) {

    return visits.map(visit => ({

        id: visit.id,

        title: `${visit.visit} Vaccination`,

        dueDate: visit.dueDate,

        vaccines: visit.vaccines,

        reminders: visit.reminders,

        childName: child.name

    }));

}