import React from "react";

import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import SummaryCard from "../../components/cards/SummaryCard";

export default function SleepScreen() {
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Sleep"
        icon="😴"
      />

      <SummaryCard
        icon="🌙"
        title="Night Sleep"
        value="8h 20m"
      />

      <SummaryCard
        icon="☀️"
        title="Nap"
        value="1h 15m"
      />

      <PrimaryButton
        title="Start Sleep"
        onPress={() => {}}
      />
    </ScreenLayout>
  );
}