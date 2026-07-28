import React, { useEffect } from "react";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import SleepCard from "../../components/cards/SleepCard";

import { useSleepStore } from "../../store/SleepStore";
import { useDashboardStore } from "../../store/DashboardStore";

export default function SleepScreen() {
  const {
    sleeps,
    activeSleep,
    loadSleeps,
    startSleep,
    finishSleep,
    deleteSleep,
  } = useSleepStore();

  const { refresh } = useDashboardStore();

  useEffect(() => {
    loadSleeps();
  }, []);

  return (
    <ScreenLayout>
      <ScreenTitle
        title="Sleep"
        icon="😴"
      />

      {sleeps.map((item) => (
        <SleepCard
          key={item.id}
          sleep={item}
          onDelete={async () => {
            await deleteSleep(item.id!);
            await loadSleeps();
            refresh();
          }}
        />
      ))}

      {activeSleep ? (
        <PrimaryButton
          title="Wake Up"
          onPress={async () => {
            await finishSleep(
              activeSleep.id!,
              new Date().toISOString()
            );

            await loadSleeps();
            refresh();
          }}
        />
      ) : (
        <PrimaryButton
          title="+ Start Sleep"
          onPress={async () => {
            await startSleep();

            await loadSleeps();
            refresh();
          }}
        />
      )}
    </ScreenLayout>
  );
}