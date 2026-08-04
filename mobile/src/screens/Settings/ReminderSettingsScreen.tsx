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
export default function ReminderSettingsScreen() {
    const [permissionStatus, setPermissionStatus] =
        useState<PermissionState>('undetermined');
    const [scheduledCount, setScheduledCount] = useState(0);
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
                                Remove every currently scheduled notification
                            </Text>
                        </View>
                    </Pressable>
                    <View style={styles.noteCard}>
                        <Text style={styles.noteTitle}>Important</Text>
                        <Text style={styles.noteText}>
                            Cancelling scheduled notifications does not delete medication
                            records. Editing or saving a medication may schedule reminders
                            again.
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
});
