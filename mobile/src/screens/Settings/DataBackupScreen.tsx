import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import {
    exportNivaBackup,
    pickBackupFile,
    readBackup,
    restoreNivaBackup,
    NivaBackup,
} from '../../services/BackupService';
import { useBabyStore } from '../../store/BabyStore';
import { useDashboardStore } from '../../store/DashboardStore';
import { rescheduleActiveMedicationNotifications } from '../../services/MedicationNotificationService';
import { exportHealthReport } from '../../services/HealthReportService';
export default function DataBackupScreen() {
    const [exporting, setExporting] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);
    const loadBaby = useBabyStore((state) => state.loadBaby);
    const refreshDashboard = useDashboardStore((state) => state.refresh);
    async function exportBackup() {
        try {
            setExporting(true);
            const result = await exportNivaBackup();
            Alert.alert(
                'Backup Ready',
                [
                    `${result.recordCount} records were included.`,
                    '',
                    `File: ${result.fileName}`,
                    '',
                    'Save the file somewhere safe, such as iCloud Drive, Google Drive or Files.',
                ].join('\n')
            );
        } catch (error) {
            console.error('Unable to export backup:', error);
            const message = error instanceof Error ? error.message : '';
            if (message === 'NO_PROFILE') {
                Alert.alert(
                    'Nothing to back up',
                    'Create a baby profile before exporting a backup.'
                );
                return;
            }
            if (message === 'SHARING_UNAVAILABLE') {
                Alert.alert(
                    'Sharing unavailable',
                    'This device cannot currently open the file-sharing menu.'
                );
                return;
            }
            Alert.alert(
                'Backup failed',
                'Niva could not create the backup file. Please try again.'
            );
        } finally {
            setExporting(false);
        }
    }
    async function createHealthReport() {
        try {
            setGeneratingReport(true);
            await exportHealthReport();
            Alert.alert(
                'Health Report Ready',
                'The PDF was created successfully. Save or share it from the share sheet.'
            );
        } catch (error) {
            console.error('Unable to create health report:', error);
            const message = error instanceof Error ? error.message : '';
            if (message === 'NO_PROFILE') {
                Alert.alert(
                    'Nothing to report',
                    'Create a baby profile before generating a health report.'
                );
                return;
            }
            Alert.alert('Report Failed', 'Niva could not create the PDF health report.');
        } finally {
            setGeneratingReport(false);
        }
    }
    async function chooseBackup() {
        try {
            setRestoring(true);
            const asset = await pickBackupFile();
            if (!asset) {
                return;
            }
            const backup = await readBackup(asset.uri);
            confirmRestore(backup);
        } catch (error) {
            console.error('Unable to read backup:', error);
            const message = error instanceof Error ? error.message : '';
            if (message === 'INVALID_JSON' || message === 'INVALID_BACKUP') {
                Alert.alert(
                    'Invalid Backup',
                    'The selected file is not a valid Niva backup.'
                );
                return;
            }
            Alert.alert(
                'Unable to Read Backup',
                'Niva could not open the selected backup file.'
            );
        } finally {
            setRestoring(false);
        }
    }
    function confirmRestore(backup: NivaBackup) {
        const exportedDate = new Date(backup.exportedAt);
        const displayDate = Number.isNaN(exportedDate.getTime())
            ? backup.exportedAt
            : exportedDate.toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
              });
        Alert.alert(
            'Replace Current Data?',
            [
                `Backup created: ${displayDate}`,
                '',
                'Restoring will permanently replace the current baby profile and every locally stored care record.',
                '',
                'This action cannot be undone unless you export the current data first.',
            ].join('\n'),
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Restore Backup',
                    style: 'destructive',
                    onPress: () => {
                        void performRestore(backup);
                    },
                },
            ]
        );
    }
    async function performRestore(backup: NivaBackup) {
        try {
            setRestoring(true);
            const result = await restoreNivaBackup(backup);
            await loadBaby();
            await refreshDashboard();
            let scheduledCount = 0;
            try {
                const notificationResult =
                    await rescheduleActiveMedicationNotifications();
                scheduledCount = notificationResult.notificationCount;
            } catch (error) {
                console.warn(
                    'Backup restored, but medication reminders could not be rescheduled:',
                    error
                );
            }
            Alert.alert(
                'Restore Complete',
                [
                    `${result.total} records restored.`,
                    '',
                    `Profile: ${result.profile}`,
                    `Feeds: ${result.feeding}`,
                    `Sleep: ${result.sleep}`,
                    `Growth: ${result.growth}`,
                    `Vaccinations: ${result.vaccination}`,
                    `Medications: ${result.medication}`,
                    `Dose history: ${result.medicationDose}`,
                    '',
                    `${scheduledCount} medication notifications scheduled.`,
                    '',
                    'The profile photo was not included in backup version 1.',
                ].join('\n')
            );
        } catch (error) {
            console.error('Unable to restore backup:', error);
            Alert.alert(
                'Restore Failed',
                'No partial restore was kept. Your previous database contents remain unchanged.'
            );
        } finally {
            setRestoring(false);
        }
    }
    return (
        <ScreenLayout>
            <ScreenTitle title="Data & Backup" icon="💾" />
            <View style={styles.introCard}>
                <Text style={styles.introTitle}>Keep your records safe</Text>
                <Text style={styles.introText}>
                    Export a portable JSON copy of the baby profile and all locally stored
                    care records.
                </Text>
            </View>
            <Text style={styles.sectionTitle}>Export</Text>
            <View style={styles.exportCard}>
                <View style={styles.exportHeader}>
                    <View style={styles.exportIcon}>
                        <Text style={styles.exportIconText}>📤</Text>
                    </View>
                    <View style={styles.exportText}>
                        <Text style={styles.exportTitle}>Export Niva Backup</Text>
                        <Text style={styles.exportSubtitle}>
                            Profile, feeding, sleep, growth, vaccination, medication and
                            dose records
                        </Text>
                    </View>
                </View>
                <Pressable
                    disabled={exporting}
                    onPress={() => {
                        void exportBackup();
                    }}
                    style={({ pressed }) => [
                        styles.exportButton,
                        pressed && styles.exportButtonPressed,
                        exporting && styles.exportButtonDisabled,
                    ]}
                >
                    {exporting ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.exportButtonText}>Create & Share Backup</Text>
                    )}
                </Pressable>
            </View>
            <Text style={styles.sectionTitle}>Health Report</Text>
            <View style={styles.exportCard}>
                <View style={styles.exportHeader}>
                    <View style={styles.reportIcon}>
                        <Text style={styles.exportIconText}>📄</Text>
                    </View>
                    <View style={styles.exportText}>
                        <Text style={styles.exportTitle}>Pediatric Health Report</Text>
                        <Text style={styles.exportSubtitle}>
                            Create a shareable PDF with growth, vaccinations, medications,
                            feeding and sleep records
                        </Text>
                    </View>
                </View>
                <Pressable
                    disabled={generatingReport}
                    onPress={() => {
                        void createHealthReport();
                    }}
                    style={({ pressed }) => [
                        styles.reportButton,
                        pressed && styles.exportButtonPressed,
                        generatingReport && styles.exportButtonDisabled,
                    ]}
                >
                    {generatingReport ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.exportButtonText}>Create & Share PDF</Text>
                    )}
                </Pressable>
            </View>
            <View style={styles.contentsCard}>
                <Text style={styles.contentsTitle}>Included in this backup</Text>
                <Text style={styles.contentsText}>
                    👶 Baby profile{'\n'}
                    🍼 Feeding history{'\n'}
                    😴 Sleep history{'\n'}
                    📈 Growth records{'\n'}
                    💉 Vaccination records{'\n'}
                    💊 Medications and dose history
                </Text>
            </View>
            <View style={styles.noticeCard}>
                <Text style={styles.noticeTitle}>Profile photo</Text>
                <Text style={styles.noticeText}>
                    The profile photo is not included yet because it is stored as a
                    private local image file. Photo backup will be added with the restore
                    feature.
                </Text>
            </View>
            <Text style={styles.sectionTitle}>Restore</Text>
            <View style={styles.restoreCard}>
                <Text style={styles.restoreTitle}>Restore from Backup</Text>
                <Text style={styles.restoreText}>
                    Select a Niva backup file. After confirmation, the current profile and
                    all care records will be replaced.
                </Text>
                <Pressable
                    disabled={restoring}
                    onPress={() => {
                        void chooseBackup();
                    }}
                    style={({ pressed }) => [
                        styles.exportButton,
                        pressed && styles.exportButtonPressed,
                        restoring && styles.exportButtonDisabled,
                    ]}
                >
                    {restoring ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.exportButtonText}>Choose Backup File</Text>
                    )}
                </Pressable>
            </View>
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
    sectionTitle: {
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 3,
        fontSize: 15,
        fontWeight: '900',
        color: '#374151',
    },
    exportCard: {
        marginBottom: 18,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    exportHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    exportIcon: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
        borderRadius: 15,
        backgroundColor: '#D1FAE5',
    },
    exportIconText: {
        fontSize: 22,
    },
    exportText: {
        flex: 1,
    },
    exportTitle: {
        fontSize: 15,
        fontWeight: '900',
        color: '#111827',
    },
    exportSubtitle: {
        marginTop: 4,
        fontSize: 12,
        lineHeight: 18,
        color: '#6B7280',
    },
    exportButton: {
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        borderRadius: 14,
        backgroundColor: '#059669',
    },
    exportButtonPressed: {
        opacity: 0.82,
    },
    exportButtonDisabled: {
        opacity: 0.55,
    },
    exportButtonText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    contentsCard: {
        marginBottom: 16,
        borderRadius: 17,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    contentsTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#111827',
    },
    contentsText: {
        marginTop: 10,
        fontSize: 13,
        lineHeight: 24,
        color: '#4B5563',
    },
    noticeCard: {
        marginBottom: 20,
        borderRadius: 16,
        backgroundColor: '#FFF7ED',
        padding: 16,
    },
    noticeTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#9A3412',
    },
    noticeText: {
        marginTop: 6,
        fontSize: 13,
        lineHeight: 19,
        color: '#C2410C',
    },
    restoreCard: {
        marginBottom: 22,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 17,
        backgroundColor: '#F9FAFB',
        padding: 16,
    },
    restoreTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#6B7280',
    },
    restoreText: {
        marginTop: 6,
        fontSize: 13,
        lineHeight: 19,
        color: '#9CA3AF',
    },
    reportIcon: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
        borderRadius: 15,
        backgroundColor: '#E0E7FF',
    },
    reportButton: {
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        borderRadius: 14,
        backgroundColor: '#4F46E5',
    },
});
