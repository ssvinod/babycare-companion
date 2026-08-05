import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import {
    pauseAllMedicationNotifications,
    rescheduleActiveMedicationNotifications,
} from '../../services/MedicationNotificationService';
type PermissionState = 'granted' | 'denied' | 'undetermined';
interface MedicationReminderSummary {
    key: string;
    medicationId: number;
    medicine: string;
    count: number;
    nextReminder: Date | null;
}
function permissionLabel(status: PermissionState): string {
    if (status === 'granted') {
        return 'Allowed';
    }
    if (status === 'denied') {
        return 'Not Allowed';
    }
    return 'Not Requested';
}
function permissionIcon(status: PermissionState): string {
    if (status === 'granted') {
        return '✅';
    }
    if (status === 'denied') {
        return '⚠️';
    }
    return '🔔';
}
function getTriggerDate(notification: Notifications.NotificationRequest): Date | null {
    const scheduledFor = notification.content.data?.scheduledFor;
    if (typeof scheduledFor === 'string') {
        const storedDate = new Date(scheduledFor);
        if (!Number.isNaN(storedDate.getTime())) {
            return storedDate;
        }
    }
    const trigger = notification.trigger as {
        value?: unknown;
        date?: unknown;
    } | null;
    const rawValue = trigger?.value ?? trigger?.date;
    if (rawValue instanceof Date) {
        return Number.isNaN(rawValue.getTime()) ? null : rawValue;
    }
    if (typeof rawValue === 'number' || typeof rawValue === 'string') {
        const fallbackDate = new Date(rawValue);
        if (!Number.isNaN(fallbackDate.getTime())) {
            return fallbackDate;
        }
    }
    return null;
}
function getMedicineName(notification: Notifications.NotificationRequest): string {
    const storedMedicine = notification.content.data?.medicine;
    if (typeof storedMedicine === 'string' && storedMedicine.trim()) {
        return storedMedicine.trim();
    }
    const body = notification.content.body ?? '';
    const giveMatch = /^Give (.+?) —/.exec(body);
    if (giveMatch?.[1]) {
        return giveMatch[1];
    }
    const timeMatch = /^Time to give (.+)$/.exec(body);
    if (timeMatch?.[1]) {
        return timeMatch[1];
    }
    return 'Medication';
}
function buildMedicationSummaries(
    notifications: Notifications.NotificationRequest[]
): MedicationReminderSummary[] {
    const grouped = new Map<string, MedicationReminderSummary>();
    for (const notification of notifications) {
        const rawMedicationId = notification.content.data?.medicationId;
        const medicationId = Number(rawMedicationId);
        if (!Number.isFinite(medicationId)) {
            continue;
        }
        const medicine = getMedicineName(notification);
        /*
         * Include the medicine name in the
         * grouping key. This prevents restored
         * or stale notification IDs from mixing
         * reminders belonging to different
         * medications.
         */
        const key = `${medicationId}:${medicine}`;
        const triggerDate = getTriggerDate(notification);
        const existing = grouped.get(key);
        if (existing) {
            existing.count += 1;
            if (
                triggerDate &&
                (!existing.nextReminder ||
                    triggerDate.getTime() < existing.nextReminder.getTime())
            ) {
                existing.nextReminder = triggerDate;
            }
            continue;
        }
        grouped.set(key, {
            key,
            medicationId,
            medicine,
            count: 1,
            nextReminder: triggerDate,
        });
    }
    return Array.from(grouped.values()).sort((first, second) => {
        if (!first.nextReminder && !second.nextReminder) {
            return first.medicine.localeCompare(second.medicine);
        }
        if (!first.nextReminder) {
            return 1;
        }
        if (!second.nextReminder) {
            return -1;
        }
        return first.nextReminder.getTime() - second.nextReminder.getTime();
    });
}
function formatReminderDate(date: Date | null): string {
    if (!date) {
        return 'Upcoming time unavailable';
    }
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
export default function ReminderSettingsScreen() {
    const [permissionStatus, setPermissionStatus] =
        useState<PermissionState>('undetermined');
    const [scheduledCount, setScheduledCount] = useState(0);
    const [medicationSummaries, setMedicationSummaries] = useState<
        MedicationReminderSummary[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const loadStatus = useCallback(async () => {
        try {
            setLoading(true);
            const permission = await Notifications.getPermissionsAsync();
            const scheduled = await Notifications.getAllScheduledNotificationsAsync();
            setPermissionStatus(
                permission.granted
                    ? 'granted'
                    : permission.status === 'denied'
                      ? 'denied'
                      : 'undetermined'
            );
            setScheduledCount(scheduled.length);
            setMedicationSummaries(buildMedicationSummaries(scheduled));
        } catch (error) {
            console.error('Unable to load notification settings:', error);
            Alert.alert(
                'Unable to load reminders',
                'Notification settings could not be loaded.'
            );
        } finally {
            setLoading(false);
        }
    }, []);
    useFocusEffect(
        useCallback(() => {
            void loadStatus();
        }, [loadStatus])
    );
    async function requestPermission() {
        try {
            setUpdating(true);
            const permission = await Notifications.requestPermissionsAsync();
            setPermissionStatus(
                permission.granted
                    ? 'granted'
                    : permission.status === 'denied'
                      ? 'denied'
                      : 'undetermined'
            );
            if (!permission.granted) {
                Alert.alert(
                    'Notifications not enabled',
                    'You can enable notifications later from your device settings.'
                );
            }
        } catch (error) {
            console.error('Unable to request notification permission:', error);
            Alert.alert(
                'Unable to update permission',
                'Notification permission could not be updated.'
            );
        } finally {
            setUpdating(false);
        }
    }
    async function openDeviceSettings() {
        try {
            await Linking.openSettings();
        } catch (error) {
            console.error('Unable to open device settings:', error);
            Alert.alert(
                'Unable to open settings',
                'Open the Settings app manually and select Niva.'
            );
        }
    }
    async function rescheduleReminders() {
        try {
            setUpdating(true);
            const result = await rescheduleActiveMedicationNotifications();
            await loadStatus();
            if (result.notificationCount === 0) {
                Alert.alert(
                    'No reminders scheduled',
                    'No active medications with future reminder times were found.'
                );
                return;
            }
            Alert.alert(
                'Reminders scheduled',
                [
                    `${result.notificationCount} notifications scheduled`,
                    '',
                    `Across ${result.medicationCount} active ${
                        result.medicationCount === 1 ? 'medication' : 'medications'
                    }.`,
                    '',
                    'Niva schedules a rolling window of upcoming reminders.',
                ].join('\n')
            );
        } catch (error) {
            console.error('Unable to reschedule reminders:', error);
            Alert.alert(
                'Unable to schedule reminders',
                'Active medication reminders could not be scheduled.'
            );
        } finally {
            setUpdating(false);
        }
    }
    function confirmCancelAll() {
        if (scheduledCount === 0) {
            Alert.alert(
                'No scheduled reminders',
                'There are currently no scheduled notifications to cancel.'
            );
            return;
        }
        Alert.alert(
            'Pause All Notifications?',
            [
                'This pauses every currently scheduled Niva notification.',
                '',
                'Medication records such as Vitamin D will remain saved.',
                '',
                'Use Reschedule Active Medications to start notifications again.',
            ].join('\n'),
            [
                {
                    text: 'Keep Reminders',
                    style: 'cancel',
                },
                {
                    text: 'Pause All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setUpdating(true);
                            await pauseAllMedicationNotifications();
                            setScheduledCount(0);
                            setMedicationSummaries([]);
                            Alert.alert(
                                'Notifications paused',
                                'Medication records remain saved. No reminders will fire until they are rescheduled.'
                            );
                        } catch (error) {
                            console.error('Unable to cancel reminders:', error);
                            Alert.alert(
                                'Unable to cancel reminders',
                                'Scheduled notifications could not be removed.'
                            );
                        } finally {
                            setUpdating(false);
                        }
                    },
                },
            ]
        );
    }
    return (
        <ScreenLayout>
            <ScreenTitle title="Reminder Settings" icon="🔔" />
            <View style={styles.introCard}>
                <Text style={styles.introTitle}>Stay on schedule</Text>
                <Text style={styles.introText}>
                    Review notification access and scheduled reminders for medication and
                    vaccinations.
                </Text>
            </View>
            {loading ? (
                <View style={styles.loadingCard}>
                    <ActivityIndicator color="#079669" />
                    <Text style={styles.loadingText}>Checking reminder settings...</Text>
                </View>
            ) : (
                <>
                    <Text style={styles.sectionTitle}>Notification Access</Text>
                    <View style={styles.statusCard}>
                        <View style={styles.statusIcon}>
                            <Text style={styles.statusIconText}>
                                {permissionIcon(permissionStatus)}
                            </Text>
                        </View>
                        <View style={styles.statusContent}>
                            <Text style={styles.statusTitle}>Notifications</Text>
                            <Text
                                style={[
                                    styles.statusValue,
                                    permissionStatus === 'granted' &&
                                        styles.statusGranted,
                                    permissionStatus === 'denied' && styles.statusDenied,
                                ]}
                            >
                                {permissionLabel(permissionStatus)}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.sectionTitle}>Scheduled Reminders</Text>
                    <View style={styles.countCard}>
                        <Text style={styles.countValue}>{scheduledCount}</Text>
                        <Text style={styles.countLabel}>
                            {scheduledCount === 1
                                ? 'notification scheduled'
                                : 'notifications scheduled'}
                        </Text>
                    </View>
                    {medicationSummaries.length > 0 ? (
                        <View style={styles.reminderList}>
                            {medicationSummaries.map((summary, index) => (
                                <View
                                    key={summary.key}
                                    style={[
                                        styles.reminderItem,
                                        index === medicationSummaries.length - 1 &&
                                            styles.reminderItemLast,
                                    ]}
                                >
                                    <View style={styles.reminderIcon}>
                                        <Text style={styles.reminderIconText}>💊</Text>
                                    </View>
                                    <View style={styles.reminderContent}>
                                        <Text style={styles.reminderMedicine}>
                                            {summary.medicine}
                                        </Text>
                                        <Text style={styles.reminderNext}>
                                            Next:{' '}
                                            {formatReminderDate(summary.nextReminder)}
                                        </Text>
                                    </View>
                                    <View style={styles.reminderCountBadge}>
                                        <Text style={styles.reminderCountText}>
                                            {summary.count}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyReminderCard}>
                            <Text style={styles.emptyReminderTitle}>
                                No active notifications
                            </Text>
                            <Text style={styles.emptyReminderText}>
                                Medication records may still exist. Use Reschedule Active
                                Medications to recreate notifications.
                            </Text>
                        </View>
                    )}
                    <Text style={styles.sectionTitle}>Actions</Text>
                    {permissionStatus !== 'granted' ? (
                        <Pressable
                            disabled={updating}
                            onPress={() => {
                                void requestPermission();
                            }}
                            style={({ pressed }) => [
                                styles.actionRow,
                                pressed && styles.actionRowPressed,
                                updating && styles.actionDisabled,
                            ]}
                        >
                            <View style={styles.actionIcon}>
                                <Text style={styles.actionIconText}>🔔</Text>
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={styles.actionTitle}>
                                    Allow Notifications
                                </Text>
                                <Text style={styles.actionSubtitle}>
                                    Enable reminders for medications and vaccinations
                                </Text>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </Pressable>
                    ) : null}
                    <Pressable
                        disabled={updating}
                        onPress={() => {
                            void openDeviceSettings();
                        }}
                        style={({ pressed }) => [
                            styles.actionRow,
                            pressed && styles.actionRowPressed,
                            updating && styles.actionDisabled,
                        ]}
                    >
                        <View style={styles.actionIcon}>
                            <Text style={styles.actionIconText}>⚙️</Text>
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Open Device Settings</Text>
                            <Text style={styles.actionSubtitle}>
                                Manage alerts, sounds and notification access
                            </Text>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                    </Pressable>
                    <Pressable
                        disabled={updating}
                        onPress={() => {
                            void loadStatus();
                        }}
                        style={({ pressed }) => [
                            styles.actionRow,
                            pressed && styles.actionRowPressed,
                            updating && styles.actionDisabled,
                        ]}
                    >
                        <View style={styles.actionIcon}>
                            <Text style={styles.actionIconText}>🔄</Text>
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Refresh Status</Text>
                            <Text style={styles.actionSubtitle}>
                                Recheck permission and scheduled notification count
                            </Text>
                        </View>
                        {updating ? (
                            <ActivityIndicator size="small" color="#079669" />
                        ) : (
                            <Text style={styles.chevron}>›</Text>
                        )}
                    </Pressable>
                    <Pressable
                        disabled={updating || permissionStatus !== 'granted'}
                        onPress={() => {
                            void rescheduleReminders();
                        }}
                        style={({ pressed }) => [
                            styles.actionRow,
                            pressed && styles.actionRowPressed,
                            (updating || permissionStatus !== 'granted') &&
                                styles.actionDisabled,
                        ]}
                    >
                        <View style={styles.actionIcon}>
                            <Text style={styles.actionIconText}>⏰</Text>
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>
                                Reschedule Active Medications
                            </Text>
                            <Text style={styles.actionSubtitle}>
                                Recreate upcoming notifications for enabled medications
                            </Text>
                        </View>
                        {updating ? (
                            <ActivityIndicator size="small" color="#079669" />
                        ) : (
                            <Text style={styles.chevron}>›</Text>
                        )}
                    </Pressable>
                    <Pressable
                        disabled={updating || scheduledCount === 0}
                        onPress={confirmCancelAll}
                        style={({ pressed }) => [
                            styles.cancelRow,
                            pressed && styles.cancelRowPressed,
                            (updating || scheduledCount === 0) && styles.actionDisabled,
                        ]}
                    >
                        <View style={styles.cancelIcon}>
                            <Text style={styles.actionIconText}>🗑️</Text>
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.cancelTitle}>
                                Pause All Notifications
                            </Text>
                            <Text style={styles.cancelSubtitle}>
                                Stop notifications without deleting medication records
                            </Text>
                        </View>
                    </Pressable>
                    <View style={styles.noteCard}>
                        <Text style={styles.noteTitle}>Important</Text>
                        <Text style={styles.noteText}>
                            Niva schedules a rolling window of upcoming medication
                            notifications. Pausing them does not delete medication
                            records. Use Reschedule Active Medications to restore
                            notifications.
                        </Text>
                    </View>
                </>
            )}
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    introCard: {
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: '#ECFDF5',
        padding: 18,
    },
    introTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#065F46',
    },
    introText: {
        marginTop: 7,
        fontSize: 14,
        lineHeight: 21,
        color: '#047857',
    },
    loadingCard: {
        alignItems: 'center',
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingVertical: 28,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 13,
        color: '#6B7280',
    },
    sectionTitle: {
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 3,
        fontSize: 15,
        fontWeight: '900',
        color: '#374151',
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 17,
        backgroundColor: '#FFFFFF',
        padding: 15,
    },
    statusIcon: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
        borderRadius: 14,
        backgroundColor: '#ECFDF5',
    },
    statusIconText: {
        fontSize: 21,
    },
    statusContent: {
        flex: 1,
    },
    statusTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
    },
    statusValue: {
        marginTop: 3,
        fontSize: 13,
        fontWeight: '800',
        color: '#6B7280',
    },
    statusGranted: {
        color: '#059669',
    },
    statusDenied: {
        color: '#DC2626',
    },
    countCard: {
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingVertical: 22,
    },
    countValue: {
        fontSize: 34,
        fontWeight: '900',
        color: '#079669',
    },
    countLabel: {
        marginTop: 4,
        fontSize: 13,
        color: '#6B7280',
    },
    actionRow: {
        minHeight: 68,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    actionRowPressed: {
        backgroundColor: '#F9FAFB',
    },
    actionDisabled: {
        opacity: 0.5,
    },
    actionIcon: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderRadius: 13,
        backgroundColor: '#ECFDF5',
    },
    actionIconText: {
        fontSize: 19,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#111827',
    },
    actionSubtitle: {
        marginTop: 3,
        fontSize: 12,
        lineHeight: 17,
        color: '#6B7280',
    },
    chevron: {
        marginLeft: 10,
        fontSize: 25,
        color: '#9CA3AF',
    },
    cancelRow: {
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    cancelRowPressed: {
        backgroundColor: '#FEF2F2',
    },
    cancelIcon: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderRadius: 13,
        backgroundColor: '#FEF2F2',
    },
    cancelTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#B91C1C',
    },
    cancelSubtitle: {
        marginTop: 3,
        fontSize: 12,
        lineHeight: 17,
        color: '#991B1B',
    },
    noteCard: {
        marginBottom: 20,
        borderRadius: 16,
        backgroundColor: '#EEF2FF',
        padding: 16,
    },
    noteTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#4338CA',
    },
    noteText: {
        marginTop: 6,
        fontSize: 13,
        lineHeight: 19,
        color: '#4F46E5',
    },
    reminderList: {
        marginBottom: 20,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
    },
    reminderItem: {
        minHeight: 72,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 11,
    },
    reminderItemLast: {
        borderBottomWidth: 0,
    },
    reminderIcon: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderRadius: 13,
        backgroundColor: '#FCE7F3',
    },
    reminderIconText: {
        fontSize: 20,
    },
    reminderContent: {
        flex: 1,
        marginRight: 10,
    },
    reminderMedicine: {
        fontSize: 14,
        fontWeight: '900',
        color: '#111827',
    },
    reminderNext: {
        marginTop: 4,
        fontSize: 12,
        lineHeight: 17,
        color: '#6B7280',
    },
    reminderCountBadge: {
        minWidth: 34,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 9,
    },
    reminderCountText: {
        fontSize: 13,
        fontWeight: '900',
        color: '#047857',
    },
    emptyReminderCard: {
        marginBottom: 20,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    emptyReminderTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#374151',
    },
    emptyReminderText: {
        marginTop: 5,
        fontSize: 12,
        lineHeight: 18,
        color: '#6B7280',
    },
});
