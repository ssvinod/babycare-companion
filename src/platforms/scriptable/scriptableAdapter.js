/**
 * Scriptable Adapter
 *
 * Converts the application timeline into
 * Scriptable-friendly objects.
 */

export function createScriptableSchedule(child, visits) {

    return {

        child: {

            name: child.name,
            birthDate: child.birthDate,
            gender: child.gender,
            bloodGroup: child.bloodGroup

        },

        schedule: visits.map(visit => ({

            id: visit.id,

            title:
                visit.title ??
                `${visit.visit} Vaccination`,

            dueDate: visit.dueDate,

            reminders: visit.reminders,

            vaccines: visit.vaccines,

            milestones: visit.milestones

        }))

    };

}