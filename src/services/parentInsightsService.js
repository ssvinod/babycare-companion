export function generateParentInsights(context) {
    const feedings = context.feedings ?? [];
    const sleep = context.sleep ?? [];
    const medications = context.medications ?? [];
    const vaccinations = context.vaccinations ?? [];
    const growth = context.growth ?? [];
    /* ---------------- Feeding ---------------- */
    const feedsToday = feedings.length;
    const formulaFeeds =
        feedings.filter(f => f.type === "Formula").length;
    const breastFeeds =
        feedings.filter(f => f.type === "Breastfeeding").length;
    const averageFeedVolume =
        formulaFeeds === 0
            ? 0
            : Math.round(
                  feedings
                      .filter(f => f.quantity)
                      .reduce((sum, f) => sum + f.quantity, 0) /
                      formulaFeeds
              );
    /* ---------------- Sleep ---------------- */
    const totalSleepMinutes =
        sleep.reduce(
            (sum, s) => sum + (s.durationMinutes ?? 0),
            0
        );
    const averageNap =
        sleep.length === 0
            ? 0
            : Math.round(totalSleepMinutes / sleep.length);
    const longestSleep =
        sleep.reduce(
            (max, s) =>
                Math.max(max, s.durationMinutes ?? 0),
            0
        );
    /* ---------------- Medication ---------------- */
    const activeMedication =
        medications.filter(m => !m.completed).length;
    const completedMedication =
        medications.filter(m => m.completed).length;
    /* ---------------- Vaccination ---------------- */
    const completedVaccines =
        vaccinations.filter(v => v.completed).length;
    const pendingVaccines =
        vaccinations.filter(v => !v.completed).length;
    const completionPercent =
        vaccinations.length === 0
            ? 100
            : Math.round(
                  (completedVaccines * 100) /
                      vaccinations.length
              );
    /* ---------------- Growth ---------------- */
    const latestGrowth =
        growth.length === 0
            ? null
            : growth[growth.length - 1];
    /* ---------------- Health Score ---------------- */
    let score = 100;
    score -= pendingVaccines * 2;
    score -= activeMedication;
    if (score < 0)
        score = 0;
    let level = "Excellent";
    if (score < 90)
        level = "Good";
    if (score < 75)
        level = "Average";
    if (score < 50)
        level = "Needs Attention";
    /* ---------------- Notifications ---------------- */
    const messages = [];
    if (pendingVaccines > 0) {
        messages.push({
            severity: "warning",
            title: "Vaccination",
            message: `${pendingVaccines} vaccination(s) pending.`
        });
    }
    if (activeMedication > 0) {
        messages.push({
            severity: "info",
            title: "Medication",
            message: `${activeMedication} medication(s) active.`
        });
    }
    return {
        summary: {
            feeding: {
                feedsToday,
                breastfeeding: breastFeeds,
                formula: formulaFeeds,
                averageVolume: averageFeedVolume
            },
            sleep: {
                totalMinutes: totalSleepMinutes,
                averageNap,
                longestSleep
            },
            medication: {
                active: activeMedication,
                completed: completedMedication
            },
            vaccinations: {
                completed: completedVaccines,
                pending: pendingVaccines,
                completionPercent
            },
            growth: latestGrowth,
            healthScore: {
                score,
                level
            }
        },
        messages
    };
}