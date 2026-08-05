import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Medication } from '../models/Medication';
import MedicationRepository from '../database/MedicationRepository';
const CHANNEL_ID = 'medication-reminders';
const MAX_SCHEDULE_DAYS = 30;
function parseDateOnly(value: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) {
        return null;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const result = new Date(year, month - 1, day, 12, 0, 0, 0);
    if (
        result.getFullYear() !== year ||
        result.getMonth() !== month - 1 ||
        result.getDate() !== day
    ) {
        return null;
    }
    return result;
}
function parseTime(value: string): {
    hour: number;
    minute: number;
} | null {
    const match = /^(\d{2}):(\d{2})$/.exec(value);
    if (!match) {
        return null;
    }
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return null;
    }
    return {
        hour,
        minute,
    };
}
function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function startOfToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}
function normalizeToStartOfDay(date: Date): Date {
    const normalized = new Date(date);

    normalized.setHours(0, 0, 0, 0);

    return normalized;
}
function getReminderTimes(medication: Medication): string[] {
    if (medication.reminderTimes) {
        try {
            const parsed = JSON.parse(medication.reminderTimes);
            if (Array.isArray(parsed)) {
                return parsed.filter(
                    (value): value is string => typeof value === 'string'
                );
            }
        } catch {
            // Fall back to the legacy reminderTime.
        }
    }
    return medication.reminderTime ? [medication.reminderTime] : [];
}
function usesDailyCadence(frequency?: string): boolean {
    return frequency !== 'Once' && frequency !== 'Weekly' && frequency !== 'As Needed';
}
function shouldScheduleDate(date: Date, startDate: Date, frequency: string): boolean {
    const differenceMs = date.getTime() - startDate.getTime();
    const differenceDays = Math.round(differenceMs / (24 * 60 * 60 * 1000));
    if (frequency === 'Once') {
        return differenceDays === 0;
    }
    if (frequency === 'Weekly') {
        return differenceDays >= 0 && differenceDays % 7 === 0;
    }
    return differenceDays >= 0;
}
export async function configureMedicationNotifications(): Promise<void> {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
            name: 'Medication reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'default',
        });
    }
}
export async function requestMedicationNotificationPermission(): Promise<boolean> {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) {
        return true;
    }
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
}
export async function cancelMedicationNotifications(
    notificationIds?: string
): Promise<void> {
    if (!notificationIds) {
        return;
    }
    let ids: string[] = [];
    try {
        const parsed = JSON.parse(notificationIds);
        if (Array.isArray(parsed)) {
            ids = parsed.filter((value): value is string => typeof value === 'string');
        }
    } catch {
        return;
    }
    await Promise.all(
        ids.map(async (id) => {
            try {
                await Notifications.cancelScheduledNotificationAsync(id);
            } catch (error) {
                console.warn('Unable to cancel medication notification:', error);
            }
        })
    );
}
export async function scheduleMedicationNotifications(
    medication: Medication
): Promise<string[]> {
    if (medication.remindersEnabled !== 1 || medication.frequency === 'As Needed') {
        return [];
    }
    const reminderTimes = getReminderTimes(medication);
    if (reminderTimes.length === 0) {
        return [];
    }
    const permissionGranted = await requestMedicationNotificationPermission();
    if (!permissionGranted) {
        return [];
    }
    const today = startOfToday();
    const parsedStart = medication.startDate ? parseDateOnly(medication.startDate) : null;

    const parsedEnd = medication.endDate ? parseDateOnly(medication.endDate) : null;

    const configuredStart = parsedStart ? normalizeToStartOfDay(parsedStart) : null;

    const configuredEnd = parsedEnd ? normalizeToStartOfDay(parsedEnd) : null;

    const originalStart = configuredStart ?? today;
    const doseText = [medication.dosage, medication.unit].filter(Boolean).join(' ');
    const content = (scheduledFor?: Date): Notifications.NotificationContentInput => ({
        title: '💊 Medication reminder',
        body: doseText
            ? `Give ${medication.medicine} — ${doseText}`
            : `Time to give ${medication.medicine}`,
        sound: 'default',
        data: {
            type: 'medication',
            medicationId: medication.id,
            medicine: medication.medicine,
            frequency: medication.frequency,
            reminderTimes: medication.reminderTimes,
            startDate: medication.startDate,
            endDate: medication.endDate,
            scheduledFor: scheduledFor?.toISOString(),
        },
    });
    const ids: string[] = [];
    /*
     * Long-running daily medication:
     * use one native repeating request
     * per configured reminder time.
     */
    if (
        usesDailyCadence(medication.frequency) &&
        (!configuredStart || configuredStart <= today) &&
        (!configuredEnd || configuredEnd >= today)
    ) {
        for (const time of reminderTimes) {
            const parsedTime = parseTime(time);
            if (!parsedTime) {
                continue;
            }
            const nextDate = new Date();
            nextDate.setHours(parsedTime.hour, parsedTime.minute, 0, 0);
            if (nextDate.getTime() <= Date.now()) {
                nextDate.setDate(nextDate.getDate() + 1);
            }
            const identifier = await Notifications.scheduleNotificationAsync({
                content: content(nextDate),
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: parsedTime.hour,
                    minute: parsedTime.minute,
                    channelId: CHANNEL_ID,
                },
            });
            ids.push(identifier);
        }
        return ids;
    }
    /*
     * Long-running weekly medication:
     * one native weekly request per time.
     */
    if (
        medication.frequency === 'Weekly' &&
        !configuredEnd &&
        (!configuredStart || configuredStart <= today)
    ) {
        // Expo weekdays:
        // Sunday = 1 ... Saturday = 7
        const weekday = originalStart.getDay() + 1;
        for (const time of reminderTimes) {
            const parsedTime = parseTime(time);
            if (!parsedTime) {
                continue;
            }
            const nextDate = new Date(today);
            const daysUntil = (weekday - (nextDate.getDay() + 1) + 7) % 7;
            nextDate.setDate(nextDate.getDate() + daysUntil);
            nextDate.setHours(parsedTime.hour, parsedTime.minute, 0, 0);
            if (nextDate.getTime() <= Date.now()) {
                nextDate.setDate(nextDate.getDate() + 7);
            }
            const identifier = await Notifications.scheduleNotificationAsync({
                content: content(nextDate),
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                    weekday,
                    hour: parsedTime.hour,
                    minute: parsedTime.minute,
                    channelId: CHANNEL_ID,
                },
            });
            ids.push(identifier);
        }
        return ids;
    }
    /*
     * One-time, finite-duration or
     * future-start medications still use
     * concrete dated notifications.
     */
    const scheduleStart =
        configuredStart && configuredStart > today ? configuredStart : today;
    const maximumEnd = addDays(today, MAX_SCHEDULE_DAYS);
    const scheduleEnd =
        configuredEnd && configuredEnd < maximumEnd ? configuredEnd : maximumEnd;
    for (
        let date = new Date(scheduleStart);
        date <= scheduleEnd;
        date = addDays(date, 1)
    ) {
        if (!shouldScheduleDate(date, originalStart, medication.frequency ?? 'Daily')) {
            continue;
        }
        for (const time of reminderTimes) {
            const parsedTime = parseTime(time);
            if (!parsedTime) {
                continue;
            }
            const triggerDate = new Date(date);
            triggerDate.setHours(parsedTime.hour, parsedTime.minute, 0, 0);
            if (triggerDate.getTime() <= Date.now()) {
                continue;
            }
            const identifier = await Notifications.scheduleNotificationAsync({
                content: content(triggerDate),
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: triggerDate,
                    channelId: CHANNEL_ID,
                },
            });
            ids.push(identifier);
        }
    }
    return ids;
}
export async function pauseAllMedicationNotifications(): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
        scheduled
            .filter((request) => request.content.data?.type === 'medication')
            .map((request) =>
                Notifications.cancelScheduledNotificationAsync(request.identifier)
            )
    );
    const repository = new MedicationRepository();
    await repository.clearAllNotificationIds();
}
export async function removeExpiredMedicationNotifications(): Promise<void> {
    const repository = new MedicationRepository();
    const medications = await repository.getReminderEnabled();
    const today = startOfToday();
    for (const medication of medications) {
        if (!medication.id || !medication.endDate) {
            continue;
        }
        const endDate = parseDateOnly(medication.endDate);
        if (!endDate || endDate >= today) {
            continue;
        }
        await cancelMedicationNotifications(medication.notificationIds);
        await repository.updateNotificationIds(medication.id, []);
    }
}
export interface RescheduleResult {
    medicationCount: number;
    notificationCount: number;
}
export async function rescheduleActiveMedicationNotifications(): Promise<RescheduleResult> {
    const repository = new MedicationRepository();
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
        scheduled
            .filter((request) => request.content.data?.type === 'medication')
            .map((request) =>
                Notifications.cancelScheduledNotificationAsync(request.identifier)
            )
    );
    await repository.clearAllNotificationIds();
    const medications = await repository.getReminderEnabled();
    let notificationCount = 0;
    let medicationCount = 0;
    for (const medication of medications) {
        if (!medication.id) {
            continue;
        }
        const ids = await scheduleMedicationNotifications(medication);
        await repository.updateNotificationIds(medication.id, ids);
        if (ids.length > 0) {
            medicationCount += 1;
            notificationCount += ids.length;
        }
    }
    return {
        medicationCount,
        notificationCount,
    };
}
