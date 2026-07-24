import { loadProfile } from "./profileService.js";
import { generateVaccinationPlan } from "./vaccinationService.js";
import { generateHealthVisitPlan } from "./healthVisitService.js";
import { generateMilestonePlan } from "./milestoneService.js";
import { generateTimeline } from "./timelineService.js";
import { getDailyNutritionSummary } from "./feedingService.js";
import { generateSleepInsights } from "./sleepInsightService.js";
import { generateNotifications } from "./notificationSchedulerService.js";
import { shortDate } from "../utils/dateFormatter.js";
export function generateDashboard(context) {
    const nextVaccination =
        context.vaccinations.find(v => !v.completed);
    return {
        profile: {
            ...context.profile,
            birthDate:
                context.profile.birthDate
                    ? shortDate(context.profile.birthDate)
                    : ""
        },
        growth:
            context.growthSummary ?? {},
        vaccinations: {
            completed:
                context.vaccinations.filter(v => v.completed).length,
            pending:
                context.vaccinations.filter(v => !v.completed).length,
            next:
                nextVaccination
                    ? {
                        ...nextVaccination,
                        dueDate: shortDate(nextVaccination.dueDate),
                        completedDate:
                            nextVaccination.completedDate
                                ? shortDate(nextVaccination.completedDate)
                                : null
                    }
                    : null
        },
        appointments:
            (context.appointments ?? []).map(v => ({
                ...v,
                dueDate: shortDate(v.dueDate)
            })),
        reminders:
            context.reminders ?? [],
        milestones:
            (context.milestones ?? []).map(v => ({
                ...v,
                dueDate: shortDate(v.dueDate)
            })),
        alerts:
            context.alerts ?? [],
        timeline:
            (context.timeline ?? []).map(v => ({
                ...v,
                dueDate: shortDate(v.dueDate),
                completedDate:
                    v.completedDate
                        ? shortDate(v.completedDate)
                        : null
            })),
        sleep:
            context.sleep ?? {},
        feeding:
            context.feedingSummary ?? {},
        notifications:
            (context.notifications ?? []).map(n => ({
                ...n,
                dueDate: shortDate(n.dueDate)
            }))
    };
}
export function getDashboard(child = loadProfile()) {
    const vaccinations =
        generateVaccinationPlan(child);
    const appointments =
        generateHealthVisitPlan(child);
    const milestones =
        generateMilestonePlan(child);
    const timeline =
        generateTimeline(child);
    const feedingSummary =
        getDailyNutritionSummary(child.id);
    const sleep =
        generateSleepInsights(child.id);
    const notifications =
        generateNotifications({
            vaccinations,
            medications: [],
            appointments
        });
    return generateDashboard({
        profile: child,
        growthSummary: {},
        vaccinations,
        appointments,
        reminders: [],
        milestones,
        alerts: [],
        timeline,
        feedingSummary,
        sleep,
        notifications
    });
}