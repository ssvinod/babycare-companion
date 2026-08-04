import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileRow from '../../components/profile/ProfileRow';
import { useBabyStore } from '../../store/BabyStore';
export default function SettingsScreen({ navigation }: any) {
    const { baby, loadBaby } = useBabyStore();
    useFocusEffect(
        useCallback(() => {
            loadBaby();
        }, [loadBaby])
    );
    if (!baby) {
        return null;
    }
    return (
        <ScreenLayout>
            <ScreenTitle title="Profile" icon="👶" />
            <ProfileHeader baby={baby} />
            <ProfileRow
                icon="✏️"
                title="Edit Baby Profile"
                subtitle="Update name, date of birth, gender and blood group"
                onPress={() => navigation.navigate('EditBabyProfile')}
            />
            <ProfileRow
                icon="🔔"
                title="Reminder Settings"
                subtitle="Manage medication and vaccination reminders"
                disabled
                showArrow={false}
            />
            <ProfileRow
                icon="💾"
                title="Backup Data"
                subtitle="Coming soon"
                disabled
                showArrow={false}
            />
            <ProfileRow
                icon="📤"
                title="Export Data"
                subtitle="Coming soon"
                disabled
                showArrow={false}
            />
            <ProfileRow
                icon="🔒"
                title="Privacy"
                subtitle="Learn how your baby's data is stored"
                disabled
                showArrow={false}
            />
            <ProfileRow
                icon="❓"
                title="Help"
                subtitle="Guidance and frequently asked questions"
                disabled
                showArrow={false}
            />
            <ProfileRow
                icon="ℹ️"
                title="About Niva"
                subtitle="Version 1.0.0"
                disabled
                showArrow={false}
            />
        </ScreenLayout>
    );
}
