import React from "react";

import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import SummaryCard from "../../components/cards/SummaryCard";

export default function VaccinationScreen() {
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Vaccination"
        icon="💉"
      />

      <SummaryCard
        icon="🟢"
        title="Completed"
        value="3"
        color="#22C55E"
      />

      <SummaryCard
        icon="🟠"
        title="Upcoming"
        value="1"
        color="#F59E0B"
      />

      <PrimaryButton
        title="View Schedule"
        onPress={() => {}}
      />
    </ScreenLayout>
  );
}