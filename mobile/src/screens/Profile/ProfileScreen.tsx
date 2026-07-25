import React from "react";

import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import SummaryCard from "../../components/cards/SummaryCard";

import { useBabyStore } from "../../store/BabyStore";

export default function ProfileScreen() {
  const { baby } = useBabyStore();

  if (!baby) return null;

  return (
    <ScreenLayout>
      <ScreenTitle
        title="Profile"
        icon="👶"
      />

      <SummaryCard
        icon="👤"
        title="Name"
        value={baby.name}
      />

      <SummaryCard
        icon="🎂"
        title="Birth Date"
        value={baby.birthDate}
      />

      <SummaryCard
        icon="🚻"
        title="Gender"
        value={baby.gender}
      />

      <PrimaryButton
        title="Edit Profile"
        onPress={() => {}}
      />
    </ScreenLayout>
  );
}