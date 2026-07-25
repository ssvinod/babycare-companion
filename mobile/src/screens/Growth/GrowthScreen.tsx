import React from "react";

import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import SummaryCard from "../../components/cards/SummaryCard";

export default function GrowthScreen() {
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Growth"
        icon="📈"
      />

      <SummaryCard
        icon="⚖️"
        title="Weight"
        value="3.2 kg"
      />

      <SummaryCard
        icon="📏"
        title="Height"
        value="57 cm"
      />

      <SummaryCard
        icon="🧒"
        title="WHO Percentile"
        value="Pending"
        color="#F59E0B"
      />

      <PrimaryButton
        title="Add Growth"
        onPress={() => {}}
      />
    </ScreenLayout>
  );
}