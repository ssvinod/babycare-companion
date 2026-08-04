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
    if (medication.remindersEnabled !== 1) {
        return [];
    }
    if (medication.frequency === 'As Needed') {
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
    const configuredStart = medication.startDate
        ? parseDateOnly(medication.startDate)
        : null;
    const scheduleStart =
        configuredStart && configuredStart > today ? configuredStart : today;
    const configuredEnd = medication.endDate ? parseDateOnly(medication.endDate) : null;
    const maximumEnd = addDays(today, MAX_SCHEDULE_DAYS);
    const scheduleEnd =
        configuredEnd && configuredEnd < maximumEnd ? configuredEnd : maximumEnd;
    const originalStart = configuredStart ?? today;
    const ids: string[] = [];
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
            const doseText = [medication.dosage, medication.unit]
                .filter(Boolean)
                .join(' ');
            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '💊 Medication reminder',
                    body: doseText
                        ? `Give ${medication.medicine} — ${doseText}`
                        : `Time to give ${medication.medicine}`,
                    sound: 'default',
                    data: {
                        type: 'medication',
                        medicationId: medication.id,
                        medicine: medication.medicine,
                        scheduledFor: triggerDate.toISOString(),
                    },
                },
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
    await Notifications.cancelAllScheduledNotificationsAsync();
    const repository = new MedicationRepository();
    await repository.clearAllNotificationIds();
}
export interface RescheduleResult {
    medicationCount: number;
    notificationCount: number;
}
export async function rescheduleActiveMedicationNotifications(): Promise<RescheduleResult> {
    const repository = new MedicationRepository();
    await Notifications.cancelAllScheduledNotificationsAsync();
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
