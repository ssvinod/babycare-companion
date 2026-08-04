import React from 'react';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import ProfileRow from '../../components/profile/ProfileRow';
export default function RecordsScreen({ navigation }: any) {
    return (
        <ScreenLayout>
            <ScreenTitle title="Records" icon="📁" />
            <ProfileRow
                icon="🍼"
                title="Feeding"
                subtitle="View feeding history and daily records"
                onPress={() => navigation.navigate('FeedingRecords')}
            />
            <ProfileRow
                icon="😴"
                title="Sleep"
                subtitle="View sleep sessions and duration"
                onPress={() => navigation.navigate('SleepDetails')}
            />
            <ProfileRow
                icon="📈"
                title="Growth"
                subtitle="View weight, height and head-circumference records"
                onPress={() => navigation.navigate('GrowthHistory')}
            />
            <ProfileRow
                icon="💊"
                title="Medication"
                subtitle="View medicines, schedules and dose history"
                onPress={() => navigation.navigate('Medication')}
            />
            <ProfileRow
                icon="💉"
                title="Vaccinations"
                subtitle="View upcoming and completed vaccinations"
                onPress={() => navigation.navigate('VaccinationDetails')}
            />
            <ProfileRow
                icon="📄"
                title="Documents"
                subtitle="Scan and review baby-care documents"
                onPress={() => navigation.navigate('Scan')}
            />
        </ScreenLayout>
    );
}
