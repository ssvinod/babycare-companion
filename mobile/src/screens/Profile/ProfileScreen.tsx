import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import ProfileRow from '../../components/profile/ProfileRow';
import { useBabyStore } from '../../store/BabyStore';
import { calculateAge } from '../../utils/calculateAge';
function displayDate(isoDate: string): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
    if (!match) {
        return isoDate;
    }
    const [, year, month, day] = match;
    return `${day}-${month}-${year}`;
}
function displayGender(gender: string): string {
    const normalized = gender.toLowerCase();
    if (normalized === 'boy') {
        return 'Boy';
    }
    if (normalized === 'girl') {
        return 'Girl';
    }
    return gender;
}
interface DetailRowProps {
    label: string;
    value: string;
    isLast?: boolean;
}
function DetailRow({ label, value, isLast = false }: DetailRowProps) {
    return (
        <View style={[styles.detailRow, isLast && styles.detailRowLast]}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
}
export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const baby = useBabyStore((state) => state.baby);
    const deleteBabyProfile = useBabyStore((state) => state.deleteBabyProfile);
    const [deleting, setDeleting] = useState(false);
    if (!baby) {
        return null;
    }
    function showPrivacyInfo() {
        Alert.alert(
            'Privacy & Local Storage',
            [
                'Niva stores baby profiles and care records locally on this device.',
                '',
                'The app does not currently require an account or automatically upload baby data to a cloud service.',
                '',
                'Removing the baby profile permanently deletes the locally stored profile, feeding, sleep, growth, medication and vaccination records.',
                '',
                "Device backups may still include application data depending on your phone's backup settings.",
            ].join('\n'),
            [
                {
                    text: 'Close',
                    style: 'default',
                },
            ]
        );
    }
    function confirmDelete() {
        Alert.alert(
            'Remove Baby Profile?',
            [
                'This permanently removes:',
                '',
                '• Baby profile',
                '• Feeding history',
                '• Sleep history',
                '• Growth records',
                '• Medications and dose history',
                '• Vaccination records',
                '',
                'This action cannot be undone.',
            ].join('\n'),
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove Everything',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setDeleting(true);
                            await deleteBabyProfile();
                        } catch (error) {
                            console.error('Unable to remove baby profile:', error);
                            Alert.alert(
                                'Unable to remove profile',
                                'The profile and records could not be removed. Please try again.'
                            );
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    }
    const avatar = baby.gender.toLowerCase() === 'boy' ? '👦' : '👧';
    return (
        <ScreenLayout>
            <ScreenTitle title="Profile" icon="👶" />
            <View style={styles.identityCard}>
                <View style={styles.identityHeader}>
                    <Pressable
                        onPress={() => navigation.navigate('EditBabyProfile')}
                        style={({ pressed }) => [
                            styles.avatar,
                            pressed && {
                                opacity: 0.8,
                            },
                        ]}
                    >
                        {baby.photo ? (
                            <Image
                                source={{
                                    uri: baby.photo,
                                }}
                                style={styles.avatarPhoto}
                            />
                        ) : (
                            <Text style={styles.avatarText}>{avatar}</Text>
                        )}
                        <View style={styles.smallCameraBadge}>
                            <Text style={styles.smallCameraIcon}>📷</Text>
                        </View>
                    </Pressable>
                    <View style={styles.identityHeaderText}>
                        <Text style={styles.name}>{baby.name}</Text>
                        <Text style={styles.age}>{calculateAge(baby.birthDate)}</Text>
                        <View style={styles.genderBadge}>
                            <Text style={styles.genderBadgeText}>
                                {displayGender(baby.gender)}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.identityDivider} />
                <DetailRow label="Date of Birth" value={displayDate(baby.birthDate)} />
                <DetailRow
                    label="Blood Group"
                    value={baby.bloodGroup || 'Not added'}
                    isLast
                />
            </View>
            <View style={styles.missionCard}>
                <Text style={styles.missionLabel}>OUR MISSION</Text>
                <Text style={styles.missionText}>
                    Helping parents keep every important health record, milestone, and
                    vaccination in one trusted place—from birth through childhood.
                </Text>
            </View>
            <Text style={styles.sectionTitle}>Baby & Health</Text>
            <View style={styles.rowGroup}>
                <ProfileRow
                    icon="✏️"
                    title="Edit Baby Profile"
                    subtitle="Update name, birth date, gender and health details"
                    onPress={() => navigation.navigate('EditBabyProfile')}
                />
                <ProfileRow
                    icon="📈"
                    title="Growth History"
                    subtitle="View measurements, charts and check-up history"
                    onPress={() => navigation.navigate('GrowthHistory')}
                />
                <ProfileRow
                    icon="🔔"
                    title="Reminder Settings"
                    subtitle="Permissions and scheduled notification status"
                    onPress={() => {
                        const parent = navigation.getParent();
                        if (parent) {
                            parent.navigate('ReminderSettings');
                            return;
                        }
                        navigation.navigate('ReminderSettings');
                    }}
                />
            </View>
            <Text style={styles.sectionTitle}>Data</Text>
            <View style={styles.rowGroup}>
                <ProfileRow
                    icon="📤"
                    title="Export Data"
                    subtitle="Coming soon"
                    disabled
                    showArrow={false}
                />
                <ProfileRow
                    icon="💾"
                    title="Backup & Restore"
                    subtitle="Coming soon"
                    disabled
                    showArrow={false}
                />
            </View>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.rowGroup}>
                <ProfileRow
                    icon="🔒"
                    title="Privacy"
                    subtitle="How your baby's information is stored"
                    onPress={showPrivacyInfo}
                />
                <ProfileRow
                    icon="❓"
                    title="Help & FAQ"
                    subtitle="Guidance, permissions and common questions"
                    onPress={() => {
                        const parent = navigation.getParent();
                        if (parent) {
                            parent.navigate('Help');
                            return;
                        }
                        navigation.navigate('Help');
                    }}
                />
                <ProfileRow
                    icon="ℹ️"
                    title="About Niva"
                    subtitle="Mission, privacy and app information"
                    onPress={() => {
                        const parent = navigation.getParent();
                        if (parent) {
                            parent.navigate('About');
                            return;
                        }
                        navigation.navigate('About');
                    }}
                />
            </View>
            <Text style={[styles.sectionTitle, styles.dangerSectionTitle]}>
                Danger Zone
            </Text>
            <Pressable
                disabled={deleting}
                onPress={confirmDelete}
                style={({ pressed }) => [
                    styles.deleteRow,
                    pressed && styles.deleteRowPressed,
                    deleting && styles.deleteRowDisabled,
                ]}
            >
                <View style={styles.deleteLeft}>
                    <View style={styles.deleteIconContainer}>
                        <Text style={styles.deleteIcon}>🗑️</Text>
                    </View>
                    <View style={styles.deleteTextContainer}>
                        <Text style={styles.deleteTitle}>Remove Baby Profile</Text>
                        <Text style={styles.deleteSubtitle} numberOfLines={1}>
                            Delete profile and all local records
                        </Text>
                    </View>
                </View>
                {deleting ? (
                    <ActivityIndicator size="small" color="#DC2626" />
                ) : (
                    <Text style={styles.deleteChevron}>›</Text>
                )}
            </Pressable>
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    identityCard: {
        marginBottom: 16,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    identityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
    },
    identityHeaderText: {
        flex: 1,
        marginLeft: 14,
        alignItems: 'flex-start',
    },
    identityDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    avatar: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 23,
        backgroundColor: '#E0E7FF',
    },
    avatarPhoto: {
        width: 70,
        height: 70,
        borderRadius: 23,
    },
    smallCameraBadge: {
        position: 'absolute',
        right: -3,
        bottom: -3,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        backgroundColor: '#079669',
    },
    smallCameraIcon: {
        fontSize: 10,
    },
    avatarText: {
        fontSize: 38,
    },
    name: {
        fontSize: 23,
        fontWeight: '900',
        color: '#111827',
    },
    age: {
        marginTop: 4,
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    genderBadge: {
        marginTop: 8,
        borderRadius: 999,
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    genderBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#4338CA',
    },
    detailRow: {
        minHeight: 51,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    detailRowLast: {
        borderBottomWidth: 0,
    },
    detailLabel: {
        flex: 1,
        marginRight: 16,
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
    detailValue: {
        flex: 1,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
    },
    missionCard: {
        marginBottom: 20,
        borderRadius: 18,
        backgroundColor: '#EEF2FF',
        padding: 17,
    },
    missionLabel: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1,
        color: '#4F46E5',
    },
    missionText: {
        marginTop: 7,
        fontSize: 14,
        lineHeight: 21,
        color: '#374151',
    },
    sectionTitle: {
        marginTop: 6,
        marginBottom: 10,
        marginLeft: 3,
        fontSize: 15,
        fontWeight: '900',
        color: '#374151',
    },
    rowGroup: {
        marginBottom: 18,
    },
    dangerSectionTitle: {
        color: '#991B1B',
    },
    deleteRow: {
        minHeight: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 13,
        paddingVertical: 8,
    },
    deleteRowPressed: {
        backgroundColor: '#FEF2F2',
    },
    deleteRowDisabled: {
        opacity: 0.55,
    },
    deleteLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteIconContainer: {
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
        borderRadius: 12,
        backgroundColor: '#FEF2F2',
    },
    deleteIcon: {
        fontSize: 17,
    },
    deleteTextContainer: {
        flex: 1,
    },
    deleteTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#B91C1C',
    },
    deleteSubtitle: {
        marginTop: 2,
        fontSize: 11,
        color: '#991B1B',
    },
    deleteChevron: {
        marginLeft: 10,
        fontSize: 25,
        lineHeight: 25,
        color: '#DC2626',
    },
});
