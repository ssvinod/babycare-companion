import { FeedingRepository } from "../repositories/feedingRepository.js";
import { FeedingRecord } from "../models/feedingRecord.js";
const repo = new FeedingRepository();
export function addFeeding(data) {
    const record =
        data instanceof FeedingRecord
            ? data
            : new FeedingRecord(data);
    return repo.save(record);
}
export function getFeedings(childId) {
    return repo.findByChild(childId)
        .sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        );
}
export function getTodaysFeedings(
    childId,
    today = new Date()
) {
    return getFeedings(childId)
        .filter(feed => {
            const d = new Date(feed.date);
            return (
                d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate()
            );
        });
}
export function getLastFeeding(childId) {
    const feeds =
        getFeedings(childId);
    return feeds.length
        ? feeds[feeds.length - 1]
        : null;
}
export function deleteFeeding(id) {
    repo.delete(id);
}
export function getDailyNutritionSummary(
    childId,
    date = new Date()
) {
    const feeds =
        getTodaysFeedings(childId, date);
    const breastfeedingCount =
        feeds.filter(f => f.type === "Breastfeeding").length;
    const formulaCount =
        feeds.filter(f => f.type === "Formula").length;
    const solidMeals =
        feeds.filter(f => f.type === "Solid").length;
    const waterFeeds =
        feeds.filter(f => f.type === "Water").length;
    let averageIntervalHours = 0;
    if (feeds.length > 1) {
        let total = 0;
        for (let i = 1; i < feeds.length; i++) {
            total +=
                (
                    new Date(feeds[i].date) -
                    new Date(feeds[i - 1].date)
                );
        }
        averageIntervalHours =
            Number(
                (
                    total /
                    (feeds.length - 1) /
                    3600000
                ).toFixed(2)
            );
    }
    return {
        totalFeeds: feeds.length,
        breastfeedingCount,
        formulaCount,
        solidMeals,
        waterFeeds,
        averageIntervalHours,
        lastFeed:
            feeds.length
                ? feeds[feeds.length - 1]
                : null
    };
}