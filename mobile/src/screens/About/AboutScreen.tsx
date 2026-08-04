import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
interface InfoRowProps {
    label: string;
    value: string;
    isLast?: boolean;
}
function InfoRow({ label, value, isLast = false }: InfoRowProps) {
    return (
        <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
}
export default function AboutScreen() {
    return (
        <ScreenLayout>
            <ScreenTitle title="About Niva" icon="🌿" />
            <View style={styles.brandCard}>
                <Image
                    source={require('../../../assets/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.appName}>Niva</Text>
                <Text style={styles.tagline}>Growing Healthy. Together.</Text>
                <Text style={styles.description}>
                    A private baby-care companion for tracking health records, feeding,
                    sleep, growth, medication and vaccinations.
                </Text>
            </View>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <View style={styles.missionCard}>
                <Text style={styles.missionText}>
                    Helping parents keep every important health record, milestone, and
                    vaccination in one trusted place—from birth through childhood.
                </Text>
            </View>
            <Text style={styles.sectionTitle}>App Information</Text>
            <View style={styles.infoCard}>
                <InfoRow label="App" value="Niva" />
                <InfoRow label="Version" value="1.0.0" />
                <InfoRow label="Data Storage" value="Local device" />
                <InfoRow label="Account Required" value="No" isLast />
            </View>
            <Text style={styles.sectionTitle}>Privacy First</Text>
            <View style={styles.privacyCard}>
                <View style={styles.privacyIcon}>
                    <Text style={styles.privacyIconText}>🔒</Text>
                </View>
                <View style={styles.privacyContent}>
                    <Text style={styles.privacyTitle}>
                        Your family's data stays private
                    </Text>
                    <Text style={styles.privacyText}>
                        Niva currently stores baby profiles, care records and profile
                        photos locally on this device. No account is required.
                    </Text>
                </View>
            </View>
            <Text style={styles.footer}>Made with care for growing families.</Text>
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    brandCard: {
        alignItems: 'center',
        marginBottom: 22,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 22,
        paddingVertical: 26,
    },
    logo: {
        width: 112,
        height: 112,
        borderRadius: 28,
    },
    appName: {
        marginTop: 14,
        fontSize: 30,
        fontWeight: '900',
        color: '#065F46',
    },
    tagline: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: '800',
        color: '#059669',
    },
    description: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 21,
        color: '#6B7280',
    },
    sectionTitle: {
        marginTop: 4,
        marginBottom: 10,
        marginLeft: 3,
        fontSize: 15,
        fontWeight: '900',
        color: '#374151',
    },
    missionCard: {
        marginBottom: 20,
        borderRadius: 18,
        backgroundColor: '#ECFDF5',
        padding: 17,
    },
    missionText: {
        fontSize: 14,
        lineHeight: 21,
        color: '#065F46',
    },
    infoCard: {
        marginBottom: 20,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
    },
    infoRow: {
        minHeight: 51,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    infoRowLast: {
        borderBottomWidth: 0,
    },
    infoLabel: {
        flex: 1,
        marginRight: 14,
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
    infoValue: {
        flex: 1,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
    },
    privacyCard: {
        flexDirection: 'row',
        marginBottom: 20,
        borderRadius: 18,
        backgroundColor: '#EEF2FF',
        padding: 16,
    },
    privacyIcon: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
        borderRadius: 14,
        backgroundColor: '#E0E7FF',
    },
    privacyIconText: {
        fontSize: 21,
    },
    privacyContent: {
        flex: 1,
    },
    privacyTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#3730A3',
    },
    privacyText: {
        marginTop: 5,
        fontSize: 13,
        lineHeight: 19,
        color: '#4F46E5',
    },
    footer: {
        marginBottom: 22,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
    },
});
