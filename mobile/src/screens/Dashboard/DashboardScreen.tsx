import React, { useEffect } from "react";

import ScreenLayout from "../../components/common/ScreenLayout";
import HeroCard from "../../components/hero/HeroCard";
import QuickActionGrid from "../../components/widgets/QuickActionGrid";
import SummaryCard from "../../components/cards/SummaryCard";
import ScreenTitle from "../../components/common/ScreenTitle";

import { calculateAge } from "../../utils/calculateAge";
import { useBabyStore } from "../../store/BabyStore";
import TimelineWidget from "../../components/widgets/TimelineWidget";
import ReminderWidget from "../../components/widgets/ReminderWidget";
import ProgressSection from "../../components/widgets/ProgressSection";
import { useDashboardStore } from "../../store/DashboardStore";

function formatDateTime(value: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function DashboardScreen() {
  const { baby, loadBaby } = useBabyStore();

  const {
    todayFeedings,
    lastFeeding,
    refresh,
  } = useDashboardStore();

  useEffect(() => {
    loadBaby();
    refresh();
  }, []);

  if (!baby) return null;

  return (
    <ScreenLayout>
      <HeroCard
        name={baby.name}
        age={calculateAge(baby.birthDate)}
      />

      <QuickActionGrid />

      <ProgressSection />

      <TimelineWidget />

      <ReminderWidget />

      <ScreenTitle
        title="Today's Summary"
        icon="📋"
      />

      <SummaryCard
        icon="🍼"
        title="Today's Feedings"
        value={todayFeedings.toString()}
        color="#2563EB"
      />

      <SummaryCard
        icon="🕒"
        title="Last Feeding"
        value={formatDateTime(lastFeeding)}
      />

      <SummaryCard
        icon="😴"
        title="Next Nap"
        value="10:30 AM"
        color="#7C3AED"
      />

      <SummaryCard
        icon="💉"
        title="Vaccination"
        value="No pending vaccine"
        color="#16A34A"
      />

      <SummaryCard
        icon="📈"
        title="Latest Growth"
        value={`${baby.weight ?? "-"} kg   •   ${baby.height ?? "-"} cm`}
        color="#F59E0B"
      />
    </ScreenLayout>
  );
}