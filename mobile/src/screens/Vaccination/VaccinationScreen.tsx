import React, { useEffect } from 'react';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import SummaryCard from '../../components/cards/SummaryCard';
import VaccinationCard from '../../components/cards/VaccinationCard';
import { useVaccinationStore } from '../../store/VaccinationStore';
import vaccineInfo from '../../utils/vaccineInfo';
import { getVaccineStatus } from '../../utils/vaccineStatus';
export default function VaccinationScreen() {
    const {
        vaccines,
        upcoming,
        completed,
        loadVaccinations,
        markCompleted,
        markPending,
    } = useVaccinationStore();
    useEffect(() => {
        loadVaccinations();
    }, []);
    return (
        <ScreenLayout>
            <ScreenTitle title="Vaccination" icon="💉" />
            <SummaryCard
                icon="🟢"
                title="Completed"
                value={completed.toString()}
                color="#22C55E"
            />
            <SummaryCard
                icon="🔵"
                title="Upcoming"
                value={upcoming.toString()}
                color="#2563EB"
            />
            {vaccines.map((vaccine) => {
                const info = vaccineInfo[vaccine.vaccine] ?? {
                    title: vaccine.vaccine,
                    diseases: [],
                };
                return (
                    <VaccinationCard
                        key={vaccine.id}
                        vaccine={vaccine}
                        description={info.diseases}
                        status={getVaccineStatus(vaccine)}
                        onComplete={async () => {
                            await markCompleted(vaccine.id!);
                        }}
                        onPending={async () => {
                            await markPending(vaccine.id!);
                        }}
                    />
                );
            })}
        </ScreenLayout>
    );
}
