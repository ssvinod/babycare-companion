export function getVaccinationRecommendations(vaccinations) {
    const today = new Date();
    const recommendations = [];
    for (const vaccine of vaccinations) {
        if (vaccine.completed)
            continue;
        const diffDays = Math.floor(
            (vaccine.dueDate - today) /
            (1000 * 60 * 60 * 24)
        );
        if (diffDays < 0) {
            recommendations.push({
                priority: "high",
                type: "overdue",
                visit: vaccine.visit,
                dueDate: vaccine.dueDate,
                message:
                    `${vaccine.visit} vaccination is overdue.`
            });
        }
        else if (diffDays <= 7) {
            recommendations.push({
                priority: "medium",
                type: "upcoming",
                visit: vaccine.visit,
                dueDate: vaccine.dueDate,
                message:
                    `${vaccine.visit} vaccination is due within a week.`
            });
        }
    }
    return recommendations;
}